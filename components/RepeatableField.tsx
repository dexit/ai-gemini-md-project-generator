import React, { useState } from 'react';
import { PlusIcon, TrashIcon, DragHandleIcon } from './icons';

interface RepeatableFieldProps {
  label: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const RepeatableField: React.FC<RepeatableFieldProps> = ({ label, description, values, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleAddItem = () => {
    onChange([...values, '']);
  };

  const handleRemoveItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };
  
  const handleDragLeave = () => {
     setDragOverIndex(null);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
    }
    
    const newValues = [...values];
    const draggedItem = newValues.splice(draggedIndex, 1)[0];
    newValues.splice(dragOverIndex, 0, draggedItem);
    onChange(newValues);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };


  return (
    <div>
      <label className="block text-md font-medium text-gray-300">{label}</label>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <div className="space-y-2" onDragLeave={handleDragLeave}>
        {values.map((value, index) => (
          <React.Fragment key={index}>
             {dragOverIndex === index && draggedIndex !== index && <div className="drag-over-indicator"></div>}
             <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                className={`flex items-center gap-2 draggable-item ${draggedIndex === index ? 'dragging' : ''}`}
              >
              <div className="cursor-move text-gray-500">
                  <DragHandleIcon />
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button onClick={() => handleRemoveItem(index)} className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors">
                <TrashIcon />
              </button>
            </div>
          </React.Fragment>
        ))}
         {dragOverIndex === values.length && <div className="drag-over-indicator"></div>}
      </div>
      <button onClick={handleAddItem} className="mt-2 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm">
        <PlusIcon />
        Add Item
      </button>
    </div>
  );
};

export default RepeatableField;