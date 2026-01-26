<template>
  <div v-if="expectedKey && fingerInfo" class="finger-indicator">
    <div class="indicator-content">
      <svg viewBox="0 0 800 350" class="hands-keyboard-svg" xmlns="http://www.w3.org/2000/svg">
        <g class="left-hand" transform="translate(-50, 0) scale(0.35, 0.35)">
            <HandSVG 
              hand="left"
              :active-finger="fingerInfo.hand === 'left' || fingerInfo.hand === 'both' ? fingerInfo.finger : null"
            />
        </g>
        
        <g class="right-hand" transform="translate(850, 0) scale(-0.35, 0.35)">
          <HandSVG 
            hand="right"
            :active-finger="fingerInfo.hand === 'right' ? fingerInfo.finger : null"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { fingerMap, fingerMapUk } from '../data/practiceData.js';
import HandSVG from './HandSVG.vue';

const props = defineProps({
  expectedKey: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'en',
  },
  isShiftPressed: {
    type: Boolean,
    default: false,
  },
  t: {
    type: Object,
    required: true,
  },
});


function isShiftNeeded(expectedChar) {
  if (!expectedChar) return false;
  
  
  if (expectedChar === expectedChar.toUpperCase() && expectedChar !== expectedChar.toLowerCase()) {
    return !props.isShiftPressed;
  }
  
  
  const shiftChars = '!@#$%^&*()_+{}|:"<>?~';
  if (shiftChars.includes(expectedChar)) {
    return !props.isShiftPressed;
  }
  
  return false;
}


function isUkrainianChar(char) {
  if (!char) return false;
  const ukrainianChars = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
  return ukrainianChars.includes(char.toLowerCase());
}

const fingerInfo = computed(() => {
  if (!props.expectedKey) return null;
  
  
  if (isShiftNeeded(props.expectedKey)) {
    return {
      finger: 'pinky-l',
      name: props.t.fingerPinky,
      hand: 'left',
    };
  }
  
  
  const charLower = props.expectedKey.toLowerCase();
  let finger = null;
  
  
  if (isUkrainianChar(props.expectedKey)) {
    finger = fingerMapUk[charLower] || null;
  } else {
    finger = fingerMap[charLower] || null;
  }
  
  
  if (!finger) {
    const fallbackMap = isUkrainianChar(props.expectedKey) ? fingerMap : fingerMapUk;
    finger = fallbackMap[charLower] || null;
  }
  
  
  if (!finger) {
    const map = props.language === 'uk' ? fingerMapUk : fingerMap;
    finger = map[charLower] || null;
  }
  
  if (!finger) return null;
  
  const fingerNames = {
    'pinky-l': props.t.fingerPinky,
    'ring-l': props.t.fingerRing,
    'middle-l': props.t.fingerMiddle,
    'index-l': props.t.fingerIndex,
    'pinky-r': props.t.fingerPinky,
    'ring-r': props.t.fingerRing,
    'middle-r': props.t.fingerMiddle,
    'index-r': props.t.fingerIndex,
    'thumb': props.t.fingerThumb,
  };
  
  return {
    finger,
    name: fingerNames[finger] || finger,
    hand: finger === 'thumb' ? 'left' : finger.includes('-l') ? 'left' : finger.includes('-r') ? 'right' : 'both',
  };
});
</script>

<style scoped>
.finger-indicator {
  position: fixed;
  bottom: 100px;
  left: 0;
  width: 100%;
  height: 30%;
  z-index: 100;
  pointer-events: none;
}

.indicator-content {
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}


.indicator-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.finger-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--accent-color, #4ecdc4);
}

.hand-name {
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
}

@media (max-width: 768px) {
  .finger-indicator {
    bottom: 100px;
    right: 10px;
  }
  
  .indicator-content {
    min-width: 150px;
    padding: 0.75rem;
  }
  
  .hands-keyboard-svg {
    max-width: 200px;
  }
}
</style>
