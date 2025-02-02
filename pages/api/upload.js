import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query } = req;
    const filename = query.filename;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Upload the file using `put` from `@vercel/blob`
    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('❌ Blob upload failed:', error);
    return res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}
