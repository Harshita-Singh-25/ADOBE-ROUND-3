import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import { findRelatedSections } from './recommendations.js';
import { generateInsights } from './insights.js';
import { synthesizeAudio } from './tts.js';

const UPLOADS_DIR = path.join(process.cwd(), 'Back-end', 'uploads');
const PY_SERVICE = process.env.PYTHON_INDEX_URL || 'http://127.0.0.1:9000';

export const uploadPdf = async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).json({ error: 'No file attached' });
    const file = req.files.file;
    const dest = path.join(UPLOADS_DIR, file.name);
    await file.mv(dest);

    // Fire-and-forget request to python microservice to index the file
    axios.post(`${PY_SERVICE}/index`, { path: dest }).catch((e) => {
      console.warn('Index request failed (non-fatal):', e.message);
    });

    return res.json({ status: 'uploaded', path: `/uploads/${file.name}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getRelated = async (req, res) => {
  try {
    const { filePath, pageNum } = req.query;
    if (!filePath) return res.status(400).json({ error: 'filePath required' });

    // normalize server-side absolute path if user passed /uploads/...
    let absPath = filePath;
    if (filePath.startsWith('/uploads')) absPath = path.join(process.cwd(), 'Back-end', filePath);
    const results = await findRelatedSections(absPath, Number(pageNum || 1));
    return res.json({ results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getInsights = async (req, res) => {
  try {
    const { filePath, sectionId } = req.query;
    if (!filePath || !sectionId) return res.status(400).json({ error: 'filePath and sectionId required' });
    const absPath = filePath.startsWith('/uploads') ? path.join(process.cwd(), 'Back-end', filePath) : filePath;
    const insights = await generateInsights(absPath, sectionId);
    return res.json({ insights });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getPodcast = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const audioPath = await synthesizeAudio(text);
    return res.json({ audioPath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
