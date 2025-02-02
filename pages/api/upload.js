export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch("https://api.vercel.com/v2/blobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "blob.txt",
        data: "Hello World!",
        access: "public",
      }),
    });

    if (!response.ok) {
      throw new Error(`Vercel Blob API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ url: data.url });

  } catch (error) {
    console.error("Blob upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
