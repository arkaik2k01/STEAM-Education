import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export const DraggableKeyword = ({ keyword, id }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { keyword },
    });

    // Enables drag animations
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <span
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className='px-3 py-2 bg-white border border-blue-200 rounded-md 
                 cursor-move select-none shadow-sm hover:shadow-md 
                 transition-shadow duration-200'
            style={style}
        >
            {keyword}
        </span>
    );
};
