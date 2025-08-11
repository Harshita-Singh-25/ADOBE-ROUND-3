import React from 'react';

export default function InsightsPanel({ insights }) {
  if (!insights) return <div className="text-sm text-gray-500">Select a section and click Insights to load analysis.</div>;
  // insights expected to be { text: '...' } or raw string
  const text = insights?.text || (typeof insights === 'string' ? insights : JSON.stringify(insights, null, 2));
  return (
    <div className="mt-4 p-3 bg-white border rounded">
      <h4 className="font-semibold mb-2">Insights Bulb</h4>
      <pre className="text-sm whitespace-pre-wrap">{text}</pre>
    </div>
  );
}
