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
      
      if (availableCategories.length > 0) {
        const randomCategory = availableCategories[
          Math.floor(Math.random() * availableCategories.length)
        ];
        allSequences = difficultyData[randomCategory];
      }
    }
    
    const shuffled = shuffleArray(allSequences);
    const count = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    return { text: selected.join(' '), sourceUrl: null, sourceTitle: null };
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
        const count = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        return { text: selected.join(' '), sourceUrl: null, sourceTitle: null };
      }
      return { text: 'No practice text available', sourceUrl: null, sourceTitle: null };
    }
    
    
    const shuffled = shuffleArray(difficultyTexts);
    const selectedText = shuffled[0];
    
    
    if (selectedText.length < 300) {
      const count = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));
      return { text: selected.join(' '), sourceUrl: null, sourceTitle: null };
    }
    
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
