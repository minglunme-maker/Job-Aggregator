import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

interface ValidationResultsProps {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  totalRows: number;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  isValid,
  errors,
  warnings,
  totalRows
}) => {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium text-green-800">Validation Passed!</p>
            <p className="text-sm text-green-700 mt-1">
              All {totalRows} rows are valid and ready to import.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">
                {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
              </p>
              <p className="text-sm text-red-700 mt-1">
                Please fix these errors before importing.
              </p>

              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm bg-white p-3 rounded border border-red-100">
                    <p className="font-medium text-red-900">
                      Row {error.row} - {error.field}
                    </p>
                    <p className="text-red-700 mt-1">{error.message}</p>
                    {error.value && (
                      <p className="text-gray-600 mt-1 text-xs truncate">
                        Value: {error.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">
                {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                These won't prevent import but should be reviewed.
              </p>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-yellow-800 hover:text-yellow-900">
                  View warnings
                </summary>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {warnings.map((warning, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border border-yellow-100">
                      <p className="text-yellow-900">
                        Row {warning.row} - {warning.field}: {warning.message}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
