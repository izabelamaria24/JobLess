import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import { useAlert } from '../utils/useAlert'; 

const ResumeForm = ({ onSubmit, initialData, userId }) => {
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { alert, showAlert, closeAlert } = useAlert(); 

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
    setIsLoading(true);

    if (!description || !experience || !linkedin || !github) {
      showAlert('error', 'All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit({
        description,
        experience,
        linkedin,
        github,
      });
      setIsLoading(false);
      showAlert('success', 'Resume submitted successfully!');
    } catch (err) {
      setIsLoading(false);
      showAlert('error', 'Failed to submit the resume. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Experience:</label>
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Linkedin:</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Github:</label>
        <input
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
    </form>
  );
};

export default ResumeForm;