<template>
  <div class="typing-area">
    <div class="text-display-wrapper">
      <div class="text-display" ref="textDisplayRef">
        <span
          v-for="(word, wordIndex) in words"
          :key="wordIndex"
          :class="word.isSpace ? 'word-space' : 'word'"
        >
          <span
            v-for="(char, charIndex) in word.text"
            :key="charIndex"
            class="char"
            :class="{
              'char-space': char === ' ' || char === '\n',
              'char-newline': char === '\n',
              correct: word.startIndex + charIndex < userInput.length && userInput[word.startIndex + charIndex] === char,
              incorrect: word.startIndex + charIndex < userInput.length && userInput[word.startIndex + charIndex] !== char,
              current: word.startIndex + charIndex === userInput.length,
              'error-pulse': word.startIndex + charIndex === userInput.length && hasErrorFlash,
              upcoming: word.startIndex + charIndex > userInput.length
            }"
          ><template v-if="char === '\n'">↵</template><template v-else>{{ char === ' ' ? ' ' : char }}</template></span>
        </span>
      </div>
      
      <div class="input-with-slider">
        <textarea
          ref="inputRef"
          :value="userInput"
          @input="handleInput"
          @keydown="handleKeyDown"
          @keyup="handleKeyUp"
          @click="forceCursorToEnd"
          @focus="forceCursorToEnd"
          @select="forceCursorToEnd"
          class="typing-input"
          :disabled="isPaused"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          tabindex="0"
        ></textarea>
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
    <div v-if="showWarning" class="warning-indicator">
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">{{ warningMessage }}</span>
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
const hasErrorFlash = ref(false);
const totalMistakes = ref(0);
const totalCharsTyped = ref(0);
const isShiftPressed = ref(false);
const capsLockOn = ref(false);
const layoutMismatch = ref(false);
const layoutMismatchCount = ref(0);
const currentCombo = ref(0);
const maxCombo = ref(0);
const keyboardLayoutMap = ref(null);
let scrollTimeout = null;
let lastScrollTime = 0;
let isScrolling = false;
  const SCROLL_THROTTLE_MS = 50;

const words = computed(() => {
  if (!props.targetText) return [];
  const result = [];
  const text = props.targetText;
  
  let currentWord = { text: '', startIndex: 0, isSpace: false };
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      if (currentWord.text.length > 0) {
        result.push(currentWord);
      }
      result.push({ text: text[i], startIndex: i, isSpace: true });
      currentWord = { text: '', startIndex: i + 1, isSpace: false };
    } else if (text[i] === '\n') {
      if (currentWord.text.length > 0) {
        result.push(currentWord);
      }
      result.push({ text: text[i], startIndex: i, isSpace: true });
      currentWord = { text: '', startIndex: i + 1, isSpace: false };
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
    scrollToCurrent();
  });
}, { flush: 'post' });

