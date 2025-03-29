import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

/**
 * A simple wrapper for React-Markdown that renders basic markdown
 * Properly handles newlines with remark-breaks plugin
 */
const SimpleMarkdown = ({ content, className = "" }) => {
  if (!content) return null;
  
  // Replace \n literals in the string with actual newlines
  const processedContent = content.replace(/\\n/g, '\n');
  
  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkBreaks]} // This plugin treats newlines as <br>
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default SimpleMarkdown;