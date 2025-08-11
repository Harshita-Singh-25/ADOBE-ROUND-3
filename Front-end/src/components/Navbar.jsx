import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-sky-700 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="font-bold text-lg">Connecting the Dots</div>
        <div className="text-sm opacity-90">PDF Reader · Insights · Podcast</div>
      </div>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/upload" className="hover:underline">Upload</Link>
        <Link to="/doc" className="hover:underline">Reader</Link>
      </div>
    </nav>
  );
}
