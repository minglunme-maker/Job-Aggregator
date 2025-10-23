import type { NextApiRequest, NextApiResponse } from 'next';
import { importProcessor } from '@/lib/import-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { applyLinks } = req.body;

    if (!applyLinks || !Array.isArray(applyLinks)) {
      return res.status(400).json({ error: 'Invalid apply links' });
    }

    // Check each link against the database
    const duplicateChecks = await Promise.all(
      applyLinks.map(async (link: string) => {
        const isDuplicate = await importProcessor.checkDuplicate(link);
        return { link, isDuplicate };
      })
    );

    const duplicates = duplicateChecks.filter(check => check.isDuplicate);

    return res.status(200).json({
      total: applyLinks.length,
      duplicateCount: duplicates.length,
      duplicates: duplicates.map(d => d.link),
    });

  } catch (error: any) {
    console.error('Duplicate check error:', error);
    return res.status(500).json({ error: error.message });
  }
}
