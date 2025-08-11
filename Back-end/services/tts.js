import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function synthesizeAudio(text) {
  const provider = process.env.TTS_PROVIDER || 'azure';
  const outName = `podcast_${uuidv4()}.mp3`;
  const outPath = path.join(process.cwd(), 'Back-end', 'uploads', outName);

  if (provider === 'azure') {
    const key = process.env.AZURE_TTS_KEY;
    const endpoint = process.env.AZURE_TTS_ENDPOINT;
    if (!key || !endpoint) throw new Error('AZURE_TTS_KEY and AZURE_TTS_ENDPOINT required');

    const ssml = `<?xml version='1.0' encoding='utf-8'?><speak version='1.0' xml:lang='en-US'><voice name='en-US-JennyNeural'>${escapeXml(text)}</voice></speak>`;
    const url = `${endpoint}/cognitiveservices/v1`;
    const headers = {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
    };

    const resp = await axios.post(url, ssml, { headers, responseType: 'arraybuffer' });
    await fs.writeFile(outPath, Buffer.from(resp.data));
    return `/uploads/${outName}`;
  }

  // fallback: store text file
  await fs.writeFile(outPath + '.txt', text);
  return `/uploads/${outName}.txt`;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c];
  });
}
