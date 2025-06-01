import React, { useState } from 'react';
import Alert from './Alert'; 
import { useAlert } from '../utils/useAlert'; 

const PdfUpload = ({ applicationId, isCoverLetter = false }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const { alert, showAlert, closeAlert } = useAlert();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      showAlert('error', 'Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('PdfFile', pdfFile);

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      // Always use Applications/upload endpoint for cover letters
      const endpoint = `/api/Applications/upload?id=${applicationId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showAlert('success', `Upload successful!`);
      } else {
        const error = await response.json();
        showAlert('error', `Error: ${error.message || 'Upload failed'}`);
      }
    } catch (err) {
      showAlert('error', `An error occurred: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload Cover Letter</button>
      </form>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
};

export default PdfUpload;