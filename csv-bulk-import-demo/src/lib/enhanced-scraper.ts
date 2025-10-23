import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CompleteJobData {
  jobTitle: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  applyLink: string;
  source: string;
  companyLogoUrl?: string;
  heroBannerUrl?: string;
}

export interface ScrapeResult {
  success: boolean;
  data?: CompleteJobData;
  error?: string;
  url: string;
}

/**
 * Enhanced job scraper that extracts ALL job data from URLs
 * Supports: LinkedIn, JobStreet, CareerFuture SG
 */
export class EnhancedJobScraper {
  private timeout: number = 15000;

  constructor(timeout: number = 15000) {
    this.timeout = timeout;
  }

  /**
   * Scrape complete job data from a URL
   */
  async scrapeJobUrl(url: string): Promise<ScrapeResult> {
    try {
      console.log(`Scraping: ${url}`);

      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      const $ = cheerio.load(response.data);
      const source = this.detectSource(url);

      let jobData: CompleteJobData = {
        jobTitle: '',
        companyName: '',
        location: '',
        salaryRange: 'Not specified',
        jobDescription: '',
        applyLink: url,
        source: source,
      };

      // Extract based on source
      if (source === 'LinkedIn') {
        jobData = this.extractLinkedInData($, url);
      } else if (source === 'JobStreet') {
        jobData = this.extractJobStreetData($, url);
      } else if (source === 'CareerFuture SG') {
        jobData = this.extractCareerFutureData($, url);
      } else {
        jobData = this.extractGenericData($, url);
      }

      // Validate required fields
      const missingFields = [];
      if (!jobData.jobTitle) missingFields.push('Job Title');
      if (!jobData.companyName) missingFields.push('Company Name');
      if (!jobData.jobDescription) missingFields.push('Job Description');
      if (!jobData.location) missingFields.push('Location');

      if (missingFields.length > 0) {
        return {
          success: false,
          error: `Failed to extract: ${missingFields.join(', ')}. The page structure may have changed or requires login.`,
          url
        };
      }

      return {
        success: true,
        data: jobData,
        url
      };

    } catch (error: any) {
      console.error(`Error scraping ${url}:`, error.message);
      return {
        success: false,
        error: `Scraping failed: ${error.message}`,
        url
      };
    }
  }

