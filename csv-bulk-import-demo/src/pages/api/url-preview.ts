import type { NextApiRequest, NextApiResponse } from 'next';
import { urlImportProcessor } from '@/lib/url-import-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== URL Preview API called ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls, limit = 3 } = req.body;

    console.log('URLs received:', urls);
    console.log('Limit:', limit);

    if (!urls || !Array.isArray(urls)) {
      console.error('Invalid URLs array');
      return res.status(400).json({ error: 'Invalid URLs array' });
    }

    if (urls.length === 0) {
      console.error('No URLs provided');
      return res.status(400).json({ error: 'No URLs provided' });
    }

    console.log('Starting preview scraping...');
    // Preview scraping (limited number of URLs)
    const previewResults = await urlImportProcessor.previewScraping(urls, limit);
    console.log('Preview results:', previewResults);

    return res.status(200).json({
      success: true,
      previewCount: previewResults.length,
      totalUrls: urls.length,
      results: previewResults,
    });

  } catch (error: any) {
    console.error('Preview error FULL:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return res.status(500).json({ error: error.message || 'Unknown error', stack: error.stack });
  }
}
