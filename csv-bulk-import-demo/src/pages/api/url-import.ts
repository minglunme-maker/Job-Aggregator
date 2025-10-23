import type { NextApiRequest, NextApiResponse } from 'next';
import { urlImportProcessor } from '@/lib/url-import-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls, filename, options } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URLs array' });
    }

    if (urls.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    // Import jobs from URLs
    const summary = await urlImportProcessor.importFromURLs(urls, {
      skipDuplicates: options?.skipDuplicates ?? true,
      categorizeWithAI: options?.categorizeWithAI ?? true,
    });

    // Log the import
    const logId = await urlImportProcessor.logImport(
      filename || 'urls.csv',
      summary,
      summary.results.filter(r => !r.success).map(r => ({
        url: r.url,
        error: r.error
      }))
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
