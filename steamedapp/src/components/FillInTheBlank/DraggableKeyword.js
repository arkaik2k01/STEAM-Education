import React from 'react';
import { UseDraggable } from '@dnd-kit/core';

const DraggableKeyword = ({ keyword, id }) => {
    const { attributes, listeners, setNodeRef, transform } = UseDraggable({
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
            className='px-2 py-1 bg-blue-100 rounded cursor-move select-none'
            style={style}
        >
            {keyword}
        </span>
    );
};
