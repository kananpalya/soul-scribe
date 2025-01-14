import React, { memo } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { JournalEntry } from '../types';

interface EntryListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default memo(function EntryList({ entries, onEdit, onDelete }: EntryListProps) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
              {entry.updatedAt !== entry.createdAt && (
                <p className="text-xs text-gray-400">
                  Updated: {new Date(entry.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(entry)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
            {entry.content}
          </p>
        </div>
      ))}
    </div>
  );
});