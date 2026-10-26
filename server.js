import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '20mb' }));

// CORS for local network development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const dataDir = path.join(__dirname, 'data');
const clOrdersFile = path.join(dataDir, 'contact-lens-orders.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Contact Lens Orders multi-computer sync endpoints
app.get(['/api/contact-lens-orders', '/api/contact-lens-sync'], (req, res) => {
  try {
    if (fs.existsSync(clOrdersFile)) {
      const content = fs.readFileSync(clOrdersFile, 'utf-8');
      return res.json({ success: true, data: JSON.parse(content) });
    }
    return res.json({ success: true, data: null });
  } catch (err) {
    console.error('Error reading CL orders file:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post(['/api/contact-lens-orders', '/api/contact-lens-sync'], (req, res) => {
  try {
    const payload = req.body;
    const updatedAt = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    if (payload && typeof payload === 'object') {
      if (!payload.meta) payload.meta = {};
      payload.meta.lastSyncedAt = updatedAt;
    }
    fs.writeFileSync(clOrdersFile, JSON.stringify(payload, null, 2), 'utf-8');
    return res.json({ success: true, updatedAt, cloudPersisted: true });
  } catch (err) {
    console.error('Error saving CL orders file:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Serve public and static build
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` C.L.O.S. (Contact Lens Ordering System) Server Active!`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://0.0.0.0:${PORT}`);
  console.log(`=======================================================`);
});
