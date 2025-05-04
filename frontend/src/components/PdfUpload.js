
import React, { useState } from 'react';

const PdfUpload = ({resumeId}) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      setMessage('Please select a PDF file and enter a resume ID.');
      return;
    }

    const formData = new FormData();
    formData.append('PdfFile', pdfFile);


    try {

      const token = JSON.parse(localStorage.getItem("token"));


      const response = await fetch(`/api/Resumes/upload?id=${resumeId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Upload successful! Resume ID: ${result.id}`);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || 'Upload failed'}`);
      }
    } catch (err) {
      setMessage(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload PDF Resume</h2>
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
        <button type="submit">Upload</button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default PdfUpload;
