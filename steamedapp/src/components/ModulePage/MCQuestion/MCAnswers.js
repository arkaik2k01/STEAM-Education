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
      return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800';
    }

    return feedback[index].isCorrect
      ? 'bg-green-50 border-green-500 text-green-700'
      : 'bg-red-50 border-red-500 text-red-700';
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
                ? 'text-green-600'
                : 'text-red-600'
              }`}>
              {feedback[index].isCorrect ? '✓' : '✗'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
