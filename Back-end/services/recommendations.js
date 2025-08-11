import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const PY_SERVICE = process.env.PYTHON_INDEX_URL || 'http://127.0.0.1:9000';

async function loadIndexSidecar(pdfPath) {
  const sidecar = pdfPath + '.index.json';
  try {
    const raw = await fs.readFile(sidecar, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export async function findRelatedSections(filePath, pageNum = 1) {
  // 1) try sidecar index
  const idx = await loadIndexSidecar(filePath);
  if (idx && Array.isArray(idx.headings) && idx.headings.length) {
    // naive: choose 3 nearest headings by page
    const nearby = idx.headings
      .map(h => ({ ...h, dist: Math.abs((h.page || 1) - pageNum) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
    return nearby.map(h => ({
      id: h.id || h.title,
      title: h.title,
      page: h.page || 1,
      snippet: (h.text || h.content || '').slice(0, 260)
    }));
  }

  // 2) fallback: call python microservice /related
  try {
    const resp = await axios.get(`${PY_SERVICE}/related`, { params: { filePath, pageNum } });
    if (resp.data && resp.data.results) return resp.data.results;
  } catch (e) {
    console.warn('Python /related failed:', e.message);
  }

  // 3) ultimate fallback
  return [
    { id: 'fallback-1', title: 'No index available', page: 1, snippet: 'Index missing. Upload or run indexing to enable related sections.' }
  ];
}
