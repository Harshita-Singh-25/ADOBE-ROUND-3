import React from 'react';

export default function RelatedSections({ sections = [], onJump, onAskInsights }) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold">Related Sections</h4>
      {sections.length === 0 && <div className="text-sm text-gray-500">No suggestions yet.</div>}
      {sections.map((s, i) => (
        <div key={s.id || i} className="p-2 bg-white border rounded">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-500">Page {s.page}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => onJump(s.page)} className="px-2 py-1 text-sm bg-blue-600 text-white rounded">Jump</button>
              <button onClick={() => onAskInsights(s.id)} className="px-2 py-1 text-sm bg-green-600 text-white rounded">Insights</button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-700">{s.snippet}</p>
        </div>
      ))}
    </div>
  );
}
