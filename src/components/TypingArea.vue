<template>
  <div class="typing-area">
    <div class="text-display-wrapper">
      <div class="text-display" ref="textDisplayRef">
        <span
          v-for="(word, wordIndex) in words"
          :key="wordIndex"
          class="word"
        >
          <span
            v-for="(char, charIndex) in word.text"
            :key="charIndex"
            class="char"
            :class="{
              'char-space': char === ' ',
              correct: word.startIndex + charIndex < userInput.length && userInput[word.startIndex + charIndex] === char,
              incorrect: word.startIndex + charIndex < userInput.length && userInput[word.startIndex + charIndex] !== char,
              current: word.startIndex + charIndex === userInput.length,
              upcoming: word.startIndex + charIndex > userInput.length
            }"
          >
            {{ char === ' ' ? ' ' : char }}
          </span>
        </span>
      </div>
      
      <div class="input-with-slider">
        <input
          ref="inputRef"
          v-model="userInput"
          @input="handleInput"
          @keydown="handleKeyDown"
          @keyup="handleKeyUp"
          class="typing-input"
          :disabled="isPaused"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          tabindex="0"
        />
      </div>
      
      <EyeTrackingSlider
        :avg-y="eyeTrackingAvgY"
        :screen-y="eyeTrackingScreenY"
        :keyboard-y="eyeTrackingKeyboardY"
        :enabled="eyeTrackingEnabled"
        :ready="eyeTrackingReady"
      />
      
      <div v-if="isLoading" class="text-loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ t.loadingText || 'Loading text...' }}</div>
      </div>
    </div>
    
    <div v-if="showWarning" class="warning-indicator">
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">{{ warningMessage }}</span>
    </div>
    
    <div class="progress-bar" ref="progressBarRef">
      <div
        class="progress-fill"
        :style="{ width: `${progressPercent}%` }"
      ></div>
    </div>
    
    <div v-if="sourceUrl" class="text-source-container">
      <span class="text-source-label">Source:</span>
      <a 
        :href="sourceUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-source-link"
      >
        {{ sourceTitle || 'Source' }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import EyeTrackingSlider from './EyeTrackingSlider.vue';

const props = defineProps({
  targetText: {
    type: String,
    required: true,
  },
  sourceUrl: {
    type: String,
    default: null,
  },
  sourceTitle: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
  timeRemaining: {
    type: Number,
    default: 60,
  },
  language: {
    type: String,
    default: 'en',
  },
  t: {
    type: Object,
    default: () => ({}),
  },
  eyeTrackingAvgY: {
    type: Number,
    default: null,
  },
  eyeTrackingScreenY: {
    type: Number,
    default: null,
  },
  eyeTrackingKeyboardY: {
    type: Number,
    default: null,
  },
  eyeTrackingEnabled: {
    type: Boolean,
    default: false,
  },
  eyeTrackingReady: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['input', 'keydown', 'keyup', 'complete', 'update:activeKey', 'update:errorKey', 'update:expectedKey', 'update:mistakes', 'update:shiftPressed', 'update:combo']);

const userInput = ref('');
const inputRef = ref(null);
const textDisplayRef = ref(null);
const progressBarRef = ref(null);
const activeKey = ref('');
const errorKey = ref('');
const totalMistakes = ref(0);
const totalCharsTyped = ref(0);
const isShiftPressed = ref(false);
const capsLockOn = ref(false);
const layoutMismatch = ref(false);
const layoutMismatchCount = ref(0);
const currentCombo = ref(0);
const maxCombo = ref(0);
const keyboardLayoutMap = ref(null);

const words = computed(() => {
  if (!props.targetText) return [];
  const result = [];
  let startIndex = 0;
  const text = props.targetText;
  
  let currentWord = { text: '', startIndex: 0 };
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === '\n') {
      if (currentWord.text.length > 0) {
        result.push(currentWord);
      }
      result.push({ text: text[i], startIndex: i });
      currentWord = { text: '', startIndex: i + 1 };
    } else {
      if (currentWord.text.length === 0) {
        currentWord.startIndex = i;
      }
      currentWord.text += text[i];
    }
  }
  if (currentWord.text.length > 0) {
    result.push(currentWord);
  }
  return result;
});

const progressPercent = computed(() => {
  if (!props.targetText) return 0;
  return Math.min((userInput.value.length / props.targetText.length) * 100, 100);
});

const showWarning = computed(() => {
  return capsLockOn.value || layoutMismatch.value;
});

