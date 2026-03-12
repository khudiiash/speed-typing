<template>
  <div class="keyboard-container">
    <div class="keyboard" :class="[`layout-${effectiveLayout}`, { 'error-blink': hasError }]">
      <div v-for="(row, rowIndex) in keyboardLayout" :key="rowIndex" class="keyboard-row" :class="`row-${rowIndex}`">
        <div v-for="keyObj in row"
          v-memo="[keyObj.key, props.activeKey, props.errorKey, props.expectedKey, props.isShiftPressed]"
          :key="keyObj.key" class="key" :class="[
            getFingerClass(keyObj.key),
            getKeySizeClass(keyObj),
            { active: isKeyActive(keyObj) },
            { error: isKeyError(keyObj) },
            { expected: isKeyExpected(keyObj) },
            { dimmed: isKeyDimmed(keyObj) },
            { 'shift-needed': isShiftNeeded(keyObj) },
            { 'modifier-key': keyObj.isModifier }
          ]">
          <span class="key-main">{{ getKeyDisplay(keyObj) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { fingerMap, fingerMapUk } from '../data/practiceData.js';

const props = defineProps({
  language: {
    type: String,
    default: 'en',
  },
  activeKey: {
    type: String,
    default: '',
  },
  errorKey: {
    type: String,
    default: '',
  },
  expectedKey: {
    type: String,
    default: '',
  },
  isShiftPressed: {
    type: Boolean,
    default: false,
  },
});

const hasError = computed(() => !!props.errorKey);
const errorKeyLower = computed(() => props.errorKey ? props.errorKey.toLowerCase() : '');


function isUkrainianChar(char) {
  if (!char) return false;
  const ukrainianChars = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
  return ukrainianChars.includes(char.toLowerCase());
}


const effectiveLayout = computed(() => {
  if (props.expectedKey && props.expectedKey.length === 1) {
    const char = props.expectedKey;

    if (char === ' ' || /[^\wа-яёіїєґ<>&|@#$]/.test(char)) {
      return props.language;
    }
    return isUkrainianChar(char) ? 'uk' : 'en';
  }

  return props.language;
});

const keyboardLayout = computed(() => {
  const layout = effectiveLayout.value;
  if (layout === 'uk') {
    return [

      [
        { key: '`', display: "'", shiftChar: '~', needsShift: false, isModifier: false },
        { key: '1', display: '1', shiftChar: '!', needsShift: false, isModifier: false },
        { key: '2', display: '2', shiftChar: '"', needsShift: false, isModifier: false },
        { key: '3', display: '3', shiftChar: '№', needsShift: false, isModifier: false },
        { key: '4', display: '4', shiftChar: ';', needsShift: false, isModifier: false },
        { key: '5', display: '5', shiftChar: '%', needsShift: false, isModifier: false },
        { key: '6', display: '6', shiftChar: '^', needsShift: false, isModifier: false },
        { key: '7', display: '7', shiftChar: '?', needsShift: false, isModifier: false },
        { key: '8', display: '8', shiftChar: '*', needsShift: false, isModifier: false },
        { key: '9', display: '9', shiftChar: '(', needsShift: false, isModifier: false },
        { key: '0', display: '0', shiftChar: ')', needsShift: false, isModifier: false },
        { key: '-', display: '-', shiftChar: '_', needsShift: false, isModifier: false },
        { key: '=', display: '=', shiftChar: '+', needsShift: false, isModifier: false },
        { key: 'Backspace', display: '⌫', needsShift: false, isModifier: true, size: 'large' },
      ],

      [
        { key: 'Tab', display: 'Tab', needsShift: false, isModifier: true, size: 'medium' },
        { key: 'й', display: 'й', shiftChar: 'Й', needsShift: true, isModifier: false },
        { key: 'ц', display: 'ц', shiftChar: 'Ц', needsShift: true, isModifier: false },
        { key: 'у', display: 'у', shiftChar: 'У', needsShift: true, isModifier: false },
        { key: 'к', display: 'к', shiftChar: 'К', needsShift: true, isModifier: false },
        { key: 'е', display: 'е', shiftChar: 'Е', needsShift: true, isModifier: false },
        { key: 'н', display: 'н', shiftChar: 'Н', needsShift: true, isModifier: false },
        { key: 'г', display: 'г', shiftChar: 'Г', needsShift: true, isModifier: false },
        { key: 'ш', display: 'ш', shiftChar: 'Ш', needsShift: true, isModifier: false },
        { key: 'щ', display: 'щ', shiftChar: 'Щ', needsShift: true, isModifier: false },
        { key: 'з', display: 'з', shiftChar: 'З', needsShift: true, isModifier: false },
        { key: 'х', display: 'х', shiftChar: 'Х', needsShift: true, isModifier: false },
        { key: 'ї', display: 'ї', shiftChar: 'Ї', needsShift: true, isModifier: false },
        { key: '\\', display: '\\', shiftChar: '/', needsShift: false, isModifier: false },
      ],

      [
        { key: 'Caps', display: 'Caps', needsShift: false, isModifier: true, size: 'medium' },
        { key: 'ф', display: 'ф', shiftChar: 'Ф', needsShift: true, isModifier: false },
        { key: 'і', display: 'і', shiftChar: 'І', needsShift: true, isModifier: false },
        { key: 'в', display: 'в', shiftChar: 'В', needsShift: true, isModifier: false },
        { key: 'а', display: 'а', shiftChar: 'А', needsShift: true, isModifier: false },
        { key: 'п', display: 'п', shiftChar: 'П', needsShift: true, isModifier: false },
        { key: 'р', display: 'р', shiftChar: 'Р', needsShift: true, isModifier: false },
        { key: 'о', display: 'о', shiftChar: 'О', needsShift: true, isModifier: false },
        { key: 'л', display: 'л', shiftChar: 'Л', needsShift: true, isModifier: false },
        { key: 'д', display: 'д', shiftChar: 'Д', needsShift: true, isModifier: false },
        { key: 'ж', display: 'ж', shiftChar: 'Ж', needsShift: true, isModifier: false },
        { key: 'є', display: 'є', shiftChar: 'Є', needsShift: true, isModifier: false },
        { key: 'Enter', display: '↵', needsShift: false, isModifier: true, size: 'large' },
      ],

      [
        { key: 'Shift', display: '⇧', needsShift: false, isModifier: true, size: 'large', side: 'left' },
        { key: 'я', display: 'я', shiftChar: 'Я', needsShift: true, isModifier: false },
        { key: 'ч', display: 'ч', shiftChar: 'Ч', needsShift: true, isModifier: false },
        { key: 'с', display: 'с', shiftChar: 'С', needsShift: true, isModifier: false },
        { key: 'м', display: 'м', shiftChar: 'М', needsShift: true, isModifier: false },
        { key: 'и', display: 'и', shiftChar: 'И', needsShift: true, isModifier: false },
        { key: 'т', display: 'т', shiftChar: 'Т', needsShift: true, isModifier: false },
        { key: 'ь', display: 'ь', shiftChar: 'Ь', needsShift: true, isModifier: false },
        { key: 'б', display: 'б', shiftChar: 'Б', needsShift: true, isModifier: false },
        { key: 'ю', display: 'ю', shiftChar: 'Ю', needsShift: true, isModifier: false },
        { key: '.', display: '.', shiftChar: ',', needsShift: true, isModifier: false },
        { key: '/', display: '/', shiftChar: '?', needsShift: false, isModifier: false },
        { key: 'Shift', display: '⇧', needsShift: false, isModifier: true, size: 'large', side: 'right' },
      ],

      [
        { key: 'Ctrl', display: 'Ctrl', needsShift: false, isModifier: true, size: 'medium', side: 'left' },
        { key: 'Alt', display: 'Alt', needsShift: false, isModifier: true, size: 'medium', side: 'left' },
        { key: ' ', display: 'Space', needsShift: false, isModifier: false, size: 'xlarge' },
        { key: 'Alt', display: 'Alt', needsShift: false, isModifier: true, size: 'medium', side: 'right' },
        { key: 'Ctrl', display: 'Ctrl', needsShift: false, isModifier: true, size: 'medium', side: 'right' },
      ],
    ];
  } else {
    return [

      [
        { key: '`', display: '`', shiftChar: '~', needsShift: false, isModifier: false },
        { key: '1', display: '1', shiftChar: '!', needsShift: false, isModifier: false },
        { key: '2', display: '2', shiftChar: '@', needsShift: false, isModifier: false },
        { key: '3', display: '3', shiftChar: '#', needsShift: false, isModifier: false },
        { key: '4', display: '4', shiftChar: '$', needsShift: false, isModifier: false },
        { key: '5', display: '5', shiftChar: '%', needsShift: false, isModifier: false },
        { key: '6', display: '6', shiftChar: '^', needsShift: false, isModifier: false },
        { key: '7', display: '7', shiftChar: '&', needsShift: false, isModifier: false },
        { key: '8', display: '8', shiftChar: '*', needsShift: false, isModifier: false },
        { key: '9', display: '9', shiftChar: '(', needsShift: false, isModifier: false },
        { key: '0', display: '0', shiftChar: ')', needsShift: false, isModifier: false },
        { key: '-', display: '-', shiftChar: '_', needsShift: false, isModifier: false },
        { key: '=', display: '=', shiftChar: '+', needsShift: false, isModifier: false },
        { key: 'Backspace', display: '⌫', needsShift: false, isModifier: true, size: 'large' },
      ],

      [
        { key: 'Tab', display: 'Tab', needsShift: false, isModifier: true, size: 'medium' },
        { key: 'q', display: 'q', shiftChar: 'Q', needsShift: true, isModifier: false },
        { key: 'w', display: 'w', shiftChar: 'W', needsShift: true, isModifier: false },
        { key: 'e', display: 'e', shiftChar: 'E', needsShift: true, isModifier: false },
        { key: 'r', display: 'r', shiftChar: 'R', needsShift: true, isModifier: false },
        { key: 't', display: 't', shiftChar: 'T', needsShift: true, isModifier: false },
        { key: 'y', display: 'y', shiftChar: 'Y', needsShift: true, isModifier: false },
        { key: 'u', display: 'u', shiftChar: 'U', needsShift: true, isModifier: false },
        { key: 'i', display: 'i', shiftChar: 'I', needsShift: true, isModifier: false },
        { key: 'o', display: 'o', shiftChar: 'O', needsShift: true, isModifier: false },
        { key: 'p', display: 'p', shiftChar: 'P', needsShift: true, isModifier: false },
        { key: '[', display: '[', shiftChar: '{', needsShift: false, isModifier: false },
        { key: ']', display: ']', shiftChar: '}', needsShift: false, isModifier: false },
        { key: '\\', display: '\\', shiftChar: '|', needsShift: false, isModifier: false },
      ],

      [
        { key: 'Caps', display: 'Caps', needsShift: false, isModifier: true, size: 'medium' },
        { key: 'a', display: 'a', shiftChar: 'A', needsShift: true, isModifier: false },
        { key: 's', display: 's', shiftChar: 'S', needsShift: true, isModifier: false },
        { key: 'd', display: 'd', shiftChar: 'D', needsShift: true, isModifier: false },
        { key: 'f', display: 'f', shiftChar: 'F', needsShift: true, isModifier: false },
        { key: 'g', display: 'g', shiftChar: 'G', needsShift: true, isModifier: false },
        { key: 'h', display: 'h', shiftChar: 'H', needsShift: true, isModifier: false },
        { key: 'j', display: 'j', shiftChar: 'J', needsShift: true, isModifier: false },
        { key: 'k', display: 'k', shiftChar: 'K', needsShift: true, isModifier: false },
        { key: 'l', display: 'l', shiftChar: 'L', needsShift: true, isModifier: false },
        { key: ';', display: ';', shiftChar: ':', needsShift: false, isModifier: false },
        { key: "'", display: "'", shiftChar: '"', needsShift: false, isModifier: false },
        { key: 'Enter', display: '↵', needsShift: false, isModifier: true, size: 'large' },
      ],

      [
        { key: 'Shift', display: '⇧', needsShift: false, isModifier: true, size: 'large', side: 'left' },
        { key: 'z', display: 'z', shiftChar: 'Z', needsShift: true, isModifier: false },
        { key: 'x', display: 'x', shiftChar: 'X', needsShift: true, isModifier: false },
        { key: 'c', display: 'c', shiftChar: 'C', needsShift: true, isModifier: false },
        { key: 'v', display: 'v', shiftChar: 'V', needsShift: true, isModifier: false },
        { key: 'b', display: 'b', shiftChar: 'B', needsShift: true, isModifier: false },
        { key: 'n', display: 'n', shiftChar: 'N', needsShift: true, isModifier: false },
        { key: 'm', display: 'm', shiftChar: 'M', needsShift: true, isModifier: false },
        { key: ',', display: ',', shiftChar: '<', needsShift: false, isModifier: false },
        { key: '.', display: '.', shiftChar: '>', needsShift: false, isModifier: false },
        { key: '/', display: '/', shiftChar: '?', needsShift: false, isModifier: false },
        { key: 'Shift', display: '⇧', needsShift: false, isModifier: true, size: 'large', side: 'right' },
      ],

      [
        { key: 'Ctrl', display: 'Ctrl', needsShift: false, isModifier: true, size: 'medium', side: 'left' },
        { key: 'Alt', display: 'Alt', needsShift: false, isModifier: true, size: 'medium', side: 'left' },
        { key: ' ', display: 'Space', needsShift: false, isModifier: false, size: 'xlarge' },
        { key: 'Alt', display: 'Alt', needsShift: false, isModifier: true, size: 'medium', side: 'right' },
        { key: 'Ctrl', display: 'Ctrl', needsShift: false, isModifier: true, size: 'medium', side: 'right' },
      ],
    ];
  }
});

function getPhysicalKey(char, keyObj) {
  if (effectiveLayout.value === 'uk') {
    if (char === "'" && keyObj.key === '`') {
      return true;
    }
    if (char === ',' && keyObj.key === '.' && keyObj.shiftChar === ',') {
      return true;
    }
  }
  return false;
}

function getFingerClass(keyObj) {
  const key = typeof keyObj === 'string' ? keyObj : keyObj.key;
  const keyLower = key.toLowerCase();
  const map = effectiveLayout.value === 'uk' ? fingerMapUk : fingerMap;
  const finger = map[keyLower] || 'other';
  return `finger-${finger}`;
}

function getKeySizeClass(keyObj) {
  if (keyObj.size === 'xlarge') return 'key-xlarge';
  if (keyObj.size === 'large') return 'key-large';
  if (keyObj.size === 'medium') return 'key-medium';
  return '';
}

function isKeyActive(keyObj) {
  if (keyObj.key === 'Shift' && props.isShiftPressed) return true;
  const keyLower = keyObj.key.toLowerCase();
  let activeLower = props.activeKey.toLowerCase();
  
  if (activeLower === '\n') activeLower = 'enter';

  if (getPhysicalKey(props.activeKey, keyObj)) {
    return !props.isShiftPressed;
  }

  if (activeLower === keyLower) {
    if (keyObj.needsShift && props.activeKey !== props.activeKey.toLowerCase()) {
      return props.isShiftPressed;
    }
    if (keyObj.needsShift) {
      return !props.isShiftPressed;
    }
    return true;
  }

  if (keyObj.shiftChar && activeLower === keyObj.shiftChar.toLowerCase()) {
    return props.isShiftPressed;
  }

  return false;
}

function isKeyError(keyObj) {
  if (!props.errorKey) return false;
  const keyLower = keyObj.key.toLowerCase();
  
  let currentErrorLower = errorKeyLower.value;
  if (currentErrorLower === '\n') currentErrorLower = 'enter';

  if (getPhysicalKey(props.errorKey, keyObj)) {
    return true;
  }

  if (currentErrorLower === keyLower) {
    return true;
  }

  if (keyObj.shiftChar && currentErrorLower === keyObj.shiftChar.toLowerCase()) {
    return true;
  }

  return false;
}

function isKeyExpected(keyObj) {
  if (!props.expectedKey) return false;
  const keyLower = keyObj.key.toLowerCase();
  const expectedChar = props.expectedKey;
  let expectedLower = expectedChar.toLowerCase();
  
  if (expectedLower === '\n') expectedLower = 'enter';

  if (getPhysicalKey(expectedChar, keyObj)) {
    if (expectedChar === ',' && keyObj.key === '.' && keyObj.shiftChar === ',') {
      return !props.isShiftPressed;
    }
    if (expectedChar === "'" && keyObj.key === '`') {
      return !props.isShiftPressed;
    }
  }

  if (expectedLower === keyLower) {

    if (keyObj.needsShift) {

      if (expectedChar === expectedChar.toUpperCase() && expectedChar !== expectedChar.toLowerCase()) {
        return true;
      }

      return !props.isShiftPressed;
    }

    if (keyObj.shiftChar) {

      if (expectedChar === keyObj.shiftChar) {
        return true;
      }

      if (expectedChar === keyObj.key) {
        return !props.isShiftPressed;
      }
    }

    return true;
  }


  if (keyObj.shiftChar && expectedChar === keyObj.shiftChar) {
    return true;
  }

  return false;
}

function isShiftNeeded(keyObj) {
  if (keyObj.key !== 'Shift') return false;

  if (!props.expectedKey) return false;
  const expectedChar = props.expectedKey;

  if (effectiveLayout.value === 'uk' && expectedChar === ',') {
    return !props.isShiftPressed;
  }

  const layout = keyboardLayout.value;
  for (const row of layout) {
    for (const key of row) {
      const keyLower = key.key.toLowerCase();
      const expectedLower = expectedChar.toLowerCase();

      if (key.needsShift && key.shiftChar) {
        if (expectedChar === key.shiftChar) {
          return !props.isShiftPressed;
        }
        if (expectedLower === keyLower && expectedChar === expectedChar.toUpperCase() && expectedChar !== expectedChar.toLowerCase()) {
          return !props.isShiftPressed;
        }
      }

      if (key.shiftChar && expectedChar === key.shiftChar) {
        return !props.isShiftPressed;
      }
    }
  }

  return false;
}

function getKeyDisplay(keyObj) {
  if (keyObj.needsShift && keyObj.shiftChar) {
    return keyObj.shiftChar;
  }
  return keyObj.display || keyObj.key;
}

function isKeyDimmed(keyObj) {
  if (keyObj.key === 'Shift' && props.isShiftPressed) return false;
  if (isKeyActive(keyObj) || isKeyError(keyObj) || isKeyExpected(keyObj)) return false;
  return true;
}
</script>

<style scoped>
.keyboard-container {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
  flex-shrink: 0;
  position: relative;
}

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--keyboard-bg, #1a1a1a);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
  position: relative;
  overflow: visible;
}

.keyboard.error-blink {
  animation: keyboardErrorBlink 0.1s ease-in-out;
}

@keyframes keyboardErrorBlink {
  0% {
    border-color: rgba(var(--accent-rgb), 0.2);
  }
  50% {
    border-color: rgba(214, 48, 49, 1);
  }
  100% {
    border-color: rgba(var(--accent-rgb), 0.2);
  }
}

.keyboard-row {
  display: flex;
  gap: 0.35rem;
  justify-content: center;
}

.key {
  min-width: 38px;
  height: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  border: 1px solid var(--keyboard-key-border, rgba(255, 255, 255, 0.1));
  user-select: none;
  position: relative;
  overflow: hidden;
  color: #1a1a1a;
  padding: 0.25rem;
  will-change: transform;
}

.key-main {
  font-size: 0.9rem;
  line-height: 1;
}


.key-medium {
  min-width: 55px;
}

.key-large {
  min-width: 80px;
}

.key-xlarge {
  min-width: 280px;
  max-width: 380px;
  flex: 1;
}

.key::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  opacity: 0;
}

.key:hover::before {
  opacity: 1;
}

/* Finger colors */
.finger-pinky-l {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  border-color: rgba(255, 107, 107, 0.5);
}

.finger-ring-l {
  background: linear-gradient(135deg, var(--accent-color) 0%, #26a69a 100%);
  border-color: rgba(var(--accent-rgb), 0.5);
}

.finger-middle-l {
  background: linear-gradient(135deg, #45b7d1 0%, #2980b9 100%);
  border-color: rgba(69, 183, 209, 0.5);
}

.finger-index-l {
  background: linear-gradient(135deg, #96ceb4 0%, #6ab04c 100%);
  border-color: rgba(150, 206, 180, 0.5);
}

.finger-thumb {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-color: rgba(255, 234, 167, 0.5);
}

.finger-index-r {
  background: linear-gradient(135deg, #a8e6cf 0%, #55efc4 100%);
  border-color: rgba(168, 230, 207, 0.5);
}

.finger-middle-r {
  background: linear-gradient(135deg, #ffd93d 0%, #f39c12 100%);
  border-color: rgba(255, 217, 61, 0.5);
}

.finger-ring-r {
  background: linear-gradient(135deg, #ff9ff3 0%, #e84393 100%);
  border-color: rgba(255, 159, 243, 0.5);
}

.finger-pinky-r {
  background: linear-gradient(135deg, #c44569 0%, #a29bfe 100%);
  border-color: rgba(196, 69, 105, 0.5);
}

.finger-other {
  background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
  border-color: rgba(99, 110, 114, 0.3);
}

.key.active {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  opacity: 1;
  will-change: transform;
}

.key.modifier-key {
  font-size: 0.75rem;
  background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
  border-color: rgba(99, 110, 114, 0.3);
}

.key.shift-needed {
  border: 2px solid rgba(255, 234, 167, 0.9) !important;
  opacity: 1;
  animation: shiftNeededPulse 1.5s ease-in-out infinite;
  will-change: opacity;
}

@keyframes shiftNeededPulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.9;
  }
}

.key.active.modifier-key {
  background: linear-gradient(135deg, var(--accent-color) 0%, #26a69a 100%);
  border-color: rgba(var(--accent-rgb), 0.8);
}

.key.error {
  background: #d63031 !important;
  border: 2px solid rgba(214, 48, 49, 1) !important;
  z-index: 15;
  animation: errorKeyFade 0.3s ease-out !important;
}

.key.error .key-main {
  color: white !important;
}

@keyframes errorKeyFade {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.9;
  }

  100% {
    opacity: 0.7;
  }
}

.key.expected {
  opacity: 1;
  border: 2px solid rgba(var(--accent-rgb), 0.9);
}

.key.dimmed {
  opacity: 0.3;
}

@media (max-width: 768px) {
  .key {
    min-width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .keyboard {
    padding: 0.75rem;
    gap: 0.4rem;
  }

  .keyboard-row {
    gap: 0.25rem;
  }
}
</style>
