import React from 'react';
import '../design/Modal.css';

const Modal = ({ children, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;