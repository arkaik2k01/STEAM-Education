import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export const DraggableKeyword = ({ keyword, id }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { keyword },
    });

    // Apply the transform with a very slight transition for smoothness
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10, // Keep dragged item above others
        position: 'relative',
        // No transition during active dragging for responsiveness
    } : {
        transition: 'transform 0.05s ease', // Very quick transition when released
    };

    return (
        <span
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className='px-3 py-2 bg-blue-900 bg-opacity-20 text-blue-200 border 
                      border-blue-500 rounded-md cursor-grab select-none 
                      shadow-sm hover:bg-opacity-30 transition-colors
                      active:cursor-grabbing'
            style={style}
        >
            {keyword}
        </span>
    );
};