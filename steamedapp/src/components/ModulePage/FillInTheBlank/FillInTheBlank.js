import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DraggableKeyword } from './DraggableKeyword';
import { DroppableText } from './DroppableText';
import { SubmitButton } from './SubmitButton';


export const FillInTheBlank = ({ content, onComplete }) => {
    // State to store the keywords
    const [answers, setAnswers] = useState({});
    const [locked, setLocked] = useState(false);

    //On mount, fetch content. Finally, set our loading to done
    useEffect(() => {
        if (Object.keys(answers).length === content.answer_key.length) {
            const isCorrect = content.answer_key.every((answer, index) =>
                answers[`blank-${index}`] === answer
            );
            if (isCorrect) {
                setLocked(true);
                onComplete?.();
            }
        }
    }, [answers, content.answer_key, onComplete]);

    //Handle drag event end
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (locked) return; //The answer is done, disable dragging

        //If the dragging is done AND it is over valid droppable area
        if (over && active.data.current) {
            //Take previous answers and add/replace with new one
            setAnswers(prev => ({
                ...prev,
                [over.id]: active.data.current.keyword,
            }));
        }
    }

    //Format text to plug into component (separate blanks from text)
    const textSegments = content.text.split('____');

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
                        {textSegments.map((segment, index) => (
                            <React.Fragment key={`segment-${index}`}>
                                {segment}
                                {index < textSegments.length - 1 && (
                                    <DroppableText
                                        id={`blank-${index}`}
                                        value={answers[`blank-${index}`]}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>



                {/* Keywords, right side */}
                <div className='bg-opacity-20 bg-white rounded-lg p-6'>
                    <h3 className='text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white'>
                        Answers
                    </h3>
                    <div className='flex gap-4 flex-wrap'>
                        {/* Map through answers and create DroppableKeyword components */}
                        {content.keywords.map((keyword, index) => (
                            <DraggableKeyword keyword={keyword} id={`keyword-${index}`} key={index} />
                        ))}
                    </div>
                </div>

                <div className='col-span-full'>
                    <SubmitButton
                        answers={answers}
                        content={content}
                        setLocked={setLocked}
                    />
                </div>
            </div>
        </DndContext>
    );
};