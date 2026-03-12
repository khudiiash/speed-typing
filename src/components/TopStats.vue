<template>
  <div class="top-stats-container">
    <!-- Speedometer -->
    <div v-if="type === 'all' || type === 'speed'" class="stat-item speed-meter">
      <div class="stat-circle-container">
        <svg class="stat-circle" viewBox="-10 -10 120 120" style="overflow: visible;">
          <!-- Background track (270 degrees) -->
          <path 
            class="circle-bg" 
            d="M 20 80 A 45 45 0 1 1 80 80" 
            stroke-width="6"
          />
          <!-- Progress track -->
          <path 
            class="circle-progress" 
            :style="{ stroke: speedColor, filter: `drop-shadow(0 0 2px ${speedColor})` }"
            :stroke-dasharray="`${speedDasharray}, 283`" 
            d="M 20 80 A 45 45 0 1 1 80 80" 
            stroke-width="6"
          />
          <!-- Speedometer Arrow -->
          <g :style="{ transform: `rotate(${speedAngle}deg)`, transformOrigin: '50px 50px', transition: 'transform 0.3s ease-out', filter: `drop-shadow(0 0 2px ${speedColor})` }">
            <polygon points="48,25 52,25 50,12" :fill="speedColor" />
          </g>
        </svg>
        <div class="stat-info-center">
          <div class="stat-value" :style="{ color: speedColor, textShadow: `0 0 10px ${speedColor.replace('rgb', 'rgba').replace(')', ', 0.5)')}` }">{{ speed.wpm }}</div>
          <div class="stat-unit">{{ t.wpmShort || 'WPM' }}</div>
        </div>
      </div>
    </div>
    
    <!-- Accuracy -->
    <div v-if="type === 'all' || type === 'accuracy'" class="stat-item accuracy-meter">
      <div class="stat-circle-container">
        <svg class="stat-circle" viewBox="-10 -10 120 120" style="overflow: visible;">
          <!-- Background track -->
          <circle class="circle-bg" cx="50" cy="50" r="45" stroke-width="6" />
          <!-- Progress track -->
          <circle 
            class="circle-progress" 
            cx="50" cy="50" r="45" 
            stroke-width="6"
            :style="{ stroke: accuracyColor, strokeDasharray: `${accuracyDasharray}, 283`, filter: `drop-shadow(0 0 2px ${accuracyColor})` }"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div class="stat-info-center">
          <div class="stat-value" :style="{ color: accuracyColor, textShadow: `0 0 10px ${accuracyColor.replace('rgb', 'rgba').replace(')', ', 0.5)')}` }">{{ accuracy }}%</div>
          <div class="stat-unit">{{ t.accuracy || 'ACC' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isTyping: {
    type: Boolean,
    required: true,
  },
  speed: {
    type: Object,
    required: true,
  },
  accuracy: {
    type: Number,
    default: 100,
  },
  t: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: 'all', // 'all', 'speed', or 'accuracy'
  }
});

// Speedometer logic
// Max speed for the speedometer scale (e.g., 150 WPM)
const MAX_SPEED = 150;
const speedRatio = computed(() => Math.min(props.speed.wpm / MAX_SPEED, 1));

// Arc length for 270 degrees is approx 212 (2 * pi * 45 * 270/360)
// Total circumference is ~282.7
const ARC_LENGTH = 212;
const speedDasharray = computed(() => speedRatio.value * ARC_LENGTH);

// Angle for the arrow: -135deg to +135deg
const speedAngle = computed(() => -135 + (speedRatio.value * 270));

// Color from red (slow) to blue (fast)
const speedColor = computed(() => {
  const r = Math.round(255 * (1 - speedRatio.value));
  const g = 50 + Math.round(50 * speedRatio.value);
  const b = 50 + Math.round(205 * speedRatio.value);
  return `rgb(${r}, ${g}, ${b})`;
});

// Accuracy logic
// 100% = bright green, drops to red
const accuracyRatio = computed(() => Math.max(0, (props.accuracy - 50) / 50)); // Scale from 50% to 100%
const accuracyDasharray = computed(() => (props.accuracy / 100) * 282.7);

const accuracyColor = computed(() => {
  // Green at 100%, Red at lower
  const r = Math.round(255 * (1 - accuracyRatio.value));
  const g = Math.round(255 * accuracyRatio.value);
  const b = 50;
  return `rgb(${r}, ${g}, ${b})`;
});

</script>

<style scoped>
.top-stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.3s ease;
}

:root.light-mode .stat-item {
  background: transparent;
  border: none;
  box-shadow: none;
}

.stat-circle-container {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.stat-circle {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  position: absolute;
  top: 10px;
  left: 10px;
  overflow: visible;
}

.circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-linecap: round;
}

:root.light-mode .circle-bg {
  stroke: rgba(0, 0, 0, 0.1);
}

.circle-progress {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease-out, stroke 0.3s ease-out;
}

.stat-info-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.stat-value {
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 1;
  transition: color 0.3s ease-out, text-shadow 0.3s ease-out;
}

.stat-unit {
  font-size: 1rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.3rem;
}

:root.light-mode .stat-unit {
  color: #666;
}
</style>
