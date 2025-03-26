import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const DroppableText = ({ value, id, isCorrect }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        // Disable dropping if already correct
        disabled: isCorrect === true
    });

    // Determine the styling based on the validation state
    const getBorderClass = () => {
        if (isCorrect === true) {
            // Correct answer - green
            return 'border-green-500 bg-green-900 bg-opacity-20';
        } else if (isCorrect === false) {
            // Incorrect answer - red
            return 'border-red-500 bg-red-900 bg-opacity-20';
        } else {
            // No validation yet - default style
            return isOver
                ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                : value
                    ? 'bg-opacity-30 bg-white border-gray-400'
                    : 'border-gray-600';
        }
    };

    // Determine cursor style
    const getCursorClass = () => {
        return isCorrect === true ? 'cursor-not-allowed' : 'cursor-pointer';
    };

    return (
        <span
            ref={setNodeRef}
            className={`inline-block min-w-[100px] px-4 py-1 mx-1 border-2 rounded-md
                ${getBorderClass()} ${getCursorClass()}
                text-white`}
        >
            {value || '____'}
            
            {/* Show validation icon if there's a value and validation state */}
            {value && isCorrect !== undefined && (
                <span className="ml-2">
                    {isCorrect
                        ? <span className="text-green-400">✓</span>
                        : <span className="text-red-400">✗</span>
                    }
                </span>
            )}
        </span>
    );
};