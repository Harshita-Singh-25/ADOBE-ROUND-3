import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pdfRoutes from './routes/pdfRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

// Ensure uploads dir
const UPLOADS = path.join(process.cwd(), 'Back-end', 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS));

// Serve frontend static files if build exists (we'll copy build to Back-end/public in Docker)
const FRONTEND_BUILD = path.join(process.cwd(), 'Back-end', 'public');
if (fs.existsSync(FRONTEND_BUILD)) {
  app.use(express.static(FRONTEND_BUILD));
  app.get('/', (req, res) => res.sendFile(path.join(FRONTEND_BUILD, 'index.html')));
}

app.use('/api/pdf', pdfRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
