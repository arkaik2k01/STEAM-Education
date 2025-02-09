import React from 'react';

export const MCAnswers = ({ answers, feedback, setFeedback }) => {
  const handleAnswerClick = (index, isCorrect) => {
    setFeedback(prev => ({
      ...prev,
      [index]: {
        status: isCorrect ? 'Correct' : 'Incorrect',
        isCorrect
      }
    }));
  };

  const getButtonStyles = (index) => {
    if (!feedback[index]) {
      return 'bg-opacity-20 bg-white hover:bg-opacity-30 border-gray-600 text-white';
    }

    return feedback[index].isCorrect
    ? 'bg-green-900 bg-opacity-20 border-green-500 text-green-200'
    : 'bg-red-900 bg-opacity-20 border-red-500 text-red-200';
  };

  return (
    <div className='space-y-4'>
    {/* Map through answers and create buttons for each */}
      {answers.map((answer, index) => (
        <div key={index} className='flex items-center space-x-4'>
            {/* Create button for each answer. On click, it will check if the button clicked is correct
            If correct, the button will be highlighted green. Incorrect, red. */}
          <button
            onClick={() => handleAnswerClick(index, answer.isCorrect)}
            className={`flex-1 p-4 text-left rounded-md transition-all duration-200
              ${getButtonStyles(index)} border`}
            disabled={feedback[index]}
          >
            {answer.text}
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
