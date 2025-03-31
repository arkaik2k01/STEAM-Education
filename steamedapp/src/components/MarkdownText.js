import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

/**
 * A simple wrapper for React-Markdown that renders basic markdown
 * Properly handles newlines with remark-breaks plugin, as well as support for heading formatting
 */
const MarkdownText = ({ 
  content, 
  className = "", 
  color = "text-white",
  size = "",
  preserveHeadings = true
}) => {
  if (!content) return null;
  
  // Replace \n literals in the string with actual newlines
  const processedContent = content.replace(/\\n/g, '\n');
  
  // Combine the classes
  const combinedClassName = `${className} ${color} ${size}`.trim();
  
  // Custom component renderers with proper styling
  const components = {};

  // Only apply custom heading styles if preserveHeadings is false
  if (!preserveHeadings) {
    components.h1 = ({node, ...props}) => <h1 className={`text-2xl font-bold mb-4 ${color}`} {...props} />;
    components.h2 = ({node, ...props}) => <h2 className={`text-xl font-bold mb-3 ${color}`} {...props} />;
    components.h3 = ({node, ...props}) => <h3 className={`text-lg font-semibold mb-2 ${color}`} {...props} />;
    components.h4 = ({node, ...props}) => <h4 className={`text-base font-semibold mb-2 ${color}`} {...props} />;
    components.h5 = ({node, ...props}) => <h5 className={`text-sm font-semibold mb-1 ${color}`} {...props} />;
    components.h6 = ({node, ...props}) => <h6 className={`text-xs font-semibold mb-1 ${color}`} {...props} />;
  }
  
  // Additional component renderers for enhanced formatting (always applied)
  components.a = ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />;
  components.code = ({node, inline, ...props}) => 
    inline 
      ? <code className="font-mono bg-gray-800 px-1 rounded text-sm" {...props} />
      : <code className="font-mono block bg-gray-800 p-2 rounded text-sm my-2 overflow-x-auto" {...props} />;
  
  return (
    <div className={combinedClassName}>
      <ReactMarkdown 
        remarkPlugins={[remarkBreaks]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownText;