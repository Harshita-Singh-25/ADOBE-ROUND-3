import React, { useEffect, useState } from 'react';
import PdfViewer from '../components/PdfViewer';
import RelatedSections from '../components/RelatedSections';
import InsightsPanel from '../components/InsightsPanel';
import PodcastPlayer from '../components/PodcastPlayer';
import { getRelated, getInsights, makePodcast } from '../utils/api';

export default function DocumentView() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [sections, setSections] = useState([]);
  const [insights, setInsights] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const url = sessionStorage.getItem('currentPdf');
    if (url) setPdfUrl(url);
  }, []);

  useEffect(() => {
    if (!pdfUrl) return;
    // backend expects filePath like '/uploads/file.pdf'
    const serverPath = pdfUrl.replace(window.location.origin, '');
    setLoadingRelated(true);
    getRelated(serverPath, 1)
      .then(r => setSections(r.results || []))
      .catch(err => { console.error(err); })
      .finally(() => setLoadingRelated(false));
  }, [pdfUrl]);

  const jumpTo = (page) => {
    window.postMessage({ type: 'adobe-goto-page', page }, '*');
  };

  const onAskInsights = async (sectionId) => {
    if (!pdfUrl) return;
    const serverPath = pdfUrl.replace(window.location.origin, '');
    const r = await getInsights(serverPath, sectionId).catch(e => { console.error(e); return null; });
    if (r) setInsights(r.insights || r);
  };

  const onMakePodcast = async (text) => {
    const r = await makePodcast(text).catch(e => { console.error(e); return null; });
    if (r && r.audioPath) setAudioUrl(window.location.origin + r.audioPath);
  };

  if (!pdfUrl) {
    return <div className="p-6">No PDF selected. Please upload a PDF first.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-3/5 bg-white">
        <PdfViewer url={pdfUrl} />
      </div>

      <div className="w-2/5 p-4 overflow-auto">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Document</h3>
          <div className="text-sm text-gray-500">PDF: {pdfUrl.split('/').pop()}</div>
        </div>

        <div className="mb-4">
          {loadingRelated ? <div className="text-sm text-gray-500">Loading related sections...</div> :
            <RelatedSections sections={sections} onJump={jumpTo} onAskInsights={onAskInsights} />}
        </div>

        <InsightsPanel insights={insights} />

        <PodcastPlayer audioPath={audioUrl} onGenerate={onMakePodcast} />
      </div>
    </div>
  );
}
