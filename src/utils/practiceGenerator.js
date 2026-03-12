import { keySequences, textSamples } from '../data/practiceData.js';
import { getRandomText } from './textApi.js';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const rowChars = {
  en: {
    homeRow: 'asdfghjkl;',
    topRow: 'qwertyuiop',
    bottomRow: 'zxcvbnm,.'
  },
  uk: {
    homeRow: 'фівапролджє',
    topRow: 'йцукенгшщзхї',
    bottomRow: 'ячсмитьбю.'
  }
};

function generateTextFromRows(language, selectedRows) {
  let allowedChars = '';
  selectedRows.forEach(row => {
    if (rowChars[language] && rowChars[language][row]) {
      allowedChars += rowChars[language][row];
    }
  });
  
  if (!allowedChars) return null;
  
  const dictionary = new Set();
  const data = keySequences[language];
  if (data) {
    ['easy', 'medium'].forEach(diff => {
      if (data[diff]) {
        Object.values(data[diff]).forEach(categoryArray => {
          if (Array.isArray(categoryArray)) {
            categoryArray.forEach(sentence => {
              const words = sentence.split(/\s+/);
              words.forEach(w => {
                const cleanWord = w.toLowerCase().replace(/[.,;:!?()]/g, '');
                if (cleanWord.length > 0) {
                  dictionary.add(cleanWord);
                }
              });
            });
          }
        });
      }
    });
  }
  
  if (dictionary.size === 0) {
    if (language === 'en') {
      ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'].forEach(w => dictionary.add(w));
    } else if (language === 'uk') {
      ['і', 'в', 'не', 'на', 'що', 'з', 'а', 'та', 'як', 'це', 'до', 'він', 'для', 'я', 'про', 'від', 'його', 'вона', 'вони', 'ми', 'але', 'було', 'тільки', 'щоб', 'бути', 'її', 'їх', 'коли', 'може', 'вже', 'там', 'був', 'якщо', 'чи', 'який', 'дуже', 'через', 'навіть', 'ще', 'всі', 'йому', 'без', 'свій', 'ні', 'під', 'після', 'то', 'буде', 'тоді', 'мене'].forEach(w => dictionary.add(w));
    }
  }
  
  const validWords = Array.from(dictionary).filter(word => {
    for (let i = 0; i < word.length; i++) {
      if (!allowedChars.includes(word[i])) return false;
    }
    return true;
  });
  
  if (validWords.length === 0) return null;
  
  const rowSets = selectedRows.map(row => new Set(rowChars[language][row].split('')));
  
  const scoredWords = validWords.map(word => {
    let rowsUsed = 0;
    rowSets.forEach(rowSet => {
      for (let i = 0; i < word.length; i++) {
        if (rowSet.has(word[i])) {
          rowsUsed++;
          break;
        }
      }
    });
    return { word, rowsUsed };
  });
  
  let preferredWords = scoredWords.filter(w => w.rowsUsed > 1).map(w => w.word);
  if (preferredWords.length < 5) {
    preferredWords = validWords;
  }
  
  const sequenceLength = 20;
  const selectedWords = [];
  for (let i = 0; i < sequenceLength; i++) {
    const wordList = (Math.random() < 0.7 && preferredWords.length > 0) ? preferredWords : validWords;
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    selectedWords.push(randomWord);
  }
  
  return selectedWords.join(' ');
}

