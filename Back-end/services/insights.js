import { callLLM } from '../utils/llmClient.js';
import fs from 'fs/promises';

export async function generateInsights(filePath, sectionId) {
  const sidecar = filePath + '.index.json';
  let sectionText = null;
  try {
    const raw = await fs.readFile(sidecar, 'utf-8');
    const idx = JSON.parse(raw);
    const s = (idx.headings || []).find(h => (h.id === sectionId || h.title === sectionId));
    if (s) sectionText = s.text || s.content || JSON.stringify(s);
  } catch (e) {
    // ignore
  }

  if (!sectionText) sectionText = `Please summarize content for section ${sectionId} in file ${filePath}.`;

  const prompt = `You are an assistant that creates insights. SECTION:\n${sectionText}\n\nReturn:\n1) 3 bullet key insights\n2) A short "Did you know?" fact (1 sentence)\n3) A contradiction/counterpoint (1 sentence)\n4) Two inspirations/connections across docs.`;

  const resp = await callLLM({ model: process.env.OPENAI_MODEL || process.env.GEMINI_MODEL || 'gpt-4o', input: prompt, max_tokens: 400 });

  if (resp?.choices && resp.choices[0]?.message?.content) {
    return { raw: resp, text: resp.choices[0].message.content };
  }
  return { raw: resp, text: JSON.stringify(resp) };
}
