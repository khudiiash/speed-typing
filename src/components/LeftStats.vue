<template>
  <!-- Longest Sequence -->
  <div v-if="isTyping" class="longest-sequence-display" :class="longestSequenceColorClass">
    <div class="longest-sequence-label">{{ t.longestSequence }}</div>
    <div class="longest-sequence-value">{{ maxCombo }}</div>
  </div>
  
  <!-- Speed Meter -->
  <div v-if="isTyping" class="speed-display" :class="speedColorClass">
    <div class="speed-label">{{ t.speed }}</div>
    <div class="speed-value">{{ speed.wpm }} {{ t.wpmShort }}</div>
    <div class="speed-value-small">{{ speed.cpm }} {{ t.cpmShort }}</div>
  </div>
  
  <!-- Combo Display -->
  <div v-if="isTyping" class="combo-display" :class="comboColorClass">
    <div class="combo-label">{{ t.combo }}</div>
    <div class="combo-value">{{ combo }}x</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isTyping: {
    type: Boolean,
    required: true,
  },
  maxCombo: {
    type: Number,
    required: true,
  },
  speed: {
    type: Object,
    required: true,
  },
  combo: {
    type: Number,
    required: true,
  },
  t: {
    type: Object,
    required: true,
  },
});

function getColorLevel(value, threshold = 25) {
  if (value === 0) return 0;
  const level = Math.floor(value / threshold) + 1;
  return Math.min(level, 5);
}


const longestSequenceColorLevel = computed(() => {
  return getColorLevel(props.maxCombo, 25);
});

const longestSequenceColorClass = computed(() => {
  const level = longestSequenceColorLevel.value;
  if (level === 0) return '';
  return `longest-sequence-color-${level}`;
});


const speedColorLevel = computed(() => {
  return getColorLevel(props.speed.wpm, 30);
});

const speedColorClass = computed(() => {
  const level = speedColorLevel.value;
  if (level === 0) return '';
  return `speed-color-${level}`;
});


const comboColorLevel = computed(() => {
  return getColorLevel(props.combo, 25);
});

const comboColorClass = computed(() => {
  const level = comboColorLevel.value;
  if (level === 0) return '';
  return `combo-color-${level}`;
});

function getComboMultiplier(combo) {
  if (combo < 5) return 1.0;
  if (combo < 10) return 1.2;
  if (combo < 15) return 1.5;
  if (combo < 20) return 1.8;
  if (combo < 25) return 2.0;
  if (combo < 30) return 2.5;
  if (combo < 40) return 3.0;
  if (combo < 50) return 3.5;
  return 4.0;
}
</script>

