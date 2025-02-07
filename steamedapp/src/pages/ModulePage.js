import React, { useState } from 'react';
import { MCQuestion } from '../components/ModulePage/MCQuestion/MCQuestion';
import { MonPyEditor } from '../components/ModulePage/MonPyEditor';
import { FillInTheBlank } from '../components/ModulePage/FillInTheBlank/FillInTheBlank';
import { GzWebFrame } from '../components/ModulePage/GzWebFrame';

const ModulePage = ({ moduleData }) => {
  const [progress, setProgress] = useState({});

  // Update progress when a section is completed
  const handleSectionComplete = (sectionId) => {
    setProgress(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  // Render different section types
  const renderSection = (section) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none bg-opacity-10 bg-white rounded-lg p-6 mb-6">
            <p className="text-white">{section.content}</p>
          </div>
        );
      case 'multiple-choice':
        return (
          <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
            <MCQuestion 
              question={section.content.question}
              answers={section.content.answers}
              onComplete={() => handleSectionComplete(section.id)}
            />
          </div>
        );
      case 'fill-blank':
        return (
          <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
            <FillInTheBlank 
              content={section.content}
              onComplete={() => handleSectionComplete(section.id)}
            />
          </div>
        );
      case 'code':
        return (
          <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
            <MonPyEditor
              initialContent={section.content.code}
              onComplete={() => handleSectionComplete(section.id)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSections = moduleData.sections.length;
    const completedSections = Object.values(progress).filter(Boolean).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      {/* Header */}
      <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">{moduleData.title}</h1>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="h-full rounded-full transition-all duration-300" 
              style={{ 
                width: `${calculateProgress()}%`,
                backgroundColor: '#0A3C91'
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Scrollable educational content */}
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-4">
            {moduleData.sections.map((section, index) => (
              <div key={`section-${index}`} className="relative">
                {/* Section completion indicator */}
                {progress[section.id] && (
                  <div 
                    className="absolute -left-4 top-4 w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#0A3C91' }}
                  />
                )}
                {renderSection(section)}
              </div>
            ))}
          </div>

          {/* Right side: Fixed GzWebFrame */}
          <div className="bg-opacity-10 bg-white rounded-lg overflow-hidden sticky top-24 h-[calc(100vh-8rem)]">
            <GzWebFrame />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;