import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

interface ImportResult {
  success: boolean;
  jobId?: string;
  error?: string;
  rowNumber: number;
}

interface ImportSummaryProps {
  summary: {
    total: number;
    successful: number;
    failed: number;
    duplicates: number;
    results: ImportResult[];
  };
  onDownloadErrors?: () => void;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({ summary, onDownloadErrors }) => {
  const successRate = summary.total > 0
    ? Math.round((summary.successful / summary.total) * 100)
    : 0;

  const failedResults = summary.results.filter(r => !r.success);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">{summary.successful}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duplicates</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.duplicates}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Import Success Rate</p>
          <p className="text-sm font-bold text-gray-900">{successRate}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Failed Imports */}
      {failedResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Failed Imports ({failedResults.length})
            </h3>
            {onDownloadErrors && (
              <button
                onClick={onDownloadErrors}
                className="flex items-center gap-2 text-sm text-primary hover:text-blue-700"
              >
                <Download className="w-4 h-4" />
                Download Error Report
              </button>
            )}
          </div>

          <div className="p-4 max-h-64 overflow-y-auto space-y-2">
            {failedResults.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-100 rounded text-sm"
              >
                <p className="font-medium text-red-900">Row {result.rowNumber}</p>
                <p className="text-red-700 mt-1">{result.error}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {summary.successful === summary.total && summary.total > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-800">Import Completed Successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                All {summary.total} jobs have been imported successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
