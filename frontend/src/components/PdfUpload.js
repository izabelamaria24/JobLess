/*

      THIS IS FOR TEST PURPOSES
      TO BE CONTINUED...

*/


import React, { useState } from 'react';

const PdfUpload = () => {
  const [resumeId, setResumeId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile || !resumeId) {
      setMessage('Please select a PDF file and enter a resume ID.');
      return;
    }

    const formData = new FormData();
    formData.append('PdfFile', pdfFile);


    try {
      const response = await fetch(`/api/Resumes/upload?id=${resumeId}`, {
        method: 'POST',
        body: formData,
        // Uncomment and add token if your API requires authentication
        // headers: {
        //   Authorization: `Bearer ${yourJwtToken}`
        // }
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
          <label>Resume ID: </label>
          <input
            type="number"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            required
          />
        </div>
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
