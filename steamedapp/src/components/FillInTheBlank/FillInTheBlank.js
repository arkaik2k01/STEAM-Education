import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DraggableKeyword } from './DraggableKeyword';
import { DroppableText } from './DroppableText';
import { fetchFIBContent } from '../util/fetchFIBContent';

const FillInTheBlank = () => {
    // State to store the keywords
    const [content, setContent] = useState({ text: '', keywords: []});
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //On mount, fetch content. Finally, set our loading to done
    useEffect(()=> {
        const loadContent = async () => {
            try {
                const data = await fetchFIBContent(''); // Add endpoint
                setContent(data);
            }
            catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }
    }
    loadContent();
    }, []);

    //Handle drag event end
    const handleDragEnd = (event) => {
        const { active, over } = event;
        //If the dragging is done AND it is over valid droppable area
        if (over && active.data.current) {
            //Take previous answers and add/replace with new one
            setAnswers(prev => ({
                ...prev,
                [over.id]: active.data.current.keyword,
            }));
        }
    }

    //Set loading messages
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    //Format text to plug into component (separate blanks from text)
    const textSegments = content.text.split('____');

    /* Create the component. DnDContext will recursively add DnD-kit functionality to all components
    * within it. DroppableText represents the drop zones for our DraggableKeywords. We map through all
    * textSegments, stopping at every blank to add a DroppableText component. We add draggableKeywords
    * to the side of the text. */
    <DndContext closestCenter={closestCenter} onDragEnd={handleDragEnd}>
        {/* Create table to hold contents */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 min-h-[400px]'>
            {/* Keywords, left side */}
            <div className='bg-gray-50 rounded-lg p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4 border-b pb-2'>
                    Answers
                </h3>
                <div className='flex gap-4 flex-wrap'>
                    {/* Map through answers and create DroppableKeyword components */}
                    {content.keywords.map((keyword, index) => (
                        <DraggableKeyword keyword={keyword} id={`keyword-${index}`} key={index} />
                    ))}
                </div>
            </div>

            {/* Text, right side */}
            <div className='bg-gray-50 rounded-lg p-6 shadow-sm'>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Fill in the Blanks
                </h3>
                <div className="text-lg leading-relaxed"></div>
                {textSegments.map((segment, index) => (
              <React.Fragment key={`segment-${index}`}>
                {segment}
                {index < textSegments.length - 1 && (
                  <DroppableBlank
                    id={`blank-${index}`}
                    value={answers[`blank-${index}`]}
                  />
                )}
              </React.Fragment>
            ))}
            </div>
            </div>
        </div>
    </DndContext>
};