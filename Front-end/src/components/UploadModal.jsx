import React, { useRef, useState } from 'react';
import { uploadPdf } from '../utils/api';

export default function UploadModal({ onUploaded }) {
  const ref = useRef(null);
  const [status, setStatus] = useState('');

  const doUpload = async () => {
    const f = ref.current.files?.[0];
    if (!f) return alert('Please choose a PDF to upload');
    setStatus('Uploading...');
    try {
      const r = await uploadPdf(f);
      setStatus('Uploaded');
      // backend returns path like "/uploads/filename.pdf"
      onUploaded && onUploaded(r.path);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
      alert('Upload failed: ' + (err?.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <input ref={ref} type="file" accept="application/pdf" />
      <button onClick={doUpload} className="ml-3 px-3 py-1 bg-sky-700 text-white rounded">Upload</button>
      <div className="text-sm text-gray-500 mt-2">{status}</div>
    </div>
  );
}
