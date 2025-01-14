import React, { useState, useEffect, memo } from 'react';
import { Save, X, Clock } from 'lucide-react';
import { JournalEntry } from '../types';

interface EditorProps {
  entry?: JournalEntry;
  onSave: (entry: Partial<JournalEntry>) => void;
  onClose: () => void;
}

export default memo(function Editor({ entry, onSave, onClose }: EditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
  }, [entry]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    onSave({
      title,
      content,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry Title"
            className="text-xl font-semibold bg-transparent border-none outline-none w-full"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{currentTime}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <Save size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="flex-1 p-4 bg-transparent border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
});