  /**
   * Detect source from URL
   */
  private detectSource(url: string): string {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('linkedin.com')) return 'LinkedIn';
    if (lowercaseUrl.includes('jobstreet')) return 'JobStreet';
    if (lowercaseUrl.includes('mycareersfuture.gov.sg') || lowercaseUrl.includes('careerfuture')) return 'CareerFuture SG';
    return 'Other';
  }

  /**
   * Extract LinkedIn job data
   */
  private extractLinkedInData($: cheerio.CheerioAPI, url: string): CompleteJobData {
    const jobTitle =
      $('h1.t-24').first().text().trim() ||
      $('h1.job-details-jobs-unified-top-card__job-title').first().text().trim() ||
      $('h1').first().text().trim();

    const companyName =
      $('a.job-details-jobs-unified-top-card__company-name').first().text().trim() ||
      $('.job-details-jobs-unified-top-card__primary-description a').first().text().trim() ||
      $('a.topcard__org-name-link').first().text().trim();

    const location =
      $('.job-details-jobs-unified-top-card__bullet').first().text().trim() ||
      $('span.topcard__flavor--bullet').first().text().trim() ||
      $('[class*="location"]').first().text().trim();

    const salaryElement = $('.job-details-jobs-unified-top-card__job-insight span').filter((i, el) =>
      $(el).text().includes('$') || $(el).text().includes('SGD') || $(el).text().includes('USD')
    );
    const salaryRange = salaryElement.first().text().trim() || 'Not specified';

    const description =
      $('.job-details-jobs-unified-top-card__job-description').first().text().trim() ||
      $('.jobs-description__content').first().text().trim() ||
      $('.description__text').first().text().trim() ||
      $('div[class*="description"]').first().text().trim();

    const companyLogo =
      $('img.artdeco-entity-image').first().attr('src') ||
      $('img[data-delayed-url]').first().attr('data-delayed-url') ||
      $('img.job-details-jobs-unified-top-card__company-logo').first().attr('src');

    const heroBanner =
      $('img.job-details-jobs-unified-top-card__hero-image').first().attr('src');

    return {
      jobTitle,
      companyName,
      location,
      salaryRange,
      jobDescription: description,
      applyLink: url,
      source: 'LinkedIn',
      companyLogoUrl: companyLogo,
      heroBannerUrl: heroBanner,
    };
  }

  /**
   * Extract JobStreet job data
   */
  private extractJobStreetData($: cheerio.CheerioAPI, url: string): CompleteJobData {
    const jobTitle =
      $('h1[data-automation="job-detail-title"]').first().text().trim() ||
      $('h1').first().text().trim();

    const companyName =
      $('[data-automation="advertiser-name"]').first().text().trim() ||
      $('span[data-automation="advertiser-name"]').first().text().trim();

    const location =
      $('[data-automation="job-detail-location"]').first().text().trim() ||
      $('[class*="location"]').first().text().trim();

    const salaryRange =
      $('[data-automation="job-detail-salary"]').first().text().trim() || 'Not specified';

    const description =
      $('[data-automation="jobDescription"]').first().text().trim() ||
      $('div[data-automation="jobAdDetails"]').first().text().trim() ||
      $('[class*="description"]').first().text().trim();

    const companyLogo =
      $('img[data-automation="job-detail-company-logo"]').attr('src') ||
      $('.company-logo img').first().attr('src');

    const heroBanner =
      $('img[data-automation="company-banner"]').attr('src');

    return {
      jobTitle,
      companyName,
      location,
      salaryRange,
      jobDescription: description,
      applyLink: url,
      source: 'JobStreet',
      companyLogoUrl: companyLogo,
      heroBannerUrl: heroBanner,
    };
  }

  /**
   * Extract CareerFuture SG job data
   */
  private extractCareerFutureData($: cheerio.CheerioAPI, url: string): CompleteJobData {
    const jobTitle =
      $('h1.job-title').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('[class*="job-title"]').first().text().trim();

    const companyName =
      $('.company-name').first().text().trim() ||
      $('a[href*="/company/"]').first().text().trim() ||
      $('[class*="company"]').first().text().trim();

    const location =
      $('.job-location').first().text().trim() ||
      $('[class*="location"]').first().text().trim();

    const salaryRange =
      $('.salary-range').first().text().trim() ||
      $('[class*="salary"]').first().text().trim() ||
      'Not specified';

    const description =
      $('.job-description').first().text().trim() ||
      $('[class*="description"]').first().text().trim() ||
      $('section').filter((i, el) => $(el).text().length > 100).first().text().trim();

    const companyLogo =
      $('.company-logo img').first().attr('src') ||
      $('img[alt*="logo"]').first().attr('src');

    const heroBanner =
      $('.company-banner img').first().attr('src') ||
      $('.hero-image img').first().attr('src');

    return {
      jobTitle,
      companyName,
      location,
      salaryRange,
      jobDescription: description,
      applyLink: url,
      source: 'CareerFuture SG',
      companyLogoUrl: companyLogo,
      heroBannerUrl: heroBanner,
    };
  }

  /**
   * Extract generic job data (fallback)
   */
  private extractGenericData($: cheerio.CheerioAPI, url: string): CompleteJobData {
    // Try to find job title
    const jobTitle =
      $('h1').first().text().trim() ||
      $('[class*="title"]').filter('h1, h2').first().text().trim() ||
      $('title').text().split('|')[0].trim();

    // Try to find company name
    const companyName =
      $('.company-name').first().text().trim() ||
      $('[class*="company"]').first().text().trim() ||
      $('meta[property="og:site_name"]').attr('content') ||
      '';

    // Try to find location
    const location =
      $('.location').first().text().trim() ||
      $('[class*="location"]').first().text().trim() ||
      $('[class*="address"]').first().text().trim() ||
      '';

    // Try to find salary
    const salaryRange =
      $('.salary').first().text().trim() ||
      $('[class*="salary"]').first().text().trim() ||
      'Not specified';

    // Try to find description
    const description =
      $('.job-description').first().text().trim() ||
      $('[class*="description"]').first().text().trim() ||
      $('article').first().text().trim() ||
      $('.content').first().text().trim() ||
      $('main').first().text().trim() ||
      '';

    // Try to find logo
    const companyLogo =
      $('img[alt*="logo" i]').first().attr('src') ||
      $('.logo img').first().attr('src') ||
      $('header img').first().attr('src');

    const heroBanner =
      $('.banner img').first().attr('src') ||
      $('.hero img').first().attr('src');

    return {
      jobTitle,
      companyName,
      location,
      salaryRange,
      jobDescription: description,
      applyLink: url,
      source: 'Other',
      companyLogoUrl: companyLogo,
      heroBannerUrl: heroBanner,
    };
  }

  /**
   * Batch scrape multiple URLs
   */
  async batchScrape(urls: string[], onProgress?: (current: number, total: number, url: string) => void): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = [];
    const delayMs = 2000; // 2 second delay between requests

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      if (onProgress) {
        onProgress(i + 1, urls.length, url);
      }

      const result = await this.scrapeJobUrl(url);
      results.push(result);

      // Rate limiting (except for last URL)
      if (i < urls.length - 1 && delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }
}

export const enhancedJobScraper = new EnhancedJobScraper();
