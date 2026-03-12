import { textSamples } from '../data/practiceData.js';

export async function getRandomText(language, difficulty = 'medium') {
  return getFallbackText(language, difficulty);
}

function getFallbackText(language, difficulty) {
  const difficultyTexts = textSamples[language]?.[difficulty] || textSamples.en?.[difficulty] || [];
  
  if (difficultyTexts.length === 0) {
    return { text: 'No practice text available', sourceUrl: null, sourceTitle: null };
  }
  
  const shuffled = [...difficultyTexts].sort(() => Math.random() - 0.5);
  const selectedText = shuffled[0];
  
  return { text: selectedText, sourceUrl: null, sourceTitle: null };
}

export async function checkApiAvailability(language) {
  return true; // We now use local texts exclusively
}