watch(() => userInput.value.length, () => {
  if (props.isActive && !props.isPaused) {
    nextTick(() => {
      scrollToCurrent();
    });
  }
});

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
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
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
  
  const newValue = event.target.value;
  let isValid = true;
  
  // Do not allow deleting correct characters
  if (newValue.length < userInput.value.length) {
    isValid = false;
  } else {
    // Ensure the new input perfectly matches the target text prefix
    for (let i = 0; i < newValue.length; i++) {
      if (i >= props.targetText.length || newValue[i] !== props.targetText[i]) {
        isValid = false;
        break;
      }
    }
  }
  
  if (!isValid) {
    // Restore the input value to the last known good userInput
    event.target.value = userInput.value;
    
    // If length increased, it means they typed a wrong character that bypassed keydown
    if (newValue.length > userInput.value.length) {
      totalCharsTyped.value++;
      totalMistakes.value++;
      currentCombo.value = 0;
      emit('update:combo', { current: 0, max: maxCombo.value });
      emit('update:mistakes', { totalMistakes: totalMistakes.value, totalCharsTyped: totalCharsTyped.value });
      
      const wrongChar = newValue[userInput.value.length];
      if (wrongChar) {
        errorKey.value = wrongChar.toLowerCase();
        hasErrorFlash.value = true;
        emit('update:errorKey', errorKey.value);
        setTimeout(() => {
          errorKey.value = '';
          hasErrorFlash.value = false;
          emit('update:errorKey', '');
        }, 300);
      }
    }
    
    forceCursorToEnd();
    return;
  }
  
  let finalValue = newValue;
  
  // Auto-fill indentation if the last typed character was a newline
  if (finalValue.length > userInput.value.length && finalValue[finalValue.length - 1] === '\n') {
    let nextIndex = finalValue.length;
    while (nextIndex < props.targetText.length && props.targetText[nextIndex] === ' ') {
      finalValue += ' ';
      nextIndex++;
    }
  }

  userInput.value = finalValue;
  
  if (event.target.value !== finalValue) {
    event.target.value = finalValue;
    nextTick(() => {
      forceCursorToEnd();
    });
  }
  
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
  
  const now = Date.now();
  if (now - lastScrollTime > SCROLL_THROTTLE_MS) {
    lastScrollTime = now;
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToCurrent();
      });
    }, 10);
  }
}

function checkCapsLock(event) {
  if (event.getModifierState) {
    capsLockOn.value = event.getModifierState('CapsLock');
  }
}

