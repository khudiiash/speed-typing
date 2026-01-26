import { textSamples } from '../data/practiceData.js';


const textCache = {
  en: [],
  uk: []
};


function isOnline() {
  return navigator.onLine;
}


function getAllowedCharacters(language) {
  
  const common = ' \n\t';
  
  if (language === 'uk') {
    
    
    const ukLetters = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюяАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';
    const enLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const ukSymbols = "'!№;%:?*()_-=+\\/.,\"";
    return common + ukLetters + enLetters + numbers + ukSymbols;
  } else {
    
    const enLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const enSymbols = '`~!@#$%^&*()_+-=[]{}|\\;\':",.<>?/';
    return common + enLetters + numbers + enSymbols;
  }
}


function normalizeAccentedChar(char) {
  
  const accentMap = {
    
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ā': 'a', 'ă': 'a', 'ą': 'a',
    'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Ā': 'A', 'Ă': 'A', 'Ą': 'A',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ė': 'e', 'ę': 'e', 'ě': 'e',
    'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E', 'Ē': 'E', 'Ė': 'E', 'Ę': 'E', 'Ě': 'E',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i', 'ī': 'i', 'į': 'i', 'ı': 'i',
    'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I', 'Ī': 'I', 'Į': 'I',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ō': 'o', 'ő': 'o', 'ø': 'o',
    'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ō': 'O', 'Ő': 'O', 'Ø': 'O',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u', 'ū': 'u', 'ů': 'u', 'ű': 'u',
    'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U', 'Ū': 'U', 'Ů': 'U', 'Ű': 'U',
    'ý': 'y', 'ÿ': 'y', 'ỳ': 'y', 'ŷ': 'y',
    'Ý': 'Y', 'Ÿ': 'Y', 'Ỳ': 'Y', 'Ŷ': 'Y',
    'ñ': 'n', 'ń': 'n', 'ň': 'n',
    'Ñ': 'N', 'Ń': 'N', 'Ň': 'N',
    'ç': 'c', 'ć': 'c', 'č': 'c', 'ĉ': 'c', 'ċ': 'c',
    'Ç': 'C', 'Ć': 'C', 'Č': 'C', 'Ĉ': 'C', 'Ċ': 'C',
    'ş': 's', 'ś': 's', 'š': 's', 'ș': 's', 'ş': 's',
    'Ş': 'S', 'Ś': 'S', 'Š': 'S', 'Ș': 'S',
    'ž': 'z', 'ź': 'z', 'ż': 'z',
    'Ž': 'Z', 'Ź': 'Z', 'Ż': 'Z',
    'ğ': 'g', 'ĝ': 'g', 'ġ': 'g',
    'Ğ': 'G', 'Ĝ': 'G', 'Ġ': 'G',
    'ř': 'r', 'ŕ': 'r',
    'Ř': 'R', 'Ŕ': 'R',
    'ł': 'l', 'ľ': 'l', 'ļ': 'l',
    'Ł': 'L', 'Ľ': 'L', 'Ļ': 'L',
    'đ': 'd', 'ď': 'd',
    'Đ': 'D', 'Ď': 'D',
    'þ': 'th', 'Þ': 'TH',
    'æ': 'ae', 'Æ': 'AE',
    'œ': 'oe', 'Œ': 'OE',
    'ß': 'ss',
  };
  
  
  if (accentMap[char]) {
    return accentMap[char];
  }
  
  
  
  try {
    const normalized = char.normalize('NFD');
    
    const base = normalized.replace(/[\u0300-\u036f]/g, '');
    
    if (base && base.length > 0 && base !== char) {
      return base;
    }
  } catch (e) {
    
  }
  
  return char;
}


