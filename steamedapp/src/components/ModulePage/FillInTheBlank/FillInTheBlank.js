import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DraggableKeyword } from './DraggableKeyword';
import MarkdownText from '../../MarkdownText';
import { DroppableText } from './DroppableText';

/*
 * FillInTheBlank - Consolidated component for drag and drop fill-in-the-blank exercises
 * Now supports only a single dragAndDrop type with improved blank detection and formatting
 */
export const FillInTheBlank = ({ fib_content, onComplete }) => {
    // State to store the answers for each blank
    const [answers, setAnswers] = useState({});
    // State to store validation results for each blank
    const [validationResults, setValidationResults] = useState({});
    // State to track exercise completion
    const [isCompleted, setIsCompleted] = useState(false);
    // State to track feedback message
    const [feedback, setFeedback] = useState('');
    // State to store parsed items with blanks
    const [parsedItems, setParsedItems] = useState([]);
    // State to store the keywords that can be dragged
    const [keywords, setKeywords] = useState([]);

    // On mount, parse the content and prepare the exercise
    useEffect(() => {
        if (!fib_content) return;

        console.log('Processing fill-in-the-blank content:', fib_content.id);

        // Parse items to identify blanks
        const newParsedItems = parseItems(fib_content.items || []);
        setParsedItems(newParsedItems);

        // Shuffle and set the keywords from possibleAnswers array
        if (fib_content.possibleAnswers && Array.isArray(fib_content.possibleAnswers)) {
            setKeywords(shuffleArray([...fib_content.possibleAnswers]));
        }
    }, [fib_content]);

    // Check if all blanks are filled correctly to determine overall completion
    useEffect(() => {
        if (isCompleted || !fib_content || Object.keys(validationResults).length === 0) return;

        // Count total blanks and correct answers
        const totalBlanks = parsedItems.flatMap(item => item.segments.filter(seg => seg.type === 'blank')).length;
        const correctBlanks = Object.values(validationResults).filter(result => result === true).length;

        // If all blanks are answered correctly, complete the exercise
        if (correctBlanks === totalBlanks && totalBlanks > 0) {
            setIsCompleted(true);
            setFeedback('All answers are correct! Well done!');
            onComplete?.();
        }
    }, [validationResults, parsedItems, fib_content, onComplete, isCompleted]);

    // Parse items to identify text and blank segments
    const parseItems = (items) => {
        return items.map((item, index) => {
            const segments = [];
            const text = item.text || `Question ${index + 1}`;
            const itemId = item.id || `item-${index}`;
            const correctAnswer = item.category || '';

            // Regular expression to match two or more consecutive underscores
            const regex = /_{3,}/g;
            let lastIndex = 0;
            let match;
            let blankIndex = 0;
            let hasBlank = false;

            // Find blanks in the text (two or more underscores)
            while ((match = regex.exec(text)) !== null) {
                // Add the text segment before this blank
                if (match.index > lastIndex) {
                    segments.push({
                        type: 'text',
                        content: text.substring(lastIndex, match.index),
                        id: `text-${itemId}-${lastIndex}`
                    });
                }

                // Add the blank with the correct answer
                segments.push({
                    type: 'blank',
                    id: `blank-${itemId}-${blankIndex}`,
                    itemId: itemId,
                    correctAnswer: correctAnswer
                });

                blankIndex++;
                hasBlank = true;

                // Update lastIndex to continue after this blank
                lastIndex = match.index + match[0].length;
            }

            // Add any remaining text after the last blank
            if (lastIndex < text.length) {
                segments.push({
                    type: 'text',
                    content: text.substring(lastIndex),
                    id: `text-${itemId}-end`
                });
            }

            // If no blanks were found using regex, add a separate blank
            // This is a fallback for items without explicit underscores
            if (!hasBlank) {
                segments.push({
                    type: 'blank',
                    id: `blank-${itemId}-0`,
                    itemId: itemId,
                    correctAnswer: correctAnswer
                });
            }

            return {
                id: itemId,
                segments,
                originalText: text
            };
        });
    };

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
        // Find the blank segment
        let segment = null;
        let correctAnswer = '';

        // Search in all parsed items for the blank
        for (const item of parsedItems) {
            const foundSegment = item.segments.find(seg => 
                seg.type === 'blank' && seg.id === blankId
            );
            
            if (foundSegment) {
                segment = foundSegment;
                correctAnswer = segment.correctAnswer;
                break;
            }
        }

        // Also check if there's a correctAnswers mapping in the content
        if (fib_content.correctAnswers && fib_content.correctAnswers[answer]) {
            const mappedItemId = fib_content.correctAnswers[answer];
            // If this answer maps to the current item, it's correct
            if (segment && segment.itemId === mappedItemId) {
                correctAnswer = answer;
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

    return (
        <DndContext closestCenter={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
                {/* List of questions with blanks */}
                <div className="bg-opacity-20 bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
                        Fill in the Blanks
                    </h3>
                    <ol className="list-decimal list-inside space-y-4 text-white">
                        {parsedItems.map((item) => (
                            <li key={item.id} className="ml-2">
                                <div className="inline-flex flex-wrap items-center">
                                    {item.segments.map((segment, segIndex) => {
                                        if (segment.type === 'text') {
                                            return (
                                                <span key={segment.id} className="mr-0">
                                                    {segment.content}
                                                </span>
                                            );
                                        } else if (segment.type === 'blank') {
                                            return (
                                                <DroppableText
                                                    key={segment.id}
                                                    id={segment.id}
                                                    value={answers[segment.id]}
                                                    isCorrect={validationResults[segment.id]}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Word bank */}
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