function forceCursorToEnd() {
  if (inputRef.value) {
    const len = inputRef.value.value.length;
    inputRef.value.setSelectionRange(len, len);
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
  
  if (event.key === 'Backspace' || event.key.startsWith('Arrow')) {
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
  
  let pressedChar = event.key;
  if (pressedChar === 'Enter') {
    pressedChar = '\n';
  }
  
  if (pressedChar.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    totalCharsTyped.value++;
    
    const currentIndex = userInput.value.length;
    if (currentIndex >= 0 && currentIndex < props.targetText.length) {
      const expectedChar = props.targetText[currentIndex];
      
      
      
      
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
        event.preventDefault();
        totalMistakes.value++;
        currentCombo.value = 0; 
        emit('update:combo', { current: 0, max: maxCombo.value });
        errorKey.value = pressedChar.toLowerCase();
        hasErrorFlash.value = true;
        emit('update:errorKey', errorKey.value);
        setTimeout(() => {
          errorKey.value = '';
          hasErrorFlash.value = false;
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
  if (!currentChar) return;
  
  const container = textDisplayRef.value;
  const containerRect = container.getBoundingClientRect();
  const charRect = currentChar.getBoundingClientRect();
  
  const containerScrollTop = container.scrollTop;
  const containerHeight = container.clientHeight;
  
  const charRelativeTop = charRect.top - containerRect.top + containerScrollTop;
  const charHeight = charRect.height || 30;
  
  if (isScrolling) return;
  
  isScrolling = true;
  
  const isActivelyTyping = props.isActive && !props.isPaused;
  const scrollBehavior = isActivelyTyping ? 'auto' : 'smooth';
  
  const targetScrollTop = charRelativeTop - (containerHeight / 2) + (charHeight / 2);
  
  container.scrollTo({
    top: Math.max(0, Math.min(targetScrollTop, container.scrollHeight - containerHeight)),
    behavior: scrollBehavior
  });
  
  if (scrollBehavior === 'smooth') {
    setTimeout(() => {
      isScrolling = false;
    }, 500);
  } else {
    requestAnimationFrame(() => {
      isScrolling = false;
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
    hasErrorFlash.value = false;
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
  border: 4px solid rgba(var(--accent-rgb), 0.2);
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
  padding-right: 4rem;
  min-height: 200px;
  max-height: 260px;
  font-size: 1.5rem;
  line-height: 0.95;
  font-family: 'Roboto Mono', 'Consolas', monospace;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: normal;
  text-align: left;
  display: block;
}

.word {
  display: inline-block;
  white-space: pre;
}

.word-space {
  display: inline;
  white-space: pre-wrap;
}

.char {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  font-size: 1.5rem;
  height: 0.95em;
  line-height: 0.95em;
  vertical-align: top;
  text-align: center;
  overflow: visible;
  transition: color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.char.char-space {
  min-width: 0.5em;
  width: 0.5em;
  white-space: pre;
}

.char.char-space.correct,
.char.char-space.current,
.char.char-space.incorrect {
  background: transparent;
}

.char.char-newline {
  display: inline;
  white-space: pre-wrap;
  color: var(--typing-upcoming, #666);
  opacity: 0.3;
  font-size: 1.2rem;
}

.char.char-newline::after {
  content: '\A';
  white-space: pre;
}

.char.char-newline.current {
  color: var(--accent-color, #4ecdc4);
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: -3px 0 0 0 var(--accent-color, #4ecdc4);
  animation: blink 1s infinite;
  border-radius: 2px;
}

.char.char-newline.correct {
  color: var(--typing-correct, #4ecdc4);
  opacity: 0.5;
  background: transparent;
}

.char.char-newline.incorrect {
  color: #ff6b6b;
  opacity: 0.8;
  background: transparent;
}

:root.light-mode .char.char-newline.current {
  color: #2563eb;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: -3px 0 0 0 #2563eb;
}

:root.light-mode .char.char-newline.correct {
  color: #2563eb;
  background: transparent;
}

:root.light-mode .char.char-newline.incorrect {
  color: #dc2626;
  background: transparent;
}

.char.char-newline::after {
  content: '\A';
  white-space: pre;
}

.char.correct {
  color: var(--typing-correct, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.1);
}

:root.light-mode .char.correct {
  background: rgba(37, 99, 235, 0.1);
}

.char.incorrect {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.2);
  text-decoration: underline;
}

:root.light-mode .char.incorrect {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.15);
}

.char.current {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: -3px 0 0 0 var(--accent-color, #4ecdc4);
  animation: blink 1s infinite;
}

.char.current.error-pulse {
  background: rgba(255, 107, 107, 0.3);
  box-shadow: -3px 0 0 0 #ff6b6b;
  animation: none;
}

:root.light-mode .char.current {
  background: rgba(0, 0, 0, 0.05);
}

:root.light-mode .char.current.error-pulse {
  background: rgba(220, 38, 38, 0.2);
  box-shadow: -3px 0 0 0 #dc2626;
}

.char.upcoming {
  color: var(--typing-upcoming, #666);
}

@keyframes blink {
  0%, 50% { box-shadow: -3px 0 0 0 var(--accent-color, #4ecdc4); }
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
  font-size: 1.5rem;
  line-height: 0.95;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font-family: 'Roboto Mono', 'Consolas', monospace;
  outline: none;
  z-index: 10;
  resize: none;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: normal;
  overflow-wrap: normal;
}

.typing-input:focus {
  border-color: var(--accent-color, #4ecdc4);
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
  padding: 0.6rem 1rem;
  margin-top: 0.75rem;
  background: #b45309;
  border: 2px solid #92400a;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.3;
  color: #fff;
  flex-shrink: 0;
  z-index: 10;
}

:root.light-mode .warning-indicator {
  background: #d97706;
  border-color: #b45309;
  color: #fff;
}

.warning-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.warning-text {
  font-weight: 600;
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
  border-radius: 3px;
  position: relative;
  box-shadow: 
    0 0 8px rgba(var(--accent-rgb), 0.5),
    0 0 16px rgba(var(--accent-rgb), 0.3),
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
    font-size: 1.25rem;
    padding: 1rem;
    min-height: 140px;
    max-height: 180px;
    line-height: 0.95;
  }

  .char {
    font-size: 1.25rem;
    height: 0.95em;
    line-height: 0.95em;
  }

  .typing-input {
    font-size: 1.25rem;
    line-height: 0.95;
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
