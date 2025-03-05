
import React from 'react';

interface HighlightTextProps {
  text: string;
  searchTerm: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, searchTerm }) => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => (
        regex.test(part) ? 
          <span key={i} className="bg-highlight/20 text-highlight font-medium px-1 rounded">
            {part}
          </span> : 
          <span key={i}>{part}</span>
      ))}
    </>
  );
};

export default HighlightText;
