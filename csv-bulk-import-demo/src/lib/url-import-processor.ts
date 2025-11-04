import { getServiceSupabase } from './supabase';
import { enhancedJobScraper, ScrapeResult, CompleteJobData } from './enhanced-scraper';
import { jobCategorizer } from './categorizer';

export interface URLImportResult {
  url: string;
  success: boolean;
  jobId?: string;
  error?: string;
  scrapedData?: CompleteJobData;
}

export interface URLImportSummary {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  results: URLImportResult[];
}

export interface URLImportProgress {
  stage: 'scraping' | 'categorizing' | 'importing';
  current: number;
  total: number;
  url?: string;
}

/**
 * Processes job imports from URLs
 * Workflow: Scrape → Extract → Categorize → Import
 */
export class URLImportProcessor {
  private supabase = getServiceSupabase();

  /**
   * Check if a job URL already exists in database
   */
  async checkDuplicate(applyLink: string): Promise<boolean> {
    // In demo mode, skip duplicate check
    if (!this.supabase) {
      return false;
    }

    const { data, error } = await this.supabase
      .from('jobs')
      .select('id')
      .eq('apply_link', applyLink)
      .single();

    return !!data && !error;
  }

  /**
   * Check multiple URLs for duplicates
   */
  async checkDuplicates(urls: string[]): Promise<string[]> {
    // In demo mode, skip duplicate check
    if (!this.supabase) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('jobs')
      .select('apply_link')
      .in('apply_link', urls);

    if (error || !data) {
      return [];
    }

    return data.map(row => row.apply_link);
  }

  /**
   * Import jobs from URLs
   */
  async importFromURLs(
    urls: string[],
    options: {
      skipDuplicates?: boolean;
      categorizeWithAI?: boolean;
    } = {},
    onProgress?: (progress: URLImportProgress) => void
  ): Promise<URLImportSummary> {
    const { skipDuplicates = true, categorizeWithAI = true } = options;
    const isDemo = !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'demo';

    const summary: URLImportSummary = {
      total: urls.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      results: []
    };

    // Stage 1: Check for duplicates (skip in demo mode)
    let urlsToProcess = urls;
    if (skipDuplicates && !isDemo) {
      const existingUrls = await this.checkDuplicates(urls);
      urlsToProcess = urls.filter(url => !existingUrls.includes(url));
      summary.duplicates = existingUrls.length;

      // Mark duplicates in results
      existingUrls.forEach(url => {
        summary.results.push({
          url,
          success: false,
          error: 'Duplicate: Job already exists in database'
        });
      });
    }

    // Stage 2: Scrape URLs
    if (onProgress) {
      onProgress({ stage: 'scraping', current: 0, total: urlsToProcess.length });
    }

    const scrapeResults = await enhancedJobScraper.batchScrape(
      urlsToProcess,
      (current, total, url) => {
        if (onProgress) {
          onProgress({ stage: 'scraping', current, total, url });
        }
      }
    );

    // Stage 3: Categorize and Import
    for (let i = 0; i < scrapeResults.length; i++) {
      const scrapeResult = scrapeResults[i];

      if (onProgress) {
        onProgress({
          stage: 'importing',
          current: i + 1,
          total: scrapeResults.length,
          url: scrapeResult.url
        });
      }

      if (!scrapeResult.success || !scrapeResult.data) {
        summary.failed++;
        summary.results.push({
          url: scrapeResult.url,
          success: false,
          error: scrapeResult.error || 'Failed to scrape job data'
        });
        continue;
      }

      try {
        let jobData = scrapeResult.data;

        // AI Categorization
        if (categorizeWithAI) {
          const categorization = await jobCategorizer.categorizeJob(
            jobData.jobTitle,
            jobData.jobDescription
          );
          jobData = {
            ...jobData,
            category: categorization.category
          };
        }

        // Prepare for database
        const dbData = {
          job_title: jobData.jobTitle,
          company_name: jobData.companyName,
          location: jobData.location,
          salary_range: jobData.salaryRange,
          job_description: jobData.jobDescription,
          apply_link: jobData.applyLink,
          source: jobData.source,
          category: jobData.category || 'Other',
          company_logo_url: jobData.companyLogoUrl || null,
          hero_banner_url: jobData.heroBannerUrl || null
        };

        // Insert into database (skip in demo mode)
        if (isDemo) {
          // Demo mode: Just return success with scraped data (no database)
          console.log('📝 Demo mode: Skipping database insert, showing scraped data only');
          summary.successful++;
          summary.results.push({
            url: scrapeResult.url,
            success: true,
            jobId: `demo-${Date.now()}-${i}`,
            scrapedData: jobData
          });
        } else {
          const { data: insertedData, error: insertError } = await this.supabase
            .from('jobs')
            .insert([dbData])
            .select('id')
            .single();

          if (insertError) {
            summary.failed++;
            summary.results.push({
              url: scrapeResult.url,
              success: false,
              error: `Database error: ${insertError.message}`,
              scrapedData: jobData
            });
          } else {
            summary.successful++;
            summary.results.push({
              url: scrapeResult.url,
              success: true,
              jobId: insertedData.id,
              scrapedData: jobData
            });
          }
        }

      } catch (error: any) {
        summary.failed++;
        summary.results.push({
          url: scrapeResult.url,
          success: false,
          error: `Processing error: ${error.message}`,
          scrapedData: scrapeResult.data
        });
      }
    }

    return summary;
  }

  /**
   * Preview scraping (without importing)
   */
  async previewScraping(urls: string[], limit: number = 5): Promise<ScrapeResult[]> {
    const urlsToPreview = urls.slice(0, limit);
    return await enhancedJobScraper.batchScrape(urlsToPreview);
  }

  /**
   * Log import operation to database
   */
  async logImport(
    filename: string,
    summary: URLImportSummary,
    errors: any[]
  ): Promise<string | null> {
    // In demo mode, skip logging
    if (!this.supabase) {
      console.log('📝 Demo mode: Skipping import logging');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('import_logs')
        .insert([{
          filename,
          total_rows: summary.total,
          successful_imports: summary.successful,
          failed_imports: summary.failed,
          duplicate_count: summary.duplicates,
          import_status: 'completed',
          error_details: errors.length > 0 ? errors : null,
          completed_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) {
        console.error('Error logging import:', error);
        return null;
      }

      return data.id;
    } catch (error: any) {
      console.error('Error logging import:', error);
      return null;
    }
  }
}

export const urlImportProcessor = new URLImportProcessor();
