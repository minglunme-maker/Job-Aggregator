import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { csvValidator } from '@/lib/csv-validator';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return (
          mimetype === 'text/csv' ||
          mimetype === 'application/vnd.ms-excel' ||
          mimetype === 'text/plain'
        );
      },
    });

    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read file content
    const fileContent = fs.readFileSync(file.filepath, 'utf-8');

    // Validate CSV
    const validationResult = csvValidator.validateCSV(fileContent);

    // Check for duplicates within the CSV
    const duplicatesInCSV = csvValidator.detectDuplicatesInCSV(validationResult.data);

    return res.status(200).json({
      validation: {
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        totalRows: validationResult.totalRows,
      },
      duplicatesInCSV: Array.from(duplicatesInCSV.entries()).map(([url, rows]) => ({
        url,
        rows,
      })),
      preview: validationResult.data.slice(0, 5), // First 5 rows for preview
      filename: file.originalFilename,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}
