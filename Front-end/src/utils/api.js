import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function uploadPdf(file) {
  const form = new FormData();
  form.append('file', file);
  const resp = await axios.post(`${API_BASE}/api/pdf/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data;
}

export async function getRelated(filePath, pageNum = 1) {
  const resp = await axios.get(`${API_BASE}/api/pdf/related`, {
    params: { filePath, pageNum },
  });
  return resp.data;
}

export async function getInsights(filePath, sectionId) {
  const resp = await axios.get(`${API_BASE}/api/pdf/insights`, {
    params: { filePath, sectionId },
  });
  return resp.data;
}

export async function makePodcast(text) {
  const resp = await axios.post(`${API_BASE}/api/pdf/podcast`, { text });
  return resp.data;
}