<style scoped>
.longest-sequence-display,
.speed-display,
.combo-display {
  position: fixed;
  left: 1.5rem;
  padding: 0.6rem 1rem;
  z-index: 100;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.longest-sequence-display {
  top: calc(50vh - 140px);
  border-bottom: 1px solid #444;
  padding-bottom: 0.8rem;
}

.speed-display {
  top: calc(50vh - 60px);
  border-bottom: 1px solid #444;
  padding-bottom: 0.8rem;
}

.combo-display {
  top: calc(50vh + 20px);
  animation: comboPulse 0.5s ease-out;
}

.longest-sequence-label {
  font-size: 0.6rem;
  color: #aaa;
  letter-spacing: 1.5px;
  text-align: left;
  line-height: 1.3;
  max-width: 120px;
}

.speed-label,
.combo-label {
  font-size: 0.6rem;
  color: #aaa;
  letter-spacing: 1.5px;
  text-align: left;
}

.longest-sequence-value,
.speed-value,
.combo-value {
  font-weight: bold;
  color: #888;
  line-height: 1;
  text-align: left;
}

.longest-sequence-value {
  font-size: 1.4rem;
}

.speed-value {
  font-size: 1.1rem;
  line-height: 1.2;
}

.speed-value-small {
  font-size: 0.75rem;
  color: #666;
  text-align: left;
}

.combo-value {
  font-size: 1.8rem;
}

/* Longest Sequence Color Levels */
.longest-sequence-display.longest-sequence-color-1 {
  border-bottom-color: #4ecdc4;
}
.longest-sequence-display.longest-sequence-color-1 .longest-sequence-value {
  color: #4ecdc4;
}

.longest-sequence-display.longest-sequence-color-2 {
  border-bottom-color: #ffbe0b;
}
.longest-sequence-display.longest-sequence-color-2 .longest-sequence-value {
  color: #ffbe0b;
}

.longest-sequence-display.longest-sequence-color-3 {
  border-bottom-color: #ff006e;
}
.longest-sequence-display.longest-sequence-color-3 .longest-sequence-value {
  color: #ff006e;
  text-shadow: 0 0 8px rgba(255, 0, 110, 0.6);
}

.longest-sequence-display.longest-sequence-color-4 {
  border-bottom-color: #8338ec;
}
.longest-sequence-display.longest-sequence-color-4 .longest-sequence-value {
  color: #8338ec;
  text-shadow: 0 0 8px rgba(131, 56, 236, 0.6);
}

.longest-sequence-display.longest-sequence-color-5 {
  border-bottom-color: #06ffa5;
}
.longest-sequence-display.longest-sequence-color-5 .longest-sequence-value {
  color: #06ffa5;
  text-shadow: 0 0 8px rgba(6, 255, 165, 0.6);
}

/* Speed Color Levels */
.speed-display.speed-color-1 {
  border-bottom-color: #4ecdc4;
}
.speed-display.speed-color-1 .speed-value,
.speed-display.speed-color-1 .speed-value-small {
  color: #4ecdc4;
}
.speed-display.speed-color-1 .speed-value-small {
  opacity: 0.8;
}

.speed-display.speed-color-2 {
  border-bottom-color: #ffbe0b;
}
.speed-display.speed-color-2 .speed-value,
.speed-display.speed-color-2 .speed-value-small {
  color: #ffbe0b;
}
.speed-display.speed-color-2 .speed-value-small {
  opacity: 0.8;
}

.speed-display.speed-color-3 {
  border-bottom-color: #ff006e;
}
.speed-display.speed-color-3 .speed-value,
.speed-display.speed-color-3 .speed-value-small {
  color: #ff006e;
  text-shadow: 0 0 8px rgba(255, 0, 110, 0.6);
}
.speed-display.speed-color-3 .speed-value-small {
  opacity: 0.8;
}

.speed-display.speed-color-4 {
  border-bottom-color: #8338ec;
}
.speed-display.speed-color-4 .speed-value,
.speed-display.speed-color-4 .speed-value-small {
  color: #8338ec;
  text-shadow: 0 0 8px rgba(131, 56, 236, 0.6);
}
.speed-display.speed-color-4 .speed-value-small {
  opacity: 0.8;
}

.speed-display.speed-color-5 {
  border-bottom-color: #06ffa5;
}
.speed-display.speed-color-5 .speed-value,
.speed-display.speed-color-5 .speed-value-small {
  color: #06ffa5;
  text-shadow: 0 0 8px rgba(6, 255, 165, 0.6);
}
.speed-display.speed-color-5 .speed-value-small {
  opacity: 0.8;
}

/* Combo Color Levels */
.combo-display.combo-color-1 {
  border-bottom-color: #4ecdc4;
}
.combo-display.combo-color-1 .combo-value {
  color: #4ecdc4;
}

.combo-display.combo-color-2 {
  border-bottom-color: #ffbe0b;
}
.combo-display.combo-color-2 .combo-value {
  color: #ffbe0b;
}

.combo-display.combo-color-3 {
  border-bottom-color: #ff006e;
}
.combo-display.combo-color-3 .combo-value {
  color: #ff006e;
  text-shadow: 0 0 8px rgba(255, 0, 110, 0.6);
}

.combo-display.combo-color-4 {
  border-bottom-color: #8338ec;
}
.combo-display.combo-color-4 .combo-value {
  color: #8338ec;
  text-shadow: 0 0 8px rgba(131, 56, 236, 0.6);
}

.combo-display.combo-color-5 {
  border-bottom-color: #06ffa5;
}
.combo-display.combo-color-5 .combo-value {
  color: #06ffa5;
  text-shadow: 0 0 8px rgba(6, 255, 165, 0.6);
}

@keyframes comboPulse {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .longest-sequence-display,
  .speed-display,
  .combo-display {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    margin: 0.5rem auto;
    max-width: 200px;
  }
}
</style>
