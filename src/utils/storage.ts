import { AppState, JournalEntry, User } from '../types';
import { encrypt, decrypt } from './encryption';

const STORAGE_KEY = 'journal_app_data';

export const saveState = (state: AppState, password: string): void => {
  try {
    const encrypted = encrypt(JSON.stringify(state), password);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    // Silently handle encryption errors to prevent data corruption
    console.warn('Failed to save state');
  }
};

export const loadState = (password: string): AppState | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) {
      // Return null without logging an error for first-time users
      return null;
    }
    
    const decrypted = decrypt(encrypted, password);
    return JSON.parse(decrypted);
  } catch (error) {
    // Return null without logging an error for invalid states
    return null;
  }
};

export const exportEntries = (entries: JournalEntry[]): void => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `soulscribe_entries_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};