const warningMessage = computed(() => {
  if (capsLockOn.value && layoutMismatch.value) {
    return props.t.capsLockAndWrongLayout || 'Caps Lock ON & Wrong Layout';
  } else if (capsLockOn.value) {
    return props.t.capsLockOn || 'Caps Lock ON';
  } else if (layoutMismatch.value) {
    return props.t.wrongKeyboardLayout || 'Wrong Keyboard Layout';
  }
  return '';
});

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

watch(() => props.targetText, (newText) => {
  userInput.value = '';
  errorKey.value = '';
  totalMistakes.value = 0;
  totalCharsTyped.value = 0;
  layoutMismatch.value = false;
  layoutMismatchCount.value = 0;
  if (newText && newText.length > 0) {
    emit('update:expectedKey', newText[0]);
  }
  
  
  
  nextTick(() => {
    inputRef.value?.focus();
  });
}, { flush: 'post' });

let visibilityChangeHandler = null;
let resizeHandler = null;
let focusHandler = null;
let layoutCheckInterval = null;

const startLayoutCheckInterval = () => {
  if (layoutCheckInterval) {
    clearInterval(layoutCheckInterval);
  }
  
  if (layoutMismatch.value) {
    layoutCheckInterval = setInterval(() => {
      if (props.isActive && !props.isPaused && keyboardLayoutMap.value) {
        checkCurrentLayout();
      }
    }, 1000);
  }
};

onUnmounted(() => {
  if (layoutCheckInterval) {
    clearInterval(layoutCheckInterval);
  }
  if (focusHandler) {
    window.removeEventListener('focus', focusHandler);
  }
  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
  }
onMounted(async () => {
  visibilityChangeHandler = () => {
    if (!document.hidden) {
      nextTick(() => {
        if (textDisplayRef.value) {
          scrollToCurrent();
        }
        
        if (navigator.keyboard && navigator.keyboard.getLayoutMap && layoutMismatch.value) {
          navigator.keyboard.getLayoutMap().then(layoutMap => {
            keyboardLayoutMap.value = layoutMap;
            checkCurrentLayout(); 
          }).catch(() => {
            keyboardLayoutMap.value = null;
          });
        }
      });
    }
  };
  
  document.addEventListener('visibilitychange', visibilityChangeHandler);
  
  if (navigator.keyboard && navigator.keyboard.getLayoutMap) {
    try {
      const layoutMap = await navigator.keyboard.getLayoutMap();
      keyboardLayoutMap.value = layoutMap;
    } catch (error) {
      keyboardLayoutMap.value = null;
    }
  }
  
  nextTick(() => {
    if (progressBarRef.value) {
      const width = progressBarRef.value.offsetWidth;
      progressBarRef.value.style.setProperty('--progress-bar-width', `${width}px`);
    }
    inputRef.value?.focus();
  });
  
  resizeHandler = () => {
    if (progressBarRef.value) {
      const width = progressBarRef.value.offsetWidth;
      progressBarRef.value.style.setProperty('--progress-bar-width', `${width}px`);
    }
  };
  window.addEventListener('resize', resizeHandler);
  
  focusHandler = () => {
    if (navigator.keyboard && navigator.keyboard.getLayoutMap) {
      navigator.keyboard.getLayoutMap().then(layoutMap => {
        keyboardLayoutMap.value = layoutMap;
        
        if (layoutMismatch.value) {
          checkCurrentLayout();
        }
      }).catch(() => {
        keyboardLayoutMap.value = null;
      });
    }
  };
  window.addEventListener('focus', focusHandler);
  
  if (layoutMismatch.value) {
    startLayoutCheckInterval();
  }
  
  watch(layoutMismatch, (isMismatch) => {
    if (isMismatch) {
      startLayoutCheckInterval();
    } else {
      if (layoutCheckInterval) {
        clearInterval(layoutCheckInterval);
        layoutCheckInterval = null;
      }
    }
  });
});

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
});

async function refreshLayoutAndCheck() {
  
  
  if (navigator.keyboard && navigator.keyboard.getLayoutMap) {
    try {
      const layoutMap = await navigator.keyboard.getLayoutMap();
      keyboardLayoutMap.value = layoutMap;
      
      if (layoutMismatch.value) {
        checkCurrentLayout();
      }
    } catch (error) {
      keyboardLayoutMap.value = null;
      layoutMismatch.value = false;
      layoutMismatchCount.value = 0;
    }
  } else {
    keyboardLayoutMap.value = null;
    layoutMismatch.value = false;
    layoutMismatchCount.value = 0;
  }
}

