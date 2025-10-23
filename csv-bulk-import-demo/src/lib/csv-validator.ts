import Papa from 'papaparse';

export interface CSVRow {
  'Job Title': string;
  'Company Name': string;
  'Location': string;
  'Salary Range': string;
  'Job Description': string;
  'Apply Link': string;
  'Source': string;
  'Industry/Category'?: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  data: CSVRow[];
  totalRows: number;
}

const REQUIRED_FIELDS = [
  'Job Title',
  'Company Name',
  'Location',
  'Job Description',
  'Apply Link',
  'Source'
];

const OPTIONAL_FIELDS = [
  'Salary Range',
  'Industry/Category'
];

const VALID_SOURCES = ['JobStreet', 'LinkedIn', 'CareerFuture SG', 'Other'];

/**
 * Validates CSV data for job imports
 */
export class CSVValidator {
  /**
   * Validate CSV file content
   */
  validateCSV(fileContent: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    let data: CSVRow[] = [];

    try {
      // Parse CSV
      const parseResult = Papa.parse<CSVRow>(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
      });

      data = parseResult.data;

      if (data.length === 0) {
        errors.push({
          row: 0,
          field: 'file',
          message: 'CSV file is empty or has no data rows'
        });
        return { isValid: false, errors, warnings, data: [], totalRows: 0 };
      }

      // Validate headers
      const headers = Object.keys(data[0] || {});
      const missingHeaders = REQUIRED_FIELDS.filter(field => !headers.includes(field));

      if (missingHeaders.length > 0) {
        errors.push({
          row: 0,
          field: 'headers',
          message: `Missing required columns: ${missingHeaders.join(', ')}`
        });
      }

      // Validate each row
      data.forEach((row, index) => {
        const rowNumber = index + 2; // +2 because index starts at 0 and row 1 is headers

        // Check required fields
        REQUIRED_FIELDS.forEach(field => {
          const value = row[field as keyof CSVRow];
          if (!value || value.toString().trim() === '') {
            errors.push({
              row: rowNumber,
              field,
              message: `${field} is required`,
              value: value?.toString()
            });
          }
        });

        // Validate URL format for Apply Link
        if (row['Apply Link']) {
          if (!this.isValidUrl(row['Apply Link'])) {
            errors.push({
              row: rowNumber,
              field: 'Apply Link',
              message: 'Invalid URL format',
              value: row['Apply Link']
            });
          }
        }

        // Validate Source
        if (row['Source']) {
          const source = row['Source'].trim();
          if (!VALID_SOURCES.includes(source)) {
            errors.push({
              row: rowNumber,
              field: 'Source',
              message: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}`,
              value: source
            });
          }
        }

        // Warnings for optional fields
        if (!row['Salary Range'] || row['Salary Range'].trim() === '') {
          warnings.push({
            row: rowNumber,
            field: 'Salary Range',
            message: 'Salary Range is empty'
          });
        }

        // Validate field lengths
        if (row['Job Title'] && row['Job Title'].length > 200) {
          warnings.push({
            row: rowNumber,
            field: 'Job Title',
            message: 'Job Title is very long (>200 characters)',
            value: row['Job Title'].substring(0, 50) + '...'
          });
        }

        if (row['Job Description'] && row['Job Description'].length > 10000) {
          warnings.push({
            row: rowNumber,
            field: 'Job Description',
            message: 'Job Description is very long (>10000 characters)'
          });
        }
      });

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
      data,
      totalRows: data.length
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
   * Check for duplicate Apply Links in the CSV
   */
  detectDuplicatesInCSV(data: CSVRow[]): Map<string, number[]> {
    const urlMap = new Map<string, number[]>();

    data.forEach((row, index) => {
      const url = row['Apply Link']?.trim();
      if (url) {
        if (!urlMap.has(url)) {
          urlMap.set(url, []);
        }
        urlMap.get(url)!.push(index + 2); // +2 for row number
      }
    });

    // Filter to only duplicates
    const duplicates = new Map<string, number[]>();
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
  parseCSV(fileContent: string): CSVRow[] {
    const parseResult = Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    return parseResult.data;
  }
}

export const csvValidator = new CSVValidator();
