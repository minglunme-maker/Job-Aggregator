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
    const { urls, limit = 3 } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URLs array' });
    }

    if (urls.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    // Preview scraping (limited number of URLs)
    const previewResults = await urlImportProcessor.previewScraping(urls, limit);

    return res.status(200).json({
      success: true,
      previewCount: previewResults.length,
      totalUrls: urls.length,
      results: previewResults,
    });

  } catch (error: any) {
    console.error('Preview error:', error);
    return res.status(500).json({ error: error.message });
  }
}
