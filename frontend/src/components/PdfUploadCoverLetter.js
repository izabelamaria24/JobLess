import React, { useState } from 'react';
import Alert from './Alert'; 
import { useAlert } from '../utils/useAlert'; 

const PdfUploadCoverLetter = ({ applicationId }) => {
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
    formData.append('Path', pdfFile);

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await fetch(`/api/Applications/upload?id=${applicationId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showAlert('success', 'Cover letter uploaded successfully!');
      } else {
        const error = await response.json();
        showAlert('error', `Error: ${error.message || 'Upload failed'}`);
      }
    } catch (err) {
      showAlert('error', `An error occurred: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload PDF Cover Letter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select PDF: </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload Cover Letter</button>
      </form>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </div>
  );
};

export default PdfUploadCoverLetter;