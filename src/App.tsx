import React, { useState, useEffect } from 'react';
import { Moon, Sun, Upload, Download, BookText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Auth from './components/Auth';
import Editor from './components/Editor';
import EntryList from './components/EntryList';
import { AppState, JournalEntry, User } from './types';
import { saveState, loadState, exportEntries } from './utils/storage';
import { encrypt } from './utils/encryption';

function App() {
  const [state, setState] = useState<AppState>({
    theme: 'light',
    user: null,
    entries: [],
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setState(prev => ({ ...prev, theme }));
  }, []);

  const handleLogin = (username: string, password: string) => {
    const passwordHash = encrypt(password, username);
    const user: User = { id: uuidv4(), username, passwordHash };
    const loadedState = loadState(passwordHash);
    
    setState(prev => ({
      ...prev,
      user,
      entries: loadedState?.entries || [],
    }));
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setState(prev => ({ ...prev, theme: newTheme }));
  };

  const handleSaveEntry = (entryData: Partial<JournalEntry>) => {
    const entries = [...state.entries];
    
    if (selectedEntry) {
      const index = entries.findIndex(e => e.id === selectedEntry.id);
      entries[index] = { ...selectedEntry, ...entryData };
    } else {
      const newEntry: JournalEntry = {
        id: uuidv4(),
        title: entryData.title || 'Untitled',
        content: entryData.content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      entries.unshift(newEntry);
    }

    setState(prev => ({ ...prev, entries }));
    if (state.user) {
      saveState({ ...state, entries }, state.user.passwordHash);
    }
    setIsEditing(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    const entries = state.entries.filter(e => e.id !== id);
    setState(prev => ({ ...prev, entries }));
    if (state.user) {
      saveState({ ...state, entries }, state.user.passwordHash);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const entries = JSON.parse(e.target?.result as string);
          setState(prev => ({ ...prev, entries }));
          if (state.user) {
            saveState({ ...state, entries }, state.user.passwordHash);
          }
        } catch (error) {
          console.error('Failed to import entries:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!state.user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookText className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">SoulScribe</h1>
          </div>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Upload className="h-5 w-5" />
            </label>
            <button 
              onClick={() => exportEntries(state.entries)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={state.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {state.theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isEditing ? (
          <Editor
            entry={selectedEntry || undefined}
            onSave={handleSaveEntry}
            onClose={() => {
              setIsEditing(false);
              setSelectedEntry(null);
            }}
          />
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full p-4 text-left rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            >
              Write a new entry...
            </button>
            <EntryList
              entries={state.entries}
              onEdit={(entry) => {
                setSelectedEntry(entry);
                setIsEditing(true);
              }}
              onDelete={handleDeleteEntry}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;