function handleInput(event) {
  if (props.isPaused) {
    event.target.value = userInput.value;
    return;
  }
  
  if (event.target.value.length > props.targetText.length) {
    userInput.value = event.target.value.slice(0, props.targetText.length);
    return;
  }
  
  const previousLength = userInput.value.length;
  userInput.value = event.target.value;
  const newLength = userInput.value.length;
  
  
  
  
  emit('input', userInput.value);
  
  if (userInput.value.length === props.targetText.length) {
    emit('complete');
    return;
  }
  
  const nextIndex = userInput.value.length;
  if (nextIndex < props.targetText.length) {
    const expectedChar = props.targetText[nextIndex];
    emit('update:expectedKey', expectedChar);
  }
  
  nextTick(() => {
    scrollToCurrent();
  });
}

function checkCapsLock(event) {
  if (event.getModifierState) {
    capsLockOn.value = event.getModifierState('CapsLock');
  }
}

function checkCurrentLayout() {
  
  
  
  if (!keyboardLayoutMap.value) {
    layoutMismatch.value = false;
    layoutMismatchCount.value = 0;
    return;
  }
  
  
  const testKeys = [
    { code: 'KeyQ', en: 'q', uk: 'й' },
    { code: 'KeyW', en: 'w', uk: 'ц' },
    { code: 'KeyE', en: 'e', uk: 'у' },
    { code: 'KeyR', en: 'r', uk: 'к' },
    { code: 'KeyT', en: 't', uk: 'е' },
    { code: 'KeyY', en: 'y', uk: 'н' },
    { code: 'KeyU', en: 'u', uk: 'г' },
    { code: 'KeyI', en: 'i', uk: 'ш' },
    { code: 'KeyO', en: 'o', uk: 'щ' },
    { code: 'KeyP', en: 'p', uk: 'з' },
    { code: 'KeyA', en: 'a', uk: 'ф' },
    { code: 'KeyS', en: 's', uk: 'і' },
    { code: 'KeyD', en: 'd', uk: 'в' },
    { code: 'KeyF', en: 'f', uk: 'а' },
    { code: 'KeyG', en: 'g', uk: 'п' },
    { code: 'KeyH', en: 'h', uk: 'р' },
    { code: 'KeyJ', en: 'j', uk: 'о' },
    { code: 'KeyK', en: 'k', uk: 'л' },
    { code: 'KeyL', en: 'l', uk: 'д' },
    { code: 'KeyZ', en: 'z', uk: 'я' },
    { code: 'KeyX', en: 'x', uk: 'ч' },
    { code: 'KeyC', en: 'c', uk: 'с' },
    { code: 'KeyV', en: 'v', uk: 'м' },
    { code: 'KeyB', en: 'b', uk: 'и' },
    { code: 'KeyN', en: 'n', uk: 'т' },
    { code: 'KeyM', en: 'm', uk: 'ь' },
  ];
  
  let ukrainianMatches = 0;
  let englishMatches = 0;
  let totalChecked = 0;
  
  for (const testKey of testKeys) {
    try {
      const char = keyboardLayoutMap.value.get(testKey.code);
      if (char) {
        totalChecked++;
        const charLower = char.toLowerCase();
        if (charLower === testKey.uk.toLowerCase()) {
          ukrainianMatches++;
        }
        if (charLower === testKey.en.toLowerCase()) {
          englishMatches++;
        }
      }
    } catch (error) {
      
    }
  }
  
  
  if (totalChecked < 3) {
    
    layoutMismatch.value = false;
    layoutMismatchCount.value = 0;
    return;
  }
  
  
  
  if (props.language === 'en') {
    
    if (englishMatches >= ukrainianMatches) {
      layoutMismatch.value = false;
      layoutMismatchCount.value = 0;
    }
  } else if (props.language === 'uk') {
    
    if (ukrainianMatches >= englishMatches) {
      layoutMismatch.value = false;
      layoutMismatchCount.value = 0;
    }
  }
}

function checkLayoutMismatch(pressedChar, expectedChar, event) {
  if (!pressedChar || !expectedChar) return false;
  
  const pressedLower = pressedChar.toLowerCase();
  const expectedLower = expectedChar.toLowerCase();
  
  
  if (pressedLower === expectedLower) return false;
  
  
  if (keyboardLayoutMap.value && event && event.code) {
    try {
      
      const pressedKeyChar = keyboardLayoutMap.value.get(event.code);
      
      if (pressedKeyChar) {
        const pressedKeyCharLower = pressedKeyChar.toLowerCase();
        
        
        
        if (props.language === 'en') {
          
          const ukrainianToEnglish = getUkrainianToEnglishMap();
          if (ukrainianToEnglish[pressedKeyCharLower] === expectedLower) {
            return true;
          }
        } else if (props.language === 'uk') {
          
          const englishToUkrainian = getEnglishToUkrainianMap();
          if (englishToUkrainian[pressedKeyCharLower] === expectedLower) {
            return true;
          }
        }
      }
    } catch (error) {
      
    }
  }
  
  
  return checkLayoutMismatchManual(pressedChar, expectedChar);
}

