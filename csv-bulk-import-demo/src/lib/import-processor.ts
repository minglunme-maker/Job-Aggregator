import { getServiceSupabase } from './supabase';
import { CSVRow } from './csv-validator';
import { jobScraper } from './scraper';
import { jobCategorizer } from './categorizer';

export interface ProcessedJob {
  job_title: string;
  company_name: string;
  location: string;
  salary_range: string;
  job_description: string;
  apply_link: string;
  source: string;
  category?: string;
  company_logo_url?: string;
  hero_banner_url?: string;
}

export interface ImportResult {
  success: boolean;
  jobId?: string;
  error?: string;
  rowNumber: number;
}

export interface ImportSummary {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  results: ImportResult[];
}

/**
 * Processes and imports jobs from CSV data
 */
export class ImportProcessor {
  private supabase = getServiceSupabase();

  /**
   * Check if a job already exists in the database
   */
  async checkDuplicate(applyLink: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('id')
      .eq('apply_link', applyLink)
      .single();

    return !!data && !error;
  }

  /**
   * Enrich job data with scraped information
   */
  async enrichJobData(row: CSVRow): Promise<ProcessedJob> {
    const processedJob: ProcessedJob = {
      job_title: row['Job Title'].trim(),
      company_name: row['Company Name'].trim(),
      location: row['Location'].trim(),
      salary_range: row['Salary Range']?.trim() || '',
      job_description: row['Job Description'].trim(),
      apply_link: row['Apply Link'].trim(),
      source: row['Source'].trim(),
    };

    try {
      // Scrape for logo and banner
      const scrapedData = await jobScraper.scrapeJobUrl(row['Apply Link']);

      if (scrapedData.companyLogoUrl) {
        processedJob.company_logo_url = scrapedData.companyLogoUrl;
      }

      if (scrapedData.heroBannerUrl) {
        processedJob.hero_banner_url = scrapedData.heroBannerUrl;
      }

      // Use scraped data to fill in missing fields
      if (!processedJob.salary_range && scrapedData.salaryRange) {
        processedJob.salary_range = scrapedData.salaryRange;
      }

      // AI categorization if not provided
      if (!row['Industry/Category'] || row['Industry/Category'].trim() === '') {
        const categorization = await jobCategorizer.categorizeJob(
          row['Job Title'],
          row['Job Description']
        );
        processedJob.category = categorization.category;
      } else {
        processedJob.category = row['Industry/Category'].trim();
      }

    } catch (error: any) {
      console.error(`Error enriching job data: ${error.message}`);
      // Continue with basic data even if enrichment fails

      // Fallback categorization
      if (!row['Industry/Category']) {
        const categorization = await jobCategorizer.categorizeJob(
          row['Job Title'],
          row['Job Description']
        );
        processedJob.category = categorization.category;
      }
    }

    return processedJob;
  }

  /**
   * Import a single job into the database
   */
  async importJob(job: ProcessedJob): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .insert([job])
        .select('id')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, jobId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Process and import multiple jobs from CSV data
   */
  async bulkImport(
    csvData: CSVRow[],
    options: {
      skipDuplicates?: boolean;
      enrichData?: boolean;
      batchSize?: number;
    } = {}
  ): Promise<ImportSummary> {
    const {
      skipDuplicates = true,
      enrichData = true,
      batchSize = 10
    } = options;

    const summary: ImportSummary = {
      total: csvData.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      results: []
    };

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (row, batchIndex) => {
          const rowNumber = i + batchIndex + 2; // +2 for header row and 0-indexing

          try {
            // Check for duplicates
            const isDuplicate = await this.checkDuplicate(row['Apply Link']);

            if (isDuplicate && skipDuplicates) {
              summary.duplicates++;
              summary.results.push({
                success: false,
                error: 'Duplicate job (already exists in database)',
                rowNumber
              });
              return;
            }

            // Enrich data if enabled
            let processedJob: ProcessedJob;
            if (enrichData) {
              processedJob = await this.enrichJobData(row);
            } else {
              // Basic processing without enrichment
              processedJob = {
                job_title: row['Job Title'].trim(),
                company_name: row['Company Name'].trim(),
                location: row['Location'].trim(),
                salary_range: row['Salary Range']?.trim() || '',
                job_description: row['Job Description'].trim(),
                apply_link: row['Apply Link'].trim(),
                source: row['Source'].trim(),
                category: row['Industry/Category']?.trim() || 'Other',
              };
            }

            // Import the job
            const result = await this.importJob(processedJob);

            if (result.success) {
              summary.successful++;
              summary.results.push({
                success: true,
                jobId: result.jobId,
                rowNumber
              });
            } else {
              summary.failed++;
              summary.results.push({
                success: false,
                error: result.error,
                rowNumber
              });
            }

          } catch (error: any) {
            summary.failed++;
            summary.results.push({
              success: false,
              error: error.message,
              rowNumber
            });
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < csvData.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return summary;
  }

  /**
   * Log import operation to database
   */
  async logImport(
    filename: string,
    summary: ImportSummary,
    errors: any[]
  ): Promise<string | null> {
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

export const importProcessor = new ImportProcessor();
