import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedJobData {
  companyLogoUrl?: string;
  heroBannerUrl?: string;
  jobTitle?: string;
  companyName?: string;
  location?: string;
  salaryRange?: string;
  jobDescription?: string;
}

/**
 * Enhanced job scraper using Crawl4AI concepts
 * This scrapes job postings to extract additional data like logos and banners
 */
export class JobScraper {
  private timeout: number = 10000;

  constructor(timeout: number = 10000) {
    this.timeout = timeout;
  }

  /**
   * Scrape a job URL to extract logo, banner, and other metadata
   */
  async scrapeJobUrl(url: string): Promise<ScrapedJobData> {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      const $ = cheerio.load(response.data);
      const result: ScrapedJobData = {};

      // Extract based on common job board patterns
      if (url.includes('linkedin.com')) {
        result.companyLogoUrl = this.extractLinkedInLogo($);
        result.heroBannerUrl = this.extractLinkedInBanner($);
        result.jobTitle = this.extractLinkedInJobTitle($);
        result.companyName = this.extractLinkedInCompanyName($);
        result.location = this.extractLinkedInLocation($);
        result.salaryRange = this.extractLinkedInSalary($);
        result.jobDescription = this.extractLinkedInDescription($);
      } else if (url.includes('jobstreet')) {
        result.companyLogoUrl = this.extractJobStreetLogo($);
        result.heroBannerUrl = this.extractJobStreetBanner($);
        result.jobTitle = this.extractJobStreetJobTitle($);
        result.companyName = this.extractJobStreetCompanyName($);
        result.location = this.extractJobStreetLocation($);
        result.salaryRange = this.extractJobStreetSalary($);
        result.jobDescription = this.extractJobStreetDescription($);
      } else if (url.includes('mycareersfuture.gov.sg')) {
        result.companyLogoUrl = this.extractCareerFutureLogo($);
        result.heroBannerUrl = this.extractCareerFutureBanner($);
        result.jobTitle = this.extractCareerFutureJobTitle($);
        result.companyName = this.extractCareerFutureCompanyName($);
        result.location = this.extractCareerFutureLocation($);
        result.salaryRange = this.extractCareerFutureSalary($);
        result.jobDescription = this.extractCareerFutureDescription($);
      } else {
        // Generic extraction for other sites
        result.companyLogoUrl = this.extractGenericLogo($);
        result.heroBannerUrl = this.extractGenericBanner($);
        result.jobTitle = this.extractGenericJobTitle($);
        result.companyName = this.extractGenericCompanyName($);
      }

      return result;
    } catch (error: any) {
      console.error(`Error scraping ${url}:`, error.message);
      return {};
    }
  }

  // LinkedIn extractors
  private extractLinkedInLogo($: cheerio.CheerioAPI): string | undefined {
    const logo = $('img.artdeco-entity-image').first().attr('src') ||
                 $('img[data-delayed-url]').first().attr('data-delayed-url') ||
                 $('img.job-details-jobs-unified-top-card__company-logo').first().attr('src');
    return logo || undefined;
  }

  private extractLinkedInBanner($: cheerio.CheerioAPI): string | undefined {
    const banner = $('img.job-details-jobs-unified-top-card__hero-image').first().attr('src');
    return banner || undefined;
  }

  private extractLinkedInJobTitle($: cheerio.CheerioAPI): string | undefined {
    return $('h1.t-24, h1.job-details-jobs-unified-top-card__job-title').first().text().trim() || undefined;
  }

  private extractLinkedInCompanyName($: cheerio.CheerioAPI): string | undefined {
    return $('a.job-details-jobs-unified-top-card__company-name').first().text().trim() ||
           $('.job-details-jobs-unified-top-card__primary-description a').first().text().trim() || undefined;
  }

  private extractLinkedInLocation($: cheerio.CheerioAPI): string | undefined {
    return $('.job-details-jobs-unified-top-card__bullet').first().text().trim() || undefined;
  }

  private extractLinkedInSalary($: cheerio.CheerioAPI): string | undefined {
    return $('.job-details-jobs-unified-top-card__job-insight span').filter((i, el) =>
      $(el).text().includes('$') || $(el).text().includes('SGD')
    ).first().text().trim() || undefined;
  }

  private extractLinkedInDescription($: cheerio.CheerioAPI): string | undefined {
    return $('.job-details-jobs-unified-top-card__job-description').first().text().trim() ||
           $('.jobs-description__content').first().text().trim() || undefined;
  }

  // JobStreet extractors
  private extractJobStreetLogo($: cheerio.CheerioAPI): string | undefined {
    return $('img[data-automation="job-detail-company-logo"]').attr('src') ||
           $('.company-logo img').first().attr('src') || undefined;
  }

  private extractJobStreetBanner($: cheerio.CheerioAPI): string | undefined {
    return $('img[data-automation="company-banner"]').attr('src') || undefined;
  }

  private extractJobStreetJobTitle($: cheerio.CheerioAPI): string | undefined {
    return $('h1[data-automation="job-detail-title"]').first().text().trim() || undefined;
  }

  private extractJobStreetCompanyName($: cheerio.CheerioAPI): string | undefined {
    return $('[data-automation="advertiser-name"]').first().text().trim() || undefined;
  }

  private extractJobStreetLocation($: cheerio.CheerioAPI): string | undefined {
    return $('[data-automation="job-detail-location"]').first().text().trim() || undefined;
  }

  private extractJobStreetSalary($: cheerio.CheerioAPI): string | undefined {
    return $('[data-automation="job-detail-salary"]').first().text().trim() || undefined;
  }

  private extractJobStreetDescription($: cheerio.CheerioAPI): string | undefined {
    return $('[data-automation="jobDescription"]').first().text().trim() || undefined;
  }

  // CareerFuture SG extractors
  private extractCareerFutureLogo($: cheerio.CheerioAPI): string | undefined {
    return $('.company-logo img').first().attr('src') ||
           $('img[alt*="logo"]').first().attr('src') || undefined;
  }

  private extractCareerFutureBanner($: cheerio.CheerioAPI): string | undefined {
    return $('.company-banner img').first().attr('src') || undefined;
  }

  private extractCareerFutureJobTitle($: cheerio.CheerioAPI): string | undefined {
    return $('h1.job-title').first().text().trim() ||
           $('h1').first().text().trim() || undefined;
  }

  private extractCareerFutureCompanyName($: cheerio.CheerioAPI): string | undefined {
    return $('.company-name').first().text().trim() ||
           $('a[href*="/company/"]').first().text().trim() || undefined;
  }

  private extractCareerFutureLocation($: cheerio.CheerioAPI): string | undefined {
    return $('.job-location').first().text().trim() || undefined;
  }

  private extractCareerFutureSalary($: cheerio.CheerioAPI): string | undefined {
    return $('.salary-range').first().text().trim() || undefined;
  }

  private extractCareerFutureDescription($: cheerio.CheerioAPI): string | undefined {
    return $('.job-description').first().text().trim() || undefined;
  }

  // Generic extractors for unknown sites
  private extractGenericLogo($: cheerio.CheerioAPI): string | undefined {
    // Try common logo patterns
    const logoSelectors = [
      'img[alt*="logo" i]',
      '.logo img',
      '#logo img',
      '.company-logo img',
      'header img',
      'img.logo'
    ];

    for (const selector of logoSelectors) {
      const logo = $(selector).first().attr('src');
      if (logo) return logo;
    }
    return undefined;
  }

  private extractGenericBanner($: cheerio.CheerioAPI): string | undefined {
    const bannerSelectors = [
      '.banner img',
      '.hero-banner img',
      '.header-image img',
      'img[alt*="banner" i]'
    ];

    for (const selector of bannerSelectors) {
      const banner = $(selector).first().attr('src');
      if (banner) return banner;
    }
    return undefined;
  }

  private extractGenericJobTitle($: cheerio.CheerioAPI): string | undefined {
    return $('h1').first().text().trim() || undefined;
  }

  private extractGenericCompanyName($: cheerio.CheerioAPI): string | undefined {
    const companySelectors = [
      '.company-name',
      '[class*="company"]',
      '[data-company]'
    ];

    for (const selector of companySelectors) {
      const company = $(selector).first().text().trim();
      if (company) return company;
    }
    return undefined;
  }

  /**
   * Batch scrape multiple URLs with rate limiting
   */
  async batchScrape(urls: string[], delayMs: number = 1000): Promise<Map<string, ScrapedJobData>> {
    const results = new Map<string, ScrapedJobData>();

    for (const url of urls) {
      const data = await this.scrapeJobUrl(url);
      results.set(url, data);

      // Rate limiting to avoid being blocked
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }
}

export const jobScraper = new JobScraper();
