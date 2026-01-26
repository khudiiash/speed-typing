<template>
  <div v-if="shouldShowSlider" class="eye-tracking-slider">
    <div class="slider-track"></div>
    <div class="slider-label slider-label-top">{{ screenY?.toFixed(3) || '0.000' }}</div>
    <div class="slider-label slider-label-bottom">{{ keyboardY?.toFixed(3) || '0.000' }}</div>
    <div 
      v-if="avgY !== null && avgY !== undefined"
      class="slider-pin" 
      :style="{ top: `${pinPosition}%` }"
    >
      <div class="pin-value">{{ (avgY ?? 0).toFixed(3) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  avgY: {
    type: [Number, null],
    default: null,
  },
  screenY: {
    type: Number,
    default: null,
  },
  keyboardY: {
    type: Number,
    default: null,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  ready: {
    type: Boolean,
    default: false,
  },
});




const shouldShowSlider = computed(() => {
  return props.enabled && props.ready;
});

const pinPosition = computed(() => {
  
  const screenY = props.screenY ?? 0.45;
  const keyboardY = props.keyboardY ?? 0.35;
  
  if (props.avgY === null || props.avgY === undefined || typeof props.avgY !== 'number') {
    return 50; 
  }
  const avgY = props.avgY;
  
  
  const minY = Math.min(screenY, keyboardY);
  const maxY = Math.max(screenY, keyboardY);
  const clampedAvgY = Math.max(minY, Math.min(maxY, avgY));
  
  
  
  const range = Math.abs(screenY - keyboardY);
  if (range === 0 || range < 0.01) return 50;
  
  
  let position;
  if (screenY > keyboardY) {
    
    
    
    
    position = ((screenY - clampedAvgY) / range) * 100;
  } else {
    
    
    
    position = ((clampedAvgY - screenY) / range) * 100;
  }
  
  return Math.max(0, Math.min(100, position));
});
</script>

<style scoped>
.eye-tracking-slider {
  position: absolute;
  right: -120px;
  top: 20px;
  width: 85px;
  height: 180px;
  min-height: 180px;
  max-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 15;
  pointer-events: none;
  overflow: visible;
}

.slider-track {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.slider-label {
  position: absolute;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: monospace;
  z-index: 2;
  white-space: nowrap;
  left: 0;
  transform: translateX(-50%);
  pointer-events: none;
}

.slider-label-top {
  bottom: 100%;
  margin-bottom: 8px;
}

.slider-label-bottom {
  top: 100%;
  margin-top: 8px;
}

.slider-pin {
  position: absolute;
  left: 0;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: var(--accent-color, #4ecdc4);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 12px rgba(78, 205, 196, 0.6), 0 0 8px rgba(78, 205, 196, 0.4);
  z-index: 20;
  transition: top 0.15s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 1;
}

.slider-pin::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.pin-value {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  font-size: 0.55rem;
  color: var(--accent-color, #4ecdc4);
  font-family: monospace;
  white-space: nowrap;
  font-weight: bold;
}
</style>
