import React from 'react';
import UploadModal from '../components/UploadModal';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload PDFs (bulk)</h2>
      <UploadModal onUploaded={(serverPath) => {
        // Save current PDF to session and open reader
        const url = window.location.origin + serverPath;
        sessionStorage.setItem('currentPdf', url);
        navigate('/doc');
      }} />
      <p className="mt-4 text-sm text-gray-500">After upload, you will be taken to the reader. The system will begin indexing in the background.</p>
    </div>
  );
}