function getUkrainianToEnglishMap() {
  return {
    'ф': 'a', 'і': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'є': '\'',
    'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p',
    'х': '[', 'ї': ']', '\\': '\\',
    'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.'
  };
}

function getEnglishToUkrainianMap() {
  const ukrainianToEnglish = getUkrainianToEnglishMap();
  return Object.fromEntries(
    Object.entries(ukrainianToEnglish).map(([uk, en]) => [en, uk])
  );
}

function checkLayoutMismatchManual(pressedChar, expectedChar) {
  const pressedLower = pressedChar.toLowerCase();
  const expectedLower = expectedChar.toLowerCase();
  
  const ukrainianToEnglish = getUkrainianToEnglishMap();
  const englishToUkrainian = getEnglishToUkrainianMap();
  
  
  if (props.language === 'en') {
    
    if (ukrainianToEnglish[pressedLower] === expectedLower) {
      return true;
    }
  } else if (props.language === 'uk') {
    
    if (englishToUkrainian[pressedLower] === expectedLower) {
      return true;
    }
  }
  
  return false;
}

function handleKeyDown(event) {
  if (props.isPaused) {
    event.preventDefault();
    return;
  }
  
  checkCapsLock(event);
  
  if (event.key === 'Shift' || event.key === 'ShiftLeft' || event.key === 'ShiftRight') {
    isShiftPressed.value = true;
    emit('update:shiftPressed', true);
    return;
  }
  
  const key = event.key.toLowerCase();
  activeKey.value = key;
  
  if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    totalCharsTyped.value++;
    
    const currentIndex = userInput.value.length;
    if (currentIndex >= 0 && currentIndex < props.targetText.length) {
      const expectedChar = props.targetText[currentIndex];
      const pressedChar = event.key;
      
      
      
      
      if (pressedChar !== expectedChar) {
        const isLayoutMismatch = checkLayoutMismatch(pressedChar, expectedChar, event);
        if (isLayoutMismatch) {
          layoutMismatchCount.value++;
          layoutMismatch.value = true;
        }
      } else {
        
        
        layoutMismatch.value = false;
        layoutMismatchCount.value = 0;
      }
      
      if (pressedChar !== expectedChar) {
        totalMistakes.value++;
        currentCombo.value = 0; 
        emit('update:combo', { current: 0, max: maxCombo.value });
        errorKey.value = pressedChar.toLowerCase();
        emit('update:errorKey', errorKey.value);
        setTimeout(() => {
          errorKey.value = '';
          emit('update:errorKey', '');
        }, 300);
      } else {
        
        currentCombo.value++;
        if (currentCombo.value > maxCombo.value) {
          maxCombo.value = currentCombo.value;
        }
        emit('update:combo', { current: currentCombo.value, max: maxCombo.value });
      }
    }
  }
  
  emit('update:activeKey', key);
  emit('keydown', { key, event });
  
  emit('update:mistakes', { totalMistakes: totalMistakes.value, totalCharsTyped: totalCharsTyped.value });
}

function handleKeyUp(event) {
  checkCapsLock(event); 
  
  if (event.key === 'Shift' || event.key === 'ShiftLeft' || event.key === 'ShiftRight') {
    isShiftPressed.value = false;
    emit('update:shiftPressed', false);
    return;
  }
  
  activeKey.value = '';
  emit('update:activeKey', '');
  
  const nextIndex = userInput.value.length;
  if (nextIndex < props.targetText.length) {
    const expectedChar = props.targetText[nextIndex];
    emit('update:expectedKey', expectedChar);
  }
  
  emit('keyup', { key: event.key.toLowerCase(), event });
}

