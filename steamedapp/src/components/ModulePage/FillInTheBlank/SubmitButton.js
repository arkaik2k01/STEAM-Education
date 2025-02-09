import React, { useState } from 'react';

export const SubmitButton = ({ answers, content, setLocked}) => {
    const [isCorrect, setIsCorrect] = useState(null);

    const checkAnswers = () => {
        const areAllCorrect = content.answer_key.every((correctAnswer, index) => 
            answers[`blank-${index}`] === correctAnswer
        );

        setIsCorrect(areAllCorrect);
        setLocked(areAllCorrect);
    };

    return (
        <div className="mt-4">
            <button 
                onClick={checkAnswers}
                className='px-4 py-2 bg-blue-600 text-white rounded-md 
                          hover:bg-blue-700 transition-colors'
            >
                Check Answers
            </button>

            {isCorrect !== null && (
                <div className={`mt-2 p-4 rounded-md ${
                    isCorrect 
                        ? 'bg-green-900 bg-opacity-20 text-green-200 border border-green-700' 
                        : 'bg-red-900 bg-opacity-20 text-red-200 border border-red-700'
                }`}>
                    {isCorrect 
                        ? "All answers are correct! Well done!" 
                        : "Some answers are incorrect. Try again!"}
                </div>
            )}
        </div>
    );
}