function cleanText(text, language = 'en') {
  if (!text) return '';
  
  
  const allowedChars = getAllowedCharacters(language);
  const allowedSet = new Set(allowedChars);
  
  
  let cleaned = text
    .replace(/<[^>]*>/g, '') 
    .replace(/\[.*?\]/g, '') 
    .replace(/\*\*.*?\*\*/g, '') 
    .replace(/\*.*?\*/g, '') 
    .replace(/#{1,6}\s/g, '') 
    .replace(/```[\s\S]*?```/g, '') 
    .replace(/`.*?`/g, '') 
    
    
    
    .replace(/\s+—\s+/g, ' - ')  
    .replace(/\s+—/g, ' -')      
    .replace(/—\s+/g, '- ')       
    .replace(/—/g, '-')           
    .replace(/\s+–\s+/g, ' - ')  
    .replace(/\s+–/g, ' -')
    .replace(/–\s+/g, '- ')
    .replace(/–/g, '-')
    .replace(/\s+‒\s+/g, ' - ')  
    .replace(/\s+‒/g, ' -')
    .replace(/‒\s+/g, '- ')
    .replace(/‒/g, '-')
    .replace(/\s+―\s+/g, ' - ')  
    .replace(/\s+―/g, ' -')
    .replace(/―\s+/g, '- ')
    .replace(/―/g, '-')
    .replace(/\s+−\s+/g, ' - ')  
    .replace(/\s+−/g, ' -')
    .replace(/−\s+/g, '- ')
    .replace(/−/g, '-')
    
    .replace(/[""]/g, '"') 
    .replace(/['']/g, "'") 
    .replace(/«/g, '"')
    .replace(/»/g, '"')
    
    .replace(/[\u2000-\u200B\u202F\u205F]/g, ' '); 
  
  
  cleaned = cleaned
    .split('')
    .map(char => {
      
      if (char === ' ' || char === '\n' || char === '\t') {
        return char;
      }
      
      
      if (allowedSet.has(char)) {
        return char;
      }
      
      
      const normalized = normalizeAccentedChar(char);
      
      
      if (normalized.length > 1) {
        
        return normalized
          .split('')
          .filter(c => allowedSet.has(c))
          .join('');
      }
      
      
      if (allowedSet.has(normalized)) {
        return normalized;
      }
      
      
      return '';
    })
    .join('')
    .replace(/\n{3,}/g, '\n\n') 
    .replace(/[ \t]+/g, ' ') 
    .replace(/\n /g, '\n') 
    .replace(/ \n/g, '\n') 
    .trim();
  
  
  if (cleaned.length < 50) {
    return '';
  }
  
  return cleaned;
}


function createTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}


