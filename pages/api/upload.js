import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}
