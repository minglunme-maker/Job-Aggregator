import React from 'react';
import { Eye } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  maxRows?: number;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data, maxRows = 5 }) => {
  if (data.length === 0) {
    return null;
  }

  const previewData = data.slice(0, maxRows);
  const headers = Object.keys(data[0]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">
            Data Preview ({previewData.length} of {data.length} rows)
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                  {rowIndex + 1}
                </td>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                    title={row[header]}
                  >
                    {row[header] || <span className="text-gray-400 italic">empty</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > maxRows && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ... and {data.length - maxRows} more rows
          </p>
        </div>
      )}
    </div>
  );
};
