import React from 'react';
import { CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';

interface ScrapedData {
  jobTitle: string;
  companyName: string;
  location: string;
  salaryRange: string;
  jobDescription: string;
  applyLink: string;
  source: string;
  companyLogoUrl?: string;
  heroBannerUrl?: string;
  category?: string;
}

interface ScrapeResult {
  success: boolean;
  data?: ScrapedData;
  error?: string;
  url: string;
}

interface ScrapedDataPreviewProps {
  results: ScrapeResult[];
  title?: string;
}

export const ScrapedDataPreview: React.FC<ScrapedDataPreviewProps> = ({
  results,
  title = 'Scraped Data Preview'
}) => {
  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{successCount} success</span>
            </div>
            {failedCount > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="w-4 h-4" />
                <span>{failedCount} failed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {results.map((result, index) => (
          <div key={index} className={`p-4 ${result.success ? 'bg-white' : 'bg-red-50'}`}>
            {result.success && result.data ? (
              <div className="space-y-3">
                {/* Job Title & Company */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {result.data.jobTitle}
                    </h4>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      {result.data.companyLogoUrl && (
                        <img
                          src={result.data.companyLogoUrl}
                          alt={result.data.companyName}
                          className="w-5 h-5 object-contain"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      {result.data.companyName}
                    </p>
                  </div>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                  >
                    View Original
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{result.data.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Salary</p>
                    <p className="font-medium text-gray-900">{result.data.salaryRange}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Source</p>
                    <p className="font-medium text-gray-900">{result.data.source}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{result.data.category || 'Pending'}</p>
                  </div>
                </div>

                {/* Description Preview */}
                <div>
                  <p className="text-gray-500 text-sm mb-1">Description Preview</p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {result.data.jobDescription.substring(0, 200)}...
                  </p>
                </div>

                {/* Media */}
                {(result.data.companyLogoUrl || result.data.heroBannerUrl) && (
                  <div className="flex gap-2 text-xs text-gray-500">
                    {result.data.companyLogoUrl && <span>✓ Logo found</span>}
                    {result.data.heroBannerUrl && <span>✓ Banner found</span>}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-900">Failed to scrape</p>
                  <p className="text-sm text-red-700 mt-1">{result.error}</p>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mt-2"
                  >
                    Check URL
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {results.length} result{results.length !== 1 ? 's' : ''}
            {failedCount > 0 && (
              <span className="text-red-600 ml-2">
                • Please check failed URLs before proceeding
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
