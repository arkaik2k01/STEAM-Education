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
                className="px-4 py-2 bg-blue-500 text-white rounded-md 
                          hover:bg-blue-600 transition-colors"
            >
                Check Answers
            </button>

            {isCorrect !== null && (
                <div className={`mt-2 p-4 rounded-md ${
                    isCorrect 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {isCorrect 
                        ? "All answers are correct! Well done!" 
                        : "Some answers are incorrect. Try again!"}
                </div>
            )}
        </div>
    );
}