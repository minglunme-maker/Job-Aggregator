import React from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            CSV Bulk Import Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Import jobs in bulk with AI categorization and web scraping
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload CSV</h3>
                <p className="text-sm text-gray-600">
                  Drag and drop your job listings CSV file
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Validate & Preview</h3>
                <p className="text-sm text-gray-600">
                  Check for errors and preview your data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Import & Enrich</h3>
                <p className="text-sm text-gray-600">
                  AI categorizes and scraper extracts additional data
                </p>
              </div>
            </div>

            <Link
              href="/admin/import"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              <Upload className="w-6 h-6" />
              Go to Import Tool
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>AI-Powered Categorization</strong> - Automatically categorizes jobs into predefined industries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Web Scraping</strong> - Extracts company logos and hero banners from job URLs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Duplicate Detection</strong> - Prevents importing the same job twice</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Data Validation</strong> - Checks for required fields and proper URL formats</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Preview Mode</strong> - Review data before importing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Import Summary</strong> - Detailed report of successful and failed imports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
