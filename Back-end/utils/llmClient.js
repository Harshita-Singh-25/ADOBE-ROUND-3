import axios from 'axios';

export async function callLLM({ model, input, max_tokens = 512 }) {
  const provider = process.env.LLM_PROVIDER || 'openai';

  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY required for openai provider');
    const base = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const payload = { model: model || 'gpt-4o', messages: [{ role: 'user', content: input }], max_tokens };
    const resp = await axios.post(`${base}/chat/completions`, payload, { headers: { Authorization: `Bearer ${key}` } });
    return resp.data;
  }

  if (provider === 'gemini') {
    // Judges will provide Gemini access during evaluation.
    // Implement a Gemini client here if you want to test locally.
    throw new Error('Gemini provider not implemented in this template. Add provider-specific client.');
  }

  throw new Error('Unsupported LLM_PROVIDER: ' + provider);
}