async function fetchEnglishText() {
  try {
    
    const cacheBuster = `_=${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    
    const randomResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/random/summary?${cacheBuster}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'reload',
        mode: 'cors',
        credentials: 'omit',
        signal: createTimeoutSignal(5000)
      }
    );
    
    if (!randomResponse.ok) {
      throw new Error(`HTTP error! status: ${randomResponse.status}`);
    }
    
    const pageData = await randomResponse.json();
    
    if (pageData.extract) {
      let text = cleanText(pageData.extract, 'en');
      const pageTitle = pageData.title;
      const sourceUrl = pageTitle ? `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}` : 'https://en.wikipedia.org';
      const sourceTitle = pageTitle || 'Wikipedia';
      
      
      if (text.length < 100 && pageTitle) {
        
        try {
          const cacheBuster2 = `_=${Date.now()}-${Math.random().toString(36).substring(7)}`;
          const contentResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(pageTitle)}?${cacheBuster2}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'text/html',
              },
              cache: 'reload',
              mode: 'cors',
              credentials: 'omit',
              signal: createTimeoutSignal(5000)
            }
          );
          
          if (contentResponse.ok) {
            const html = await contentResponse.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const paragraphs = doc.querySelectorAll('p');
            let fullText = Array.from(paragraphs)
              .map(p => p.textContent)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (fullText.length > text.length) {
              text = cleanText(fullText, 'en');
            }
          }
        } catch (e) {
          
        }
      }
      
      return { text, sourceUrl, sourceTitle };
    }
    
    throw new Error('No extract in response');
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Request timeout');
    }
    
    console.warn('Failed to fetch English text from Wikipedia:', error);
    throw error;
  }
}


async function fetchUkrainianText() {
  try {
    
    
    const cacheBuster = `_=${Date.now()}`;
    const randomResponse = await fetch(
      `https://uk.wikipedia.org/api/rest_v1/page/random/summary?${cacheBuster}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'reload',
        mode: 'cors',
        credentials: 'omit',
        signal: createTimeoutSignal(5000)
      }
    );
    
    if (!randomResponse.ok) {
      throw new Error(`HTTP error! status: ${randomResponse.status}`);
    }
    
    const pageData = await randomResponse.json();
    
    if (pageData.extract) {
      let text = cleanText(pageData.extract, 'uk');
      const pageTitle = pageData.title;
      const sourceUrl = pageTitle ? `https://uk.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}` : 'https://uk.wikipedia.org';
      const sourceTitle = pageTitle || 'Wikipedia';
      
      
      if (text.length < 100 && pageTitle) {
        
        try {
          
          const cacheBuster = `_=${Date.now()}`;
          const contentResponse = await fetch(
            `https://uk.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(pageTitle)}?${cacheBuster}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'text/html',
              },
              cache: 'reload',
              mode: 'cors',
              credentials: 'omit',
              signal: createTimeoutSignal(5000)
            }
          );
          
          if (contentResponse.ok) {
            const html = await contentResponse.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const paragraphs = doc.querySelectorAll('p');
            let fullText = Array.from(paragraphs)
              .map(p => p.textContent)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (fullText.length > text.length) {
              text = cleanText(fullText, 'uk');
            }
          }
        } catch (e) {
          
        }
      }
      
      return { text, sourceUrl, sourceTitle };
    }
    
    throw new Error('No extract in response');
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export async function getRandomText(language, difficulty = 'medium') {
  if (!isOnline()) {
    
    if (textCache[language] && textCache[language].length > 0) {
      const cached = textCache[language][Math.floor(Math.random() * textCache[language].length)];
      if (cached && cached.text) {
        return cached;
      }
    }
    return getFallbackText(language, difficulty);
  }
  
  try {
    let result = null;
    
    if (language === 'en') {
      result = await fetchEnglishText();
    } else if (language === 'uk') {
      result = await fetchUkrainianText();
    }
    
    
    if (result && result.text && result.text.length >= 50) {
      
      if (!textCache[language]) {
        textCache[language] = [];
      }
      textCache[language].push(result);
      
      if (textCache[language].length > 10) {
        textCache[language].shift();
      }
      
      return result;
    }
    
    
    return getFallbackText(language, difficulty);
  } catch (error) {
    console.warn('Failed to fetch text from API:', error);
    
    return getFallbackText(language, difficulty);
  }
}


function getFallbackText(language, difficulty) {
  const difficultyTexts = textSamples[language]?.[difficulty] || textSamples.en?.[difficulty] || [];
  
  if (difficultyTexts.length === 0) {
    
    const allTexts = textSamples[language]?.easy || 
                    textSamples[language]?.medium || 
                    textSamples[language]?.hard ||
                    textSamples.en?.easy || 
                    [];
    
    if (allTexts.length > 0) {
      const shuffled = [...allTexts].sort(() => Math.random() - 0.5);
      const count = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));
      return { text: selected.join(' '), sourceUrl: null, sourceTitle: null };
    }
    
    return { text: 'No practice text available', sourceUrl: null, sourceTitle: null };
  }
  
  
  const shuffled = [...difficultyTexts].sort(() => Math.random() - 0.5);
  const selectedText = shuffled[0];
  
  
  if (selectedText.length < 300) {
    const count = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    return { text: selected.join(' '), sourceUrl: null, sourceTitle: null };
  }
  
  return { text: selectedText, sourceUrl: null, sourceTitle: null };
}


export async function checkApiAvailability(language) {
  if (!isOnline()) {
    return false;
  }
  
  try {
    if (language === 'en') {
      const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary', {
        method: 'HEAD',
        signal: createTimeoutSignal(2000)
      });
      return response.ok;
    } else if (language === 'uk') {
      const response = await fetch('https://uk.wikipedia.org/api/rest_v1/page/random/summary', {
        method: 'HEAD',
        signal: createTimeoutSignal(2000)
      });
      return response.ok;
    } else if (language === 'en') {
      const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary', {
        method: 'HEAD',
        signal: createTimeoutSignal(2000)
      });
      return response.ok;
    }
    return false;
  } catch (error) {
    return false;
  }
}
