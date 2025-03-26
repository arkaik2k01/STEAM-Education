import React from 'react';
import { DroppableText } from '../DroppableText';
import { DraggableKeyword } from '../DraggableKeyword';

/**
 * DragAndDropExercise - Component for rendering itemized drag-and-drop exercises
 * 
 * @param {Object} props - Component props
 * @param {Array} props.textSegments - Array of text and blank segments
 * @param {Object} props.answers - Current answers state
 * @param {Array} props.keywords - Available keywords to drag
 * @param {Object} props.validationResults - Results of answer validation
 */
export const DragAndDropExercise = ({ textSegments, answers, keywords, validationResults = {} }) => {
    // Group text and blank segments by item ID
    const groupedItems = getGroupedItems(textSegments);

    /**
     * Group text segments and blanks by itemId for organized display
     */
    function getGroupedItems(segments) {
        // First, group segments by itemId
        const groups = {};
        const blanks = {};

        // Find all blanks first and index them by itemId
        segments.forEach(segment => {
            if (segment.type === 'blank' && segment.itemId) {
                blanks[segment.itemId] = segment;
            }
        });

        // Group text segments by itemId
        segments.forEach(segment => {
            if (segment.type === 'text') {
                let itemId;

                // Extract itemId from text-itemId-position format
                if (segment.id && segment.id.startsWith('text-')) {
                    const parts = segment.id.split('-');
                    if (parts.length >= 2) {
                        itemId = parts[1];
                    }
                } else {
                    // Direct itemId
                    itemId = segment.id;
                }

                if (itemId) {
                    if (!groups[itemId]) {
                        groups[itemId] = {
                            texts: [],
                            blank: blanks[itemId] // Add corresponding blank
                        };
                    }
                    groups[itemId].texts.push(segment);
                }
            }
        });

        return groups;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Itemized questions */}
            <div className="bg-opacity-20 bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 text-white">
                    Fill in the Blanks
                </h3>
                <div className="space-y-6">
                    {Object.entries(groupedItems).map(([itemId, group], index) => {
                        // Check if this group has the blank text format with underscores
                        const hasInlineBlank = group.texts.length > 1;
                        const blankId = group.blank ? group.blank.id : null;
                        const isCorrect = blankId ? validationResults[blankId] : undefined;

                        if (hasInlineBlank) {
                            // Render text with inline blank
                            return (
                                <div key={`group-${itemId}`} className="text-lg text-white">
                                    {group.texts.map((textSegment, i) => (
                                        <React.Fragment key={`text-${itemId}-${i}`}>
                                            <span>{textSegment.content}</span>
                                            {i < group.texts.length - 1 && group.blank && (
                                                <DroppableText
                                                    id={group.blank.id}
                                                    value={answers[group.blank.id]}
                                                    isCorrect={isCorrect}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            );
                        } else {
                            // Render question with separate blank (traditional format)
                            return (
                                <div key={`group-${itemId}`} className="flex flex-col space-y-2">
                                    {group.texts.map((textSegment, i) => (
                                        <div key={`text-${itemId}-${i}`} className="text-lg text-white">
                                            {textSegment.content}
                                        </div>
                                    ))}
                                    {group.blank && (
                                        <div className="ml-8">
                                            <DroppableText
                                                id={group.blank.id}
                                                value={answers[group.blank.id]}
                                                isCorrect={isCorrect}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    })}
                </div>
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
        </div>
    );
};