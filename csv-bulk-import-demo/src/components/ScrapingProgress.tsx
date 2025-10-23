import React from 'react';
import { Loader2, Globe, Database, Sparkles } from 'lucide-react';

interface ScrapingProgressProps {
  stage: 'scraping' | 'categorizing' | 'importing';
  current: number;
  total: number;
  currentUrl?: string;
}

export const ScrapingProgress: React.FC<ScrapingProgressProps> = ({
  stage,
  current,
  total,
  currentUrl
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const stageInfo = {
    scraping: {
      icon: Globe,
      title: 'Scraping Job Postings',
      description: 'Extracting job data from URLs...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    categorizing: {
      icon: Sparkles,
      title: 'AI Categorization',
      description: 'Categorizing jobs with AI...',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    importing: {
      icon: Database,
      title: 'Importing to Database',
      description: 'Saving jobs to database...',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  };

  const info = stageInfo[stage];
  const Icon = info.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 ${info.bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${info.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{info.title}</h3>
          <p className="text-sm text-gray-600">{info.description}</p>
        </div>
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <span>Progress</span>
          <span className="font-medium">
            {current} / {total} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              stage === 'scraping' ? 'bg-blue-500' :
              stage === 'categorizing' ? 'bg-purple-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Current URL being processed */}
      {currentUrl && (
        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Currently processing:</p>
          <p className="text-sm text-gray-700 truncate" title={currentUrl}>
            {currentUrl}
          </p>
        </div>
      )}

      {/* Estimated time */}
      {stage === 'scraping' && total > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          <p>⏱️ Estimated time: ~{Math.ceil((total - current) * 2 / 60)} minutes remaining</p>
          <p className="text-xs mt-1">Processing 1 URL every ~2 seconds to avoid rate limiting</p>
        </div>
      )}
    </div>
  );
};
