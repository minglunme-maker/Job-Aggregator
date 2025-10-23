import React, { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { ValidationResults } from '@/components/ValidationResults';
import { ScrapingProgress } from '@/components/ScrapingProgress';
import { ScrapedDataPreview } from '@/components/ScrapedDataPreview';
import { ImportSummary } from '@/components/ImportSummary';
import { Upload, Eye, Download, Play, Settings } from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface ScrapeResult {
  success: boolean;
  data?: any;
  error?: string;
  url: string;
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
    url: string;
  }>;
}

export default function URLImportPage() {
  const [urls, setUrls] = useState<string[]>([]);
  const [filename, setFilename] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(false);

  const [previewing, setPreviewing] = useState(false);
  const [previewResults, setPreviewResults] = useState<ScrapeResult[]>([]);

  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<any>(null);
  const [importSummary, setImportSummary] = useState<ImportSummaryData | null>(null);

  // Options
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [categorizeWithAI, setCategorizeWithAI] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const handleFileProcessed = async (data: any[], name: string) => {
    setFilename(name);
    setImportSummary(null);
    setPreviewResults([]);

    // Extract URLs from CSV data
    const extractedUrls = data
      .map(row => row['URL'] || row['url'] || row['Url'])
      .filter(url => url && url.trim() !== '');

    if (extractedUrls.length === 0) {
      setValidationErrors([{
        row: 0,
        field: 'file',
        message: 'No valid URLs found in CSV. Make sure your CSV has a column named "URL".'
      }]);
      setIsValid(false);
      return;
    }

    // Basic validation
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    extractedUrls.forEach((url, index) => {
      const rowNumber = index + 2;

      // Validate URL format
      try {
        new URL(url);
      } catch {
        errors.push({
          row: rowNumber,
          field: 'URL',
          message: 'Invalid URL format',
          value: url
        });
      }

      // Check if it's from a known job board
      const lowercaseUrl = url.toLowerCase();
      if (!lowercaseUrl.includes('linkedin.com') &&
          !lowercaseUrl.includes('jobstreet') &&
          !lowercaseUrl.includes('mycareersfuture.gov.sg')) {
        warnings.push({
          row: rowNumber,
          field: 'URL',
          message: 'URL is not from LinkedIn, JobStreet, or CareerFuture SG. Scraping may not work optimally.',
          value: url
        });
      }
    });

    setUrls(extractedUrls);
    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setIsValid(errors.length === 0);
  };

  const handlePreview = async () => {
    if (urls.length === 0) return;

    setPreviewing(true);
    setPreviewResults([]);

    try {
      const response = await fetch('/api/url-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, limit: 3 })
      });

      const result = await response.json();

      if (result.success) {
        setPreviewResults(result.results);
      } else {
        alert(`Preview failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Preview error: ${error.message}`);
    } finally {
      setPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (!isValid || urls.length === 0) return;

    setImporting(true);
    setImportProgress({ stage: 'scraping', current: 0, total: urls.length });

    try {
      const response = await fetch('/api/url-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls,
          filename,
          options: {
            skipDuplicates,
            categorizeWithAI
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Convert URL import results to match ImportSummary format
        const convertedSummary = {
          total: result.summary.total,
          successful: result.summary.successful,
          failed: result.summary.failed,
          duplicates: result.summary.duplicates,
          results: result.summary.results.map((r: any) => ({
            success: r.success,
            jobId: r.jobId,
            error: r.error,
            rowNumber: urls.indexOf(r.url) + 2 // Convert to row number
          }))
        };
        setImportSummary(convertedSummary);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Import error: ${error.message}`);
    } finally {
      setImporting(false);
      setImportProgress(null);
    }
  };

  const handleReset = () => {
    setUrls([]);
    setFilename('');
    setValidationErrors([]);
    setValidationWarnings([]);
    setIsValid(false);
    setPreviewResults([]);
    setImportSummary(null);
  };

  const downloadTemplate = () => {
    const template = `URL
https://www.linkedin.com/jobs/view/3829847261
https://www.jobstreet.com.sg/job/72819485
https://www.mycareersfuture.gov.sg/job/details/example-job-id`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-urls-template.csv';
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
              <h1 className="text-3xl font-bold text-gray-900">URL-Based Job Import</h1>
              <p className="text-gray-600 mt-1">
                Upload a CSV with job URLs - we'll scrape and extract all the data automatically!
              </p>
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
                Step 1: Upload CSV with Job URLs
              </h2>
              <CSVUploader onFileProcessed={handleFileProcessed} />

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">✨ How it works:</p>
                <ol className="mt-2 text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Your CSV should have just 1 column: <code className="bg-blue-100 px-1 rounded">URL</code></li>
                  <li>We automatically scrape each job posting</li>
                  <li>Extract: Title, Company, Location, Salary, Description, Logo, Banner</li>
                  <li>AI categorizes the jobs</li>
                  <li>Imports everything to your database</li>
                </ol>
              </div>
            </div>
          )}

          {/* Options */}
          {urls.length > 0 && !importSummary && (
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
                      checked={categorizeWithAI}
                      onChange={(e) => setCategorizeWithAI(e.target.checked)}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-700">
                      AI categorization (requires OpenAI API key, slower but better)
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Validation Results */}
          {urls.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 2: Validation Results
              </h2>
              <ValidationResults
                isValid={isValid}
                errors={validationErrors}
                warnings={validationWarnings}
                totalRows={urls.length}
              />
            </div>
          )}

          {/* Preview Section */}
          {urls.length > 0 && !importSummary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Step 3: Preview Scraping (Optional)
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Test scraping on first 3 URLs to verify it works before full import
                  </p>
                </div>
                <button
                  onClick={handlePreview}
                  disabled={!isValid || previewing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {previewing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Previewing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview First 3
                    </>
                  )}
                </button>
              </div>

              {previewResults.length > 0 && (
                <ScrapedDataPreview results={previewResults} title="Preview Results (First 3 URLs)" />
              )}
            </div>
          )}

          {/* Import Progress */}
          {importing && importProgress && (
            <ScrapingProgress
              stage={importProgress.stage}
              current={importProgress.current}
              total={importProgress.total}
              currentUrl={importProgress.url}
            />
          )}

          {/* Import Button */}
          {urls.length > 0 && !importSummary && !importing && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Step 4: Start Import
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Ready to import {urls.length} jobs (~{Math.ceil(urls.length * 2 / 60)} minutes)
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!isValid}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Start Import
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
