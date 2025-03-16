
import React, { ReactNode } from 'react';

interface ContactItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  link?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, link }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-white p-1.5 rounded-full shadow-sm mt-0.5">
        {icon}
      </div>
      <div>
        <span className="text-sm text-gray-500">{label}</span>
        {link ? (
          <p className="font-medium">
            <a href={link} target={link.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] inline-block">
              {value}
            </a>
          </p>
        ) : (
          <p className="font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

export default ContactItem;
