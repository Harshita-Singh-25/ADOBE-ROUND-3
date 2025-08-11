import React, { useEffect } from 'react';

export default function PdfViewer({ url }) {
  useEffect(() => {
    let loaded = false;
    function loadViewer() {
      if (!window.AdobeDC) {
        if (!loaded) setTimeout(loadViewer, 200);
        return;
      }
      if (loaded) return;
      loaded = true;
      try {
        const clientId = import.meta.env.VITE_ADOBE_CLIENT_ID || 'YOUR_ADOBE_CLIENT_ID';
        const adobeDCView = new window.AdobeDC.View({ clientId, divId: 'adobe-dc-view' });
        adobeDCView.previewFile({
          content: { location: { url } },
          metaData: { fileName: url.split('/').pop() }
        }, { embedMode: 'SIZED_CONTAINER' });

        // Listen for messages to jump pages
        window.addEventListener('message', (e) => {
          if (e?.data?.type === 'adobe-goto-page') {
            const page = e.data.page;
            adobeDCView.getAPIs().then(api => api.gotoPage(page));
          }
        });

      } catch (e) {
        console.error('Adobe viewer error', e);
      }
    }
    loadViewer();
  }, [url]);

  return <div id="adobe-dc-view" style={{ height: '100%', width: '100%' }} />;
}
