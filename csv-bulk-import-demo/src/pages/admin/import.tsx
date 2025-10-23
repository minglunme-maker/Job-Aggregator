import React, { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { ValidationResults } from '@/components/ValidationResults';
import { DataPreview } from '@/components/DataPreview';
import { ImportSummary } from '@/components/ImportSummary';
import { Upload, RefreshCw, Settings, Download } from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface ImportSummaryData {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  results: Array<{
    success: boolean;
    jobId?: string;
    error?: string;
    rowNumber: number;
  }>;
}

export default function AdminImportPage() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummaryData | null>(null);
  const [duplicatesInDB, setDuplicatesInDB] = useState<string[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  // Import options
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [enrichData, setEnrichData] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const handleFileProcessed = async (data: any[], name: string) => {
    setCsvData(data);
    setFilename(name);
    setImportSummary(null);

    // Basic validation
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    const requiredFields = ['Job Title', 'Company Name', 'Location', 'Job Description', 'Apply Link', 'Source'];

    // Check headers
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const missingHeaders = requiredFields.filter(field => !headers.includes(field));

      if (missingHeaders.length > 0) {
        errors.push({
          row: 0,
          field: 'headers',
          message: `Missing required columns: ${missingHeaders.join(', ')}`
        });
      }
    }

    // Validate each row
    data.forEach((row, index) => {
      const rowNumber = index + 2;

      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push({
            row: rowNumber,
            field,
            message: `${field} is required`,
            value: row[field]
          });
        }
      });

      // Validate URL
      if (row['Apply Link']) {
        try {
          new URL(row['Apply Link']);
        } catch {
          errors.push({
            row: rowNumber,
            field: 'Apply Link',
            message: 'Invalid URL format',
            value: row['Apply Link']
          });
        }
      }

      // Check optional fields
      if (!row['Salary Range'] || row['Salary Range'].trim() === '') {
        warnings.push({
          row: rowNumber,
          field: 'Salary Range',
          message: 'Salary Range is empty'
        });
      }
    });

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setIsValid(errors.length === 0);

    // Check for duplicates in database
    if (errors.length === 0) {
      await checkDuplicatesInDatabase(data);
    }
  };

  const checkDuplicatesInDatabase = async (data: any[]) => {
    setCheckingDuplicates(true);
    try {
      const applyLinks = data.map(row => row['Apply Link']).filter(Boolean);

      const response = await fetch('/api/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applyLinks })
      });

      const result = await response.json();
      setDuplicatesInDB(result.duplicates || []);
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleImport = async () => {
    if (!isValid || csvData.length === 0) {
      return;
    }

    setImporting(true);

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData,
          filename,
          options: {
            skipDuplicates,
            enrichData,
            batchSize: 10
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setImportSummary(result.summary);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Import error: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setCsvData([]);
    setFilename('');
    setValidationErrors([]);
    setValidationWarnings([]);
    setIsValid(false);
    setImportSummary(null);
    setDuplicatesInDB([]);
  };

  const downloadTemplate = () => {
    const template = `Job Title,Company Name,Location,Salary Range,Job Description,Apply Link,Source,Industry/Category
Software Engineer,Tech Corp,Singapore,$5000-$8000,Exciting opportunity for software engineers,https://example.com/job1,LinkedIn,Software Development
Marketing Manager,Marketing Inc,Singapore,$6000-$10000,Lead our marketing team,https://example.com/job2,JobStreet,Marketing & Sales
Data Analyst,Data Co,Singapore,$4500-$7000,Analyze business data,https://example.com/job3,CareerFuture SG,Data Science & Analytics`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-import-template.csv';
    a.click();
  };

  const downloadErrorReport = () => {
    if (!importSummary) return;

    const failedResults = importSummary.results.filter(r => !r.success);
    const report = failedResults.map(r => `Row ${r.rowNumber}: ${r.error}`).join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-errors.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSV Bulk Import</h1>
              <p className="text-gray-600 mt-1">Import multiple jobs at once from CSV files</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Section */}
          {!importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 1: Upload CSV File
              </h2>
              <CSVUploader onFileProcessed={handleFileProcessed} />
            </div>
          )}

          {/* Import Options */}
          {csvData.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Import Options</span>
              </button>

              {showOptions && (
                <div className="space-y-3 pl-7">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Skip duplicate jobs (already in database)
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={enrichData}
                      onChange={(e) => setEnrichData(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Enrich data with AI categorization and web scraping (slower but better)
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Validation Results */}
          {csvData.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 2: Validation Results
              </h2>
              <ValidationResults
                isValid={isValid}
                errors={validationErrors}
                warnings={validationWarnings}
                totalRows={csvData.length}
              />

              {/* Database Duplicates */}
              {duplicatesInDB.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800">
                    Found {duplicatesInDB.length} job(s) already in database
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {skipDuplicates
                      ? 'These will be skipped during import.'
                      : 'These may cause errors if not skipped.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Data Preview */}
          {csvData.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 3: Preview Data
              </h2>
              <DataPreview data={csvData} maxRows={5} />
            </div>
          )}

          {/* Import Button */}
          {csvData.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Step 4: Start Import
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Ready to import {csvData.length} jobs
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    disabled={importing}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!isValid || importing || checkingDuplicates}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Start Import
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Import Summary */}
          {importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Import Complete
              </h2>
              <ImportSummary
                summary={importSummary}
                onDownloadErrors={downloadErrorReport}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Import Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
