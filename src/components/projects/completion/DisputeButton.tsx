
import React from 'react';

interface DisputeButtonProps {
  onClick: () => void;
}

const DisputeButton: React.FC<DisputeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-red-600 text-sm underline hover:text-red-800"
    >
      Dispute
    </button>
  );
};

export default DisputeButton;
