
const DB_NAME = 'typingTrainerDB';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

let db = null;

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('language', 'language', { unique: false });
      }
    };
  });
}

export async function saveSession(sessionData) {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({
      ...sessionData,
      timestamp: Date.now(),
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSessions() {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSessionsByLanguage(language) {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('language');
    const request = index.getAll(language);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllSessions() {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}


export const settingsStorage = {
  getLanguage() {
    return localStorage.getItem('typingTrainer_language') || 'en';
  },
  setLanguage(lang) {
    localStorage.setItem('typingTrainer_language', lang);
  },
  getMode() {
    return localStorage.getItem('typingTrainer_mode') || 'text';
  },
  setMode(mode) {
    localStorage.setItem('typingTrainer_mode', mode);
  },
  getDifficulty() {
    return localStorage.getItem('typingTrainer_difficulty') || 'medium';
  },
  setDifficulty(difficulty) {
    localStorage.setItem('typingTrainer_difficulty', difficulty);
  },
  getTheme() {
    return localStorage.getItem('typingTrainer_theme') || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem('typingTrainer_theme', theme);
  },
  getEnabledCategories(difficulty) {
    const key = `typingTrainer_enabledCategories_${difficulty}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null; 
      }
    }
    return null; 
  },
  setEnabledCategories(difficulty, categories) {
    const key = `typingTrainer_enabledCategories_${difficulty}`;
    localStorage.setItem(key, JSON.stringify(categories));
  },
  getShowKeyboard() {
    const stored = localStorage.getItem('typingTrainer_showKeyboard');
    return stored !== null ? stored === 'true' : true; 
  },
  setShowKeyboard(show) {
    localStorage.setItem('typingTrainer_showKeyboard', show.toString());
  },
  getShowFingerIndicator() {
    const stored = localStorage.getItem('typingTrainer_showFingerIndicator');
    return stored !== null ? stored === 'true' : true; 
  },
  setShowFingerIndicator(show) {
    localStorage.setItem('typingTrainer_showFingerIndicator', show.toString());
  },
  getShowMeters() {
    const stored = localStorage.getItem('typingTrainer_showMeters');
    return stored !== null ? stored === 'true' : true;
  },
  setShowMeters(show) {
    localStorage.setItem('typingTrainer_showMeters', show.toString());
  },
  getEyeTrackingScreenY() {
    const stored = localStorage.getItem('typingTrainer_eyeTrackingScreenY');
    return stored !== null ? parseFloat(stored) : 0.45;
  },
  setEyeTrackingScreenY(value) {
    localStorage.setItem('typingTrainer_eyeTrackingScreenY', value.toString());
  },
  getEyeTrackingKeyboardY() {
    const stored = localStorage.getItem('typingTrainer_eyeTrackingKeyboardY');
    return stored !== null ? parseFloat(stored) : 0.35;
  },
  setEyeTrackingKeyboardY(value) {
    localStorage.setItem('typingTrainer_eyeTrackingKeyboardY', value.toString());
  },
};
