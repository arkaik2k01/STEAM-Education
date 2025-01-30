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
                  ${isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                  ${value ? 'bg-blue-50 border-blue-300' : ''}`}
        >
            {value || '____'}
        </span>
    );
};