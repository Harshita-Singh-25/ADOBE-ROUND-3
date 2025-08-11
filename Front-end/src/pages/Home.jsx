import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-3">Connecting the Dots — Finale</h1>
      <p className="mb-4 text-gray-600">Upload PDFs, explore related content, view insights and generate short podcast summaries.</p>
      <div className="flex gap-3">
        <Link to="/upload" className="px-4 py-2 bg-sky-700 text-white rounded">Upload PDFs</Link>
        <Link to="/doc" className="px-4 py-2 border rounded">Open Reader</Link>
      </div>
    </div>
  );
}
