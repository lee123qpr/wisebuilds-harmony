
import React from 'react';

interface ApplicationMessageProps {
  message?: string;
}

export const ApplicationMessage: React.FC<ApplicationMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-slate-50 p-4 rounded-md">
      <p className="font-medium mb-1">Application message:</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};
