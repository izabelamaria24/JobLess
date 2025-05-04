import React, { useState, useEffect } from 'react';
// import '../design/ResumeForm.css';

const ResumeForm = ({ onSubmit, initialData, userId }) => {
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
        setDescription(initialData.description || '');
        setExperience(initialData.experience || '');
        setLinkedin(initialData.linkedin || '');
        setGithub(initialData.github || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
  
    try {
      await onSubmit({
        description,
        experience,
        linkedin,
        github
      });
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Experience:</label>
        <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} />
      </div>
      <div>
        <label>Linkedin:</label>
        <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </div>
      <div>
        <label>Github:</label>
        <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} />
      </div>


      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ResumeForm;