import Papa from 'papaparse';

export interface URLRow {
  'URL': string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface URLValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  urls: string[];
  totalRows: number;
}

/**
 * Validates CSV data containing only job URLs
 */
export class URLCSVValidator {
  /**
   * Validate CSV file content with URLs
   */
  validateCSV(fileContent: string): URLValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const urls: string[] = [];

    try {
      // Parse CSV
      const parseResult = Papa.parse<URLRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
      });

      const data = parseResult.data;

      if (data.length === 0) {
        errors.push({
          row: 0,
          field: 'file',
          message: 'CSV file is empty or has no data rows'
        });
        return { isValid: false, errors, warnings, urls: [], totalRows: 0 };
      }

      // Validate header
      const headers = Object.keys(data[0] || {});
      if (!headers.includes('URL')) {
        errors.push({
          row: 0,
          field: 'headers',
          message: 'Missing required column: URL'
        });
        return { isValid: false, errors, warnings, urls: [], totalRows: 0 };
      }

      // Validate each row
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is headers
        const url = row['URL']?.trim();

        // Check if URL exists
        if (!url || url === '') {
          errors.push({
            row: rowNumber,
            field: 'URL',
            message: 'URL is required',
            value: url
          });
          return;
        }

        // Validate URL format
        if (!this.isValidUrl(url)) {
          errors.push({
            row: rowNumber,
            field: 'URL',
            message: 'Invalid URL format',
            value: url
          });
          return;
        }

        // Detect source and validate
        const source = this.detectSource(url);
        if (!source) {
          warnings.push({
            row: rowNumber,
            field: 'URL',
            message: 'URL is not from a recognized job site (LinkedIn, JobStreet, CareerFuture SG). Scraping may not work optimally.',
            value: url
          });
        }

        urls.push(url);
      });

      // Check for duplicate URLs
      const duplicates = this.findDuplicates(urls);
      if (duplicates.size > 0) {
        duplicates.forEach((rows, url) => {
          warnings.push({
            row: rows[0],
            field: 'URL',
            message: `Duplicate URL found in rows: ${rows.join(', ')}`,
            value: url
          });
        });
      }

    } catch (error: any) {
      errors.push({
        row: 0,
        field: 'file',
        message: `Failed to parse CSV: ${error.message}`
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      urls,
      totalRows: urls.length
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Detect job source from URL
   */
  detectSource(url: string): string | null {
    const lowercaseUrl = url.toLowerCase();

    if (lowercaseUrl.includes('linkedin.com')) {
      return 'LinkedIn';
    } else if (lowercaseUrl.includes('jobstreet.com')) {
      return 'JobStreet';
    } else if (lowercaseUrl.includes('mycareersfuture.gov.sg') || lowercaseUrl.includes('careerfuture')) {
      return 'CareerFuture SG';
    }

    return null; // Unknown source
  }

  /**
   * Find duplicate URLs in the list
   */
  private findDuplicates(urls: string[]): Map<string, number[]> {
    const urlMap = new Map<string, number[]>();
    const duplicates = new Map<string, number[]>();

    urls.forEach((url, index) => {
      const rowNumber = index + 2;
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      urlMap.get(url)!.push(rowNumber);
    });

    urlMap.forEach((rows, url) => {
      if (rows.length > 1) {
        duplicates.set(url, rows);
      }
    });

    return duplicates;
  }

  /**
   * Parse CSV file content
   */
  parseCSV(fileContent: string): string[] {
    const parseResult = Papa.parse<URLRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    return parseResult.data
      .map(row => row['URL']?.trim())
      .filter(url => url && url !== '');
  }
}

export const urlCSVValidator = new URLCSVValidator();
