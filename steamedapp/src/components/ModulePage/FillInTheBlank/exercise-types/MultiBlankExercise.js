import React from 'react';
import { DroppableText } from '../DroppableText';
import { DraggableKeyword } from '../DraggableKeyword';

/**
 * MultiBlankExercise - Component for rendering multiple questions with multiple blanks
 * 
 * @param {Object} props - Component props
 * @param {Array} props.textSegments - Array of question objects, each with segments
 * @param {Object} props.answers - Current answers state
 * @param {Array} props.keywords - Available keywords to drag
 * @param {Object} props.validationResults - Results of answer validation
 */
export const MultiBlankExercise = ({ textSegments, answers, keywords, validationResults = {} }) => {
    // Check if textSegments is in the expected format
    const isValidFormat = Array.isArray(textSegments) && textSegments.length > 0;

    if (!isValidFormat) {
        return (
            <div className="bg-red-900 bg-opacity-20 p-4 rounded-md text-red-200 border border-red-700">
                <h3 className="font-bold mb-2">Invalid Exercise Format</h3>
                <p>This exercise could not be displayed due to a data format issue.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Render each question */}
            {textSegments.map((question, questionIndex) => (
                <div key={`question-${questionIndex}`} className="bg-opacity-20 bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
                        {question.title}
                    </h3>
                    <div className="text-lg leading-relaxed text-white">
                        {question.segments.map((segment, index) => {
                            if (segment.type === 'text') {
                                return (
                                    <span key={`segment-${question.questionIndex}-${index}`}>
                                        {segment.content}
                                    </span>
                                );
                            } else {
                                // For blank segments, pass validation result
                                const isCorrect = validationResults[segment.id];
                                return (
                                    <DroppableText
                                        key={`segment-${question.questionIndex}-${index}`}
                                        id={segment.id}
                                        value={answers[segment.id]}
                                        isCorrect={isCorrect}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            ))}

            {/* Word bank - shared across all questions */}
            <div className="bg-opacity-20 bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
                    Word Bank
                </h3>
                <div className="flex flex-wrap gap-4">
                    {keywords.map((keyword, index) => (
                        <DraggableKeyword
                            keyword={keyword}
                            id={`keyword-${index}`}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};