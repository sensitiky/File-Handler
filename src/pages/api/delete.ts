import { NextApiRequest, NextApiResponse } from 'next';
import { del } from '@vercel/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    await del(url);
    res.status(200).json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error as any });
  }
}