import React, { useState } from 'react';

export const SubmitButton = ({ answers, textSegments, content, setLocked, onComplete}) => {
    const [isCorrect, setIsCorrect] = useState(null);

    const checkAnswers = () => {
        // Get all blank segments
        const blankSegments = textSegments.filter(segment => segment.type === 'blank');
        
        // Make sure all blanks are filled
        const allBlanksFilled = blankSegments.every(segment => answers[segment.id]);
        
        if (!allBlanksFilled) {
            setIsCorrect(false);
            return;
        }
        
        // Check if each answer matches the corresponding item's category
        const areAllCorrect = blankSegments.every(segment => {
            const blankIndex = parseInt(segment.id.split('-')[1]);
            const expectedAnswer = content.answers[blankIndex];
            return answers[segment.id] === expectedAnswer;
        });

        setIsCorrect(areAllCorrect);
        setLocked(areAllCorrect);
        
        if (areAllCorrect) {
            // If all answers are correct, call onComplete if provided
            onComplete();
        }
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