function scrollToCurrent() {
  if (!textDisplayRef.value) return;
  
  const currentChar = textDisplayRef.value.querySelector('.char.current');
  if (currentChar) {
    currentChar.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}


defineExpose({
  activeKey,
  errorKey,
  reset: () => {
    userInput.value = '';
    errorKey.value = '';
    activeKey.value = '';
    totalMistakes.value = 0;
    totalCharsTyped.value = 0;
    isShiftPressed.value = false;
    currentCombo.value = 0;
    maxCombo.value = 0;
    capsLockOn.value = false;
    layoutMismatch.value = false;
    layoutMismatchCount.value = 0;
  },
  getMistakes: () => ({
    totalMistakes: totalMistakes.value,
    totalCharsTyped: totalCharsTyped.value,
  }),
  getCombo: () => ({
    current: currentCombo.value,
    max: maxCombo.value,
  }),
});
</script>

<style scoped>
.typing-area {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.text-display-wrapper {
  position: relative;
  margin-bottom: 1rem;
  flex: 1;
  min-height: 0;
  overflow: visible;
}

.text-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--text-bg, #1e1e1e);
  border: 2px solid var(--text-border, #333);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 999;
  padding: 1.5rem;
  box-sizing: border-box;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(78, 205, 196, 0.2);
  border-top-color: var(--accent-color, #4ecdc4);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--text-color, #fff);
  font-size: 1rem;
  opacity: 0.9;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text-display {
  background: var(--text-bg, #1e1e1e);
  border: 2px solid var(--text-border, #333);
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 180px;
  max-height: 220px;
  font-size: 1.25rem;
  line-height: 1.8;
  font-family: 'Courier New', monospace;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  text-align: left;
  display: block;
}

.word {
  display: inline-block;
  white-space: nowrap;
}

.word-space {
  display: inline;
  white-space: normal;
}

.char {
  display: inline;
  transition: background-color 0.1s ease, color 0.1s ease;
  box-sizing: border-box;
  position: relative;
}

.char.char-space {
  display: inline-block;
  min-width: 0.5em;
  position: relative;
}

.char.char-space::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-80%);
  height: 1em;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 2px;
}

.char.char-space.correct::after {
  background: rgba(78, 205, 196, 0.05);
}

.char.char-space.incorrect::after {
  background: rgba(255, 107, 107, 0.05);
}

.char.char-space.current::after {
  background: rgba(78, 205, 196, 0.2);
}

.char.correct {
  color: #4ecdc4;
  background: rgba(78, 205, 196, 0.1);
}

.char.incorrect {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.2);
  text-decoration: underline;
}

.char.current {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: -3px 0 0 0 #4ecdc4;
  animation: blink 1s infinite;
}

.char.upcoming {
  color: #666;
}

@keyframes blink {
  0%, 50% { box-shadow: -3px 0 0 0 #4ecdc4; }
  51%, 100% { box-shadow: -3px 0 0 0 transparent; }
}

.input-with-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: visible;
}

.typing-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  padding-right: 4rem;
  font-size: 1.25rem;
  line-height: 1.8;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font-family: 'Courier New', monospace;
  outline: none;
  z-index: 10;
  resize: none;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: break-word;
}


.typing-input:focus {
  border-color: #4ecdc4;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--progress-bg, #333);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
  position: relative;
}


.text-source-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.7rem;
  align-self: flex-start;
  position: relative;
  z-index: 100;
  pointer-events: auto;
}

.text-source-label {
  color: var(--text-secondary, #aaa);
  opacity: 0.6;
  pointer-events: none;
}

.text-source-link {
  color: var(--text-secondary, #aaa);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.2s, color 0.2s;
  cursor: pointer;
  position: relative;
  z-index: 100;
  pointer-events: auto;
  user-select: none;
}

.text-source-link:hover {
  opacity: 1;
  color: var(--accent-color, #4ecdc4);
  text-decoration: underline;
}

.text-source-link:active {
  opacity: 0.8;
}

.warning-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.5);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #ffc107;
  animation: warningPulse 2s ease-in-out infinite;
}

.warning-icon {
  font-size: 1rem;
}

.warning-text {
  font-weight: 500;
}

@keyframes warningPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 0 4px rgba(255, 193, 7, 0);
  }
}

.progress-bar {
  --progress-bar-width: 100%;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #ff006e 0%,
    #fb5607 12.5%,
    #ffbe0b 25%,
    #83d475 37.5%,
    #06ffa5 50%,
    #118ab2 62.5%,
    #073b4c 75%,
    #7209b7 87.5%,
    #b5179e 100%
  );
  background-size: 300px 100%;
  background-position: 0 0;
  background-repeat: repeat-x;
  transition: width 0.2s ease;
  border-radius: 3px;
  position: relative;
  box-shadow: 
    0 0 8px rgba(78, 205, 196, 0.6),
    0 0 16px rgba(78, 205, 196, 0.4),
    inset 0 0 8px rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  border-radius: 3px;
  animation: progressShine 2s ease-in-out infinite;
}

@keyframes progressShine {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .text-display {
    font-size: 1.1rem;
    padding: 1rem;
    min-height: 120px;
    max-height: 150px;
    line-height: 1.6;
  }
  
  .timer {
    font-size: 1.5rem;
  }
  
  .key {
    min-width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>
