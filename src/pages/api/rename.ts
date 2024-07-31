import { NextApiRequest, NextApiResponse } from 'next';
import { renameBlob } from '@vercel/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url, newName } = req.body;
    const renamedBlob = await renameBlob(url, newName);
    res.status(200).json({ url: renamedBlob.url });
  } catch (error) {
    res.status(500).json({ message: 'Rename failed', error: error.message });
  }
}