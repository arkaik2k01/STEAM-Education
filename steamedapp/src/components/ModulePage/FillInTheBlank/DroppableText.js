import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const DroppableText = ({ value, id }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <span
            ref={setNodeRef}
            className={`inline-block min-w-[100px] px-4 py-1 mx-1 border-2 rounded-md
                ${isOver ? 'border-blue-500 bg-blue-900 bg-opacity-20' : 'border-gray-600'}
                ${value ? 'bg-opacity-30 bg-white border-gray-400' : ''}
                text-white`}
        >
            {value || '____'}
        </span>
    );
};