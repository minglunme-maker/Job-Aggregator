import React from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, Globe, Zap, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Job Import Automation
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Upload job URLs - we extract EVERYTHING automatically!
          </p>
          <p className="text-md text-gray-500 mb-8">
            AI categorization • Web scraping • Bulk import
          </p>

          {/* URL-Based Import (RECOMMENDED) */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-4 border-green-400">
            <div className="bg-green-50 px-4 py-2 rounded-lg mb-6 inline-block">
              <p className="text-green-800 font-semibold">✨ RECOMMENDED - Fully Automated!</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">URL-Based Import</h2>
            <p className="text-gray-600 mb-6">Just paste job URLs - we do the rest!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Upload URLs</h3>
                <p className="text-sm text-gray-600">
                  CSV with just 1 column: job URLs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Auto-Scrape</h3>
                <p className="text-sm text-gray-600">
                  Extract ALL job data automatically
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Import</h3>
                <p className="text-sm text-gray-600">
                  AI categorizes & saves to database
                </p>
              </div>
            </div>

            <Link
              href="/admin/url-import"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium shadow-lg"
            >
              <Zap className="w-6 h-6" />
              Start URL Import (Recommended)
            </Link>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900"><strong>Time savings:</strong></p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>❌ Old way: 2-3 hours for 50 jobs (manual entry)</li>
                <li>✅ New way: 8 minutes for 50 jobs (just URLs!)</li>
              </ul>
            </div>
          </div>

          {/* Manual Data Import */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 opacity-75">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manual Data Import</h2>
            <p className="text-gray-600 mb-6">For CSV files with pre-filled job data</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload CSV</h3>
                <p className="text-sm text-gray-600">
                  With all job fields filled in
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Validate</h3>
                <p className="text-sm text-gray-600">
                  Check for errors
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Import</h3>
                <p className="text-sm text-gray-600">
                  Save to database
                </p>
              </div>
            </div>

            <Link
              href="/admin/import"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
            >
              <Upload className="w-6 h-6" />
              Manual Import Tool
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Gets Extracted Automatically</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Job Title</strong> - Auto-extracted from page</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Company Name</strong> - Auto-extracted from page</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Location</strong> - Auto-extracted from page</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Salary Range</strong> - Auto-extracted if available</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Job Description</strong> - Full text extracted</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Company Logo</strong> - Auto-extracted image URL</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Hero Banner</strong> - Auto-extracted if available</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span><strong>AI Category</strong> - Intelligent categorization</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Supported Job Boards</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">LinkedIn</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">JobStreet</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">CareerFuture SG</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Other job sites</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
