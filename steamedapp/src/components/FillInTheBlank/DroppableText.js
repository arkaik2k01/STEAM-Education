import React from 'react';
import { UseDroppable } from '@dnd-kit/core';

const DroppableText = ({ value, id }) => {
    const { isOver, setNodeRef } = UseDroppable({
        id: id,
    });

    return (
        <span
          ref={setNodeRef}
          className={`inline-block min-w-[100px] px-4 py-1 mx-1 border-2 rounded ${
            isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'
          } ${value ? 'bg-blue-50' : ''}`}
        >
          {value || '_____'}
        </span>
      );
    };