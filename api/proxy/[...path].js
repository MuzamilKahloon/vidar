import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';
  const BACKEND_URL = 'http://31.220.76.227:8001';
  const targetUrl = `${BACKEND_URL}/${apiPath}`;

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    try {
      const formData = new FormData();
      
      // Add files to FormData
      if (files.files) {
        const fileArray = Array.isArray(files.files) ? files.files : [files.files];
        fileArray.forEach(file => {
          formData.append('files', fs.createReadStream(file.filepath), file.originalFilename);
        });
      }

      // Make request to backend
      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      const data = await response.json();
      res.status(response.status).json(data);

    } catch (error) {
      console.error('Upload proxy error:', error);
      res.status(500).json({ 
        error: 'Failed to upload to backend',
        message: error.message 
      });
    }
  });
}