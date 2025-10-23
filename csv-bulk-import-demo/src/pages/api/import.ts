import type { NextApiRequest, NextApiResponse } from 'next';
import { csvValidator } from '@/lib/csv-validator';
import { importProcessor } from '@/lib/import-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { csvData, filename, options } = req.body;

    if (!csvData || !Array.isArray(csvData)) {
      return res.status(400).json({ error: 'Invalid CSV data' });
    }

    // Validate the data again
    const csvString = convertArrayToCSV(csvData);
    const validationResult = csvValidator.validateCSV(csvString);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'CSV validation failed',
        errors: validationResult.errors,
      });
    }

    // Process the import
    const summary = await importProcessor.bulkImport(validationResult.data, {
      skipDuplicates: options?.skipDuplicates ?? true,
      enrichData: options?.enrichData ?? true,
      batchSize: options?.batchSize ?? 10,
    });

    // Log the import
    const logId = await importProcessor.logImport(
      filename || 'unknown.csv',
      summary,
      summary.results.filter(r => !r.success)
    );

    return res.status(200).json({
      success: true,
      summary,
      logId,
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function convertArrayToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      return `"${value.toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}