export async function getPracticeText(language, mode, difficulty = 'easy', category = null, enabledCategories = null) {
  if (mode === 'sequences') {
    const difficultyData = keySequences[language]?.[difficulty] || keySequences.en?.[difficulty] || {};
    
    let allSequences = [];
    
    if (category && difficultyData[category]) {
      allSequences = difficultyData[category];
    } else {
      const categoriesToUse = enabledCategories && enabledCategories.length > 0 
        ? enabledCategories.filter(cat => difficultyData[cat])
        : Object.keys(difficultyData);
      
      categoriesToUse.forEach(cat => {
        if (Array.isArray(difficultyData[cat])) {
          allSequences.push(...difficultyData[cat]);
        }
      });
    }
    
    if (allSequences.length === 0) {
      const fallbackData = keySequences[language]?.easy || keySequences.en?.easy || {};
      Object.values(fallbackData).forEach(categorySequences => {
        if (Array.isArray(categorySequences)) {
          allSequences.push(...categorySequences);
        }
      });
    }
    
    if (allSequences.length > 0 && !category && enabledCategories && enabledCategories.length > 0) {
      const availableCategories = enabledCategories.filter(cat => 
        difficultyData[cat] && Array.isArray(difficultyData[cat]) && difficultyData[cat].length > 0
      );
      
      const rowCategories = ['homeRow', 'topRow', 'bottomRow'];
      const selectedRows = enabledCategories.filter(cat => rowCategories.includes(cat));
      
      let pool = [...availableCategories];
      if (selectedRows.length > 1) {
        pool = pool.filter(cat => !rowCategories.includes(cat));
        pool.push('combinedRows');
      }
      
      if (pool.length > 0) {
        const randomCategory = pool[Math.floor(Math.random() * pool.length)];
        
        if (randomCategory === 'combinedRows') {
          const combinedText = generateTextFromRows(language, selectedRows);
          if (combinedText) {
            return { text: combinedText, sourceUrl: null, sourceTitle: null };
          }
          // Fallback if generation fails
          allSequences = difficultyData[selectedRows[Math.floor(Math.random() * selectedRows.length)]];
        } else {
          allSequences = difficultyData[randomCategory];
        }
      }
    }
    
    const shuffled = shuffleArray(allSequences);
    const selectedText = shuffled[0] || '';
    return { text: selectedText, sourceUrl: null, sourceTitle: null };
  } else {
    try {
      const apiResult = await getRandomText(language, difficulty);
      if (apiResult && apiResult.text && apiResult.text.length >= 50) {
        
        return { text: apiResult.text, sourceUrl: apiResult.sourceUrl || null, sourceTitle: apiResult.sourceTitle || null };
      }
    } catch (error) {
      console.warn('Failed to fetch from API, using fallback:', error);
    }
    
    const difficultyTexts = textSamples[language]?.[difficulty] || textSamples.en?.[difficulty] || [];
    
    if (difficultyTexts.length === 0) {
      
      const allTexts = textSamples[language]?.easy || textSamples.en?.easy || [];
      if (allTexts.length > 0) {
        const shuffled = shuffleArray(allTexts);
        const selectedText = shuffled[0] || '';
        return { text: selectedText, sourceUrl: null, sourceTitle: null };
      }
      return { text: 'No practice text available', sourceUrl: null, sourceTitle: null };
    }
    
    
    const shuffled = shuffleArray(difficultyTexts);
    const selectedText = shuffled[0];
    
    return { text: selectedText, sourceUrl: null, sourceTitle: null };
  }
}

export function calculateStats(input, target, timeSeconds, totalMistakesCount = 0, totalCharsTypedCount = 0, comboMultiplier = 1.0) {
  const correctChars = input.split('').filter((char, i) => char === target[i]).length;
  const finalMistakes = input.length - correctChars;
  
  const mistakes = totalMistakesCount > 0 ? totalMistakesCount : finalMistakes;
  
  const totalChars = totalCharsTypedCount > 0 ? totalCharsTypedCount : input.length;
  const correctCharsTotal = totalChars - mistakes;
  const accuracy = totalChars > 0 ? (correctCharsTotal / totalChars) * 100 : 0;
  
  const baseCpm = timeSeconds > 0 ? Math.round((correctChars / timeSeconds) * 60) : 0;
  const cpm = Math.round(baseCpm * comboMultiplier);
  
  const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
  const baseWpm = timeSeconds > 0 ? Math.round((words / timeSeconds) * 60) : 0;
  const wpm = Math.round(baseWpm * comboMultiplier);
  
  
  return {
    cpm,
    wpm,
    baseCpm,
    baseWpm,
    accuracy: Math.round(accuracy * 100) / 100,
    mistakes: finalMistakes, 
    totalMistakes: mistakes, 
    correctChars,
    totalChars: input.length, 
    totalCharsTyped: totalChars,
    comboMultiplier,
  };
}

export function shouldIncreaseDifficulty(stats, currentDifficulty) {
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  if (currentIndex === difficulties.length - 1) return false;
  
  
  return stats.accuracy >= 95 && stats.wpm >= (currentDifficulty === 'easy' ? 30 : currentDifficulty === 'medium' ? 50 : 70);
}

export function getAvailableCategories(language, difficulty) {
  const difficultyData = keySequences[language]?.[difficulty] || keySequences.en?.[difficulty] || {};
  return Object.keys(difficultyData);
}
