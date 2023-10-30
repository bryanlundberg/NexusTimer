import React from 'react';

interface DeleteConfirmationModalProps {
  solvesCount: number;
  onDeleteConfirmed: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ solvesCount, onDeleteConfirmed, onCancel }) => {
  return (
    <div className="delete-confirmation-modal">
      <p>
        Are you sure you want to delete this cube and its {solvesCount} solves?
      </p>
      <div className="delete-confirmation-buttons">
        <button onClick={onDeleteConfirmed}>Yes, Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

