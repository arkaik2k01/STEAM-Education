import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DraggableKeyword } from './DraggableKeyword';
import { DroppableText } from './DroppableText';
import { SubmitButton } from './SubmitButton';


export const FillInTheBlank = ({ content, onComplete }) => {
    // State to store the keywords
    const [answers, setAnswers] = useState({});
    const [locked, setLocked] = useState(false);
    // State to store the parsed text segments and blank positions
    const [textSegments, setTextSegments] = useState([]);
    const [keywords, setKeywords] = useState([]);

    //On mount, fetch content. Finally, set our loading to done
    useEffect(() => {
        if (!content) return;

        // Parse the text to identify blanks using consecutive "_" characters 
        const segments = [];

        // Use regex to split the text by consecutive underscores
        const regex = /_{1,}/g; // Match 1 or more consecutive underscores
        let lastIndex = 0;
        let blankIndex = 0;
        let match;

        // Find all matches of consecutive underscores
        while ((match = regex.exec(content.text)) !== null) {
            // Add the text segment before this blank
            if (match.index > lastIndex) {
                segments.push({
                    type: 'text',
                    content: content.text.substring(lastIndex, match.index)
                });
            }

            // Add the blank
            segments.push({
                type: 'blank',
                id: `blank-${blankIndex}`
            });
            blankIndex++;

            // Update lastIndex to continue after this blank
            lastIndex = match.index + match[0].length;
        }

        // Add any remaining text after the last blank
        if (lastIndex < content.text.length) {
            segments.push({
                type: 'text',
                content: content.text.substring(lastIndex)
            });
        }

        // Set the parsed text segments and blank positions
        setTextSegments(segments);

        // Shuffle the answers and set the keywords
        if (content.answers) {
            setKeywords(shuffleArray([...content.answers]));
        }
    }, [content]);

    // Check if all blanks are filled correctly
    useEffect(() => {
        if (!content || !content.items || Object.keys(answers).length === 0) return;

        const blankSegments = textSegments.filter(segment => segment.type === 'blank').length;
        const blankCount = blankSegments.length;

        // If all blanks are filled
        if (Object.keys(answers).length === blankCount) {
            // Check if each answer matches the corresponding item's category
            const isCorrect = blankSegments.every(segment => {
                // Get index number from blank-0, blank-1, etc.
                const blankIndex = parseInt(segment.id.split('-')[1]);
                // Get the expected answer from the items array
                const expectedAnswer = content.answers[blankIndex];
                return answers[segment.id] === expectedAnswer;
            });

            if (isCorrect) {
                setLocked(true);
                onComplete?.();
            }
        }
    }, [answers, textSegments, content, onComplete]);

    // Handle drag event end
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (locked) return; // The exercise is completed, disable dragging

        // If dragging is done AND it's over a valid droppable area
        if (over && active.data.current) {
            // Take previous answers and add/replace with new one
            setAnswers(prev => ({
                ...prev,
                [over.id]: active.data.current.keyword,
            }));
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

    /* Create the component. DnDContext will recursively add DnD-kit functionality to all components
    * within it. DroppableText represents the drop zones for our DraggableKeywords. We map through all
    * textSegments, stopping at every blank to add a DroppableText component. We add draggableKeywords
    * to the side of the text. */
    return (
        <DndContext closestCenter={closestCenter} onDragEnd={handleDragEnd}>
            {/* Create table to hold contents */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Text, left side */}
                <div className='bg-opacity-20 bg-white rounded-lg p-6'>
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
                        Fill in the Blanks
                    </h3>
                    <div className="text-lg leading-relaxed text-white">
                    {textSegments.map((segment, index) => {
                            if (segment.type === 'text') {
                                return (
                                    <span key={`segment-${index}`}>
                                        {segment.content}
                                    </span>
                                );
                            } else {
                                return (
                                    <DroppableText
                                        key={`segment-${index}`}
                                        id={segment.id}
                                        value={answers[segment.id]}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>



                {/* Keywords, right side */}
                <div className='bg-opacity-20 bg-white rounded-lg p-6'>
                    <h3 className='text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white'>
                        Answers
                    </h3>
                    <div className='flex gap-4 flex-wrap'>
                        {/* Map through answers and create DroppableKeyword components */}
                        {keywords.map((keyword, index) => (
                            <DraggableKeyword keyword={keyword} id={`keyword-${index}`} key={index} />
                        ))}
                    </div>
                </div>

                <div className='col-span-full'>
                    <SubmitButton
                        answers={answers}
                        textSegments={textSegments}
                        content={content}
                        setLocked={setLocked}
                        onComplete={onComplete}
                    />
                </div>
            </div>
        </DndContext>
    );
};