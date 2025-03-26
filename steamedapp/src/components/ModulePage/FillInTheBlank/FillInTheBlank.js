import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DraggableKeyword } from './DraggableKeyword';
import { parseFillInBlankContent } from './utils/contentParser';
import { DragAndDropExercise } from './exercise-types/DragAndDropExercise';
import { MultiBlankExercise } from './exercise-types/MultiBlankExercise';

/*
 * FillInTheBlank - Main component for drag and drop fill-in-the-blank exercises
 */
export const FillInTheBlank = ({ fib_content, onComplete }) => {
    // State to store the answers for each blank
    const [answers, setAnswers] = useState({});
    // State to store validation results for each blank
    const [validationResults, setValidationResults] = useState({});
    // State to track exercise completion
    const [isCompleted, setIsCompleted] = useState(false);
    // State to store the parsed text segments and blank positions
    const [textSegments, setTextSegments] = useState([]);
    // State to store the keywords that can be dragged
    const [keywords, setKeywords] = useState([]);
    // State to track exercise type (dragAndDrop or multiBlankDragDrop)
    const [exerciseType, setExerciseType] = useState('');
    // State to track feedback message
    const [feedback, setFeedback] = useState('');

    // On mount, determine the exercise type and parse content
    useEffect(() => {
        if (!fib_content) return;

        // Parse the content based on its structure
        const { type, segments, possibleAnswers } = parseFillInBlankContent(fib_content);

        setExerciseType(type);
        setTextSegments(segments);

        // Shuffle and set the keywords
        if (possibleAnswers && Array.isArray(possibleAnswers)) {
            setKeywords(shuffleArray([...possibleAnswers]));
        }
    }, [fib_content]);

    // Check if all blanks are filled correctly to determine overall completion
    useEffect(() => {
        if (isCompleted || !fib_content || Object.keys(validationResults).length === 0) return;

        // Get all blanks based on exercise type
        const getAllBlanks = () => {
            if (exerciseType === 'dragAndDrop') {
                return textSegments.filter(segment => segment.type === 'blank');
            } else if (exerciseType === 'multiBlankDragDrop') {
                let allBlanks = [];
                textSegments.forEach(question => {
                    const blanks = question.segments.filter(segment => segment.type === 'blank');
                    allBlanks = [...allBlanks, ...blanks];
                });
                return allBlanks;
            }
            return [];
        };

        const allBlanks = getAllBlanks();
        const totalBlanks = allBlanks.length;

        // Count correctly answered blanks
        const correctBlanks = Object.values(validationResults).filter(result => result === true).length;

        // If all blanks are answered correctly, complete the exercise
        if (correctBlanks === totalBlanks && totalBlanks > 0) {
            setIsCompleted(true);
            setFeedback('All answers are correct! Well done!');
            onComplete?.();
        }
    }, [validationResults, textSegments, exerciseType, fib_content, onComplete, isCompleted]);

    // Handle drag event end - update answers when a keyword is dropped
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (isCompleted) return; // Exercise is completed, disable dragging

        // If dragging is done AND it's over a valid droppable area
        if (over && active.data.current) {
            const blankId = over.id;
            const keyword = active.data.current.keyword;

            // Only allow dropping if the blank hasn't been correctly answered yet
            if (validationResults[blankId] !== true) {
                // Update the answer
                setAnswers(prev => ({
                    ...prev,
                    [blankId]: keyword,
                }));

                // Validate the answer immediately
                validateAnswer(blankId, keyword);
            }
        }
    };

    // Validate a single answer
    const validateAnswer = (blankId, answer) => {
        // Find the correct answer for this blank
        let correctAnswer = '';
        let segment = null;

        if (exerciseType === 'dragAndDrop') {
            segment = textSegments.find(segment => segment.type === 'blank' && segment.id === blankId);
            if (segment) {
                correctAnswer = segment.correctAnswer;
            }
        } else if (exerciseType === 'multiBlankDragDrop') {
            // Search in all questions
            for (const question of textSegments) {
                segment = question.segments.find(segment => segment.type === 'blank' && segment.id === blankId);
                if (segment) {
                    correctAnswer = segment.correctAnswer;
                    break;
                }
            }
        }

        // Update validation result
        const isCorrect = answer === correctAnswer;
        setValidationResults(prev => ({
            ...prev,
            [blankId]: isCorrect
        }));

        if (!isCorrect) {
            setFeedback(`Try again. "${answer}" doesn't match the expected answer for this blank.`);
        } else {
            setFeedback(`Correct! "${answer}" is right.`);
        }

        return isCorrect;
    };

    // Reset all answers
    const resetAnswers = () => {
        if (!isCompleted) {
            setAnswers({});
            setValidationResults({});
            setFeedback('');
        }
    };

    // Helper function to shuffle an array
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Render the exercise based on its type
    const renderExerciseContent = () => {
        if (exerciseType === 'dragAndDrop') {
            return (
                <DragAndDropExercise
                    textSegments={textSegments}
                    answers={answers}
                    keywords={keywords}
                    validationResults={validationResults}
                />
            );
        } else if (exerciseType === 'multiBlankDragDrop') {
            return (
                <MultiBlankExercise
                    textSegments={textSegments}
                    answers={answers}
                    keywords={keywords}
                    validationResults={validationResults}
                />
            );
        } else {
            // Fallback for unsupported exercise types
            return (
                <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-md text-yellow-200 border border-yellow-700">
                    <h3 className="font-bold mb-2">Unsupported Exercise Type</h3>
                    <p>The exercise type "{exerciseType}" is not supported. Exercise ID: {fib_content.id || 'Unknown'}</p>
                </div>
            );
        }
    };

    return (
        <DndContext closestCenter={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
                {renderExerciseContent()}

                {/* Feedback and control buttons */}
                <div className="flex flex-col gap-4">
                    {feedback && (
                        <div className={`p-4 rounded-md ${feedback.includes("Correct!") || isCompleted
                                ? 'bg-green-900 bg-opacity-20 text-green-200 border border-green-700'
                                : 'bg-red-900 bg-opacity-20 text-red-200 border border-red-700'
                            }`}>
                            {feedback}
                        </div>
                    )}

                    <div className="flex gap-4">
                        {!isCompleted && (
                            <button
                                onClick={resetAnswers}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md 
                                        hover:bg-gray-700 transition-colors"
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DndContext>
    );
};