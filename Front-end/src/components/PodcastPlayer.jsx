import React from 'react';

export default function PodcastPlayer({ audioPath, onGenerate }) {
  const [text, setText] = React.useState('Give me a quick 2–3 minute narrated overview of this section and related highlights.');

  return (
    <div className="mt-4 p-3 bg-white border rounded">
      <h4 className="font-semibold">Podcast Mode</h4>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full p-2 border rounded my-2"></textarea>
      <div className="flex gap-2">
        <button onClick={() => onGenerate(text)} className="px-3 py-1 bg-indigo-600 text-white rounded">Generate Audio</button>
      </div>
      {audioPath && (
        <div className="mt-3">
          <audio controls src={audioPath} className="w-full" />
          <a className="text-sm text-blue-600" href={audioPath} target="_blank" rel="noreferrer">Open audio</a>
        </div>
      )}
    </div>
  );
}
