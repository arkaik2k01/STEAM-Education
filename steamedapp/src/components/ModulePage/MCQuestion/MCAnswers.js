import React from 'react';

export const MCAnswers = ({ options, correctAnswer, feedback, setFeedback }) => {
  // Check if the answer is correct
  const handleAnswerClick = (option, index) => {
    const isCorrect = option === correctAnswer;

    setFeedback(prev => ({
      ...prev,
      [index]: {
        status: isCorrect ? 'Correct' : 'Incorrect',
        isCorrect
      }
    }));
  };

  const getButtonStyles = (index) => {
    // Check if any option has been correctly answered
    const hasCorrectAnswer = Object.values(feedback).some(f => f.isCorrect);
    
    // If no, feedback for this option yet
    if (!feedback[index]) {
      // If another option is correct, gray out this one
      if (hasCorrectAnswer) {
        return 'bg-opacity-10 bg-gray-500 border-gray-600 text-gray-400 cursor-not-allowed';
      }
      return 'bg-opacity-20 bg-white hover:bg-opacity-30 border-gray-600 text-white';
    }

    return feedback[index].isCorrect
    ? 'bg-green-900 bg-opacity-20 border-green-500 text-green-200'
    : 'bg-red-900 bg-opacity-20 border-red-500 text-red-200';
  };

  return (
    <div className='space-y-4'>
    {/* Map through answers and create buttons for each */}
      {options.map((option, index) => (
        <div key={index} className='flex items-center space-x-4'>
            {/* Create button for each answer. On click, it will check if the button clicked is correct
            If correct, the button will be highlighted green. Incorrect, red.  Once a question is correct,
            grey out the buttons and disable*/}
          <button
            onClick={() => handleAnswerClick(option, index)}
            className={`flex-1 p-4 text-left rounded-md transition-all duration-200
              ${getButtonStyles(index)} border`}
            disabled={feedback[index] || Object.values(feedback).some(f => f.isCorrect)}
          >
            {option}
          </button>
          {feedback[index] && (
            <span className={`font-medium ${feedback[index].isCorrect
                ? 'text-green-400'
                : 'text-red-400'
              }`}>
              {feedback[index].isCorrect ? '✓' : '✗'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
