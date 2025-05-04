import React from 'react';
import { useLocation } from 'react-router-dom';

const PdfViewer = () => {
  const location = useLocation();
  const pdfUrl = location.state?.pdfUrl;

  const backendUrl = process.env.REACT_APP_API_BASE_URL;
  const fullUrl = `${backendUrl}${pdfUrl}`;

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      {pdfUrl ? (
        <iframe
          src={fullUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="PDF Viewer"
        />
      ) : (
        <p>No PDF URL provided</p>
      )}
    </div>
  );
};

export default PdfViewer;
