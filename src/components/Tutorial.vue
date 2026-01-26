<template>
  <div v-if="show" class="tutorial-overlay" @click.self="close">
    <div class="tutorial-modal">
      <div class="tutorial-header">
        <h2>{{ t.tutorialTitle }}</h2>
        <button @click="close" class="close-btn">×</button>
      </div>
      
      <div class="tutorial-content">
        <div v-if="currentSlide === 0" class="tutorial-slide">
          <div class="welcome-content">
            <div class="welcome-icon">⌨️</div>
            <h3>{{ t.tutorialWelcome }}</h3>
            <p>{{ t.tutorialWelcomeText }}</p>
            <div class="welcome-features">
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>{{ t.tutorialRule3 }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>{{ t.tutorialRule5 }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👁️</span>
                <span>{{ t.eyeTrackingDescription }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="currentSlide === 1" class="tutorial-slide">
          <h3>{{ t.tutorialHandPlacement }}</h3>
          <p>{{ t.tutorialHandPlacementText }}</p>
          <div class="tutorial-hands">
            <img :src="handsPositionSvg" alt="Hands position" class="hands-position-image" />
          </div>
        </div>
        
        <div v-if="currentSlide === 2" class="tutorial-slide">
          <h3>{{ t.tutorialKeyColors }}</h3>
          <p>{{ t.tutorialKeyColorsText }}</p>
          <div class="color-legend">
            <div class="legend-item">
              <div class="legend-color finger-pinky-l"></div>
              <span>{{ t.fingerPinky }} ({{ language === 'uk' ? 'мізинець' : 'pinky' }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color finger-ring-l"></div>
              <span>{{ t.fingerRing }} ({{ language === 'uk' ? 'безіменний' : 'ring' }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color finger-middle-l"></div>
              <span>{{ t.fingerMiddle }} ({{ language === 'uk' ? 'середній' : 'middle' }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color finger-index-l"></div>
              <span>{{ t.fingerIndex }} ({{ language === 'uk' ? 'вказівний' : 'index' }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color finger-thumb"></div>
              <span>{{ t.fingerThumb }} ({{ language === 'uk' ? 'великий' : 'thumb' }})</span>
            </div>
          </div>
        </div>
        
        <div v-if="currentSlide === 3" class="tutorial-slide">
          <h3>{{ t.tutorialRules }}</h3>
          <ul class="rules-list">
            <li>{{ t.tutorialRule1 }}</li>
            <li>{{ t.tutorialRule2 }}</li>
            <li>{{ t.tutorialRule3 }}</li>
            <li>{{ t.tutorialRule4 }}</li>
            <li>{{ t.tutorialRule5 }}</li>
          </ul>
        </div>
        
        <div v-if="currentSlide === 4" class="tutorial-slide">
          <h3>{{ t.eyeTracking }}</h3>
          <p>{{ t.eyeTrackingDescription }}</p>
          <div class="eye-tracking-info">
            <div class="info-item">
              <span class="info-icon">👁️</span>
              <div class="info-content">
                <strong>{{ t.initializingEyeTracking }}</strong>
                <p>{{ t.initializingEyeTrackingMessage }}</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">🎯</span>
              <div class="info-content">
                <strong>{{ t.calibrateScreen }}</strong>
                <p>{{ t.calibrateScreenMessage }}</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">⌨️</span>
              <div class="info-content">
                <strong>{{ t.calibrateKeyboard }}</strong>
                <p>{{ t.calibrateKeyboardMessage }}</p>
              </div>
            </div>
            <div class="info-note">
              <p>{{ t.lookingAtKeyboardMessage }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tutorial-footer">
        <div class="tutorial-dots">
          <span
            v-for="(_, index) in totalSlides"
            :key="index"
            class="dot"
            :class="{ active: index === currentSlide }"
            @click="currentSlide = index"
          ></span>
        </div>
        <div class="tutorial-actions">
          <button v-if="currentSlide > 0" @click="prevSlide" class="btn-secondary">
            {{ t.previous }}
          </button>
          <button v-if="currentSlide < totalSlides - 1" @click="nextSlide" class="btn-primary">
            {{ t.next }}
          </button>
          <button v-else @click="close" class="btn-primary">
            {{ t.start }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import handsPositionSvg from '../assets/hands_position.svg?url';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'en',
  },
  t: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

const currentSlide = ref(0);
const totalSlides = 5;

function nextSlide() {
  if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++;
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
}

function close() {
  emit('close');
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.tutorial-modal {
  background: var(--card-bg, #2a2a2a);
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  height: 85vh;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--card-border, #333);
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--card-border, #333);
  flex-shrink: 0;
}

.tutorial-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--accent-color, #4ecdc4);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color, #fff);
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: var(--card-border, #333);
}

.tutorial-content {
  flex: 1;
  padding: 1rem 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.tutorial-slide {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.tutorial-slide h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: var(--accent-color, #4ecdc4);
  flex-shrink: 0;
}

.tutorial-slide p {
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: var(--text-color, #fff);
  flex-shrink: 0;
  font-size: 0.9rem;
}

.tutorial-hands {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  flex-shrink: 1;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.hands-position-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.home-row-keys {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.key-demo {
  min-width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid var(--card-border, #333);
}

.color-legend {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
  justify-content: center;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  font-size: 0.85rem;
}

.legend-color {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  flex-shrink: 0;
}

/* Finger colors matching keyboard */
.finger-pinky-l {
  background: #ff6b6b;
  color: white;
}

.finger-ring-l {
  background: #4ecdc4;
  color: white;
}

.finger-middle-l {
  background: #45b7d1;
  color: white;
}

.finger-index-l {
  background: #96ceb4;
  color: white;
}

.finger-thumb {
  background: #ffeaa7;
  color: #2d3436;
}

.finger-index-r {
  background: #a8e6cf;
  color: #2d3436;
}

.finger-middle-r {
  background: #ffd93d;
  color: #2d3436;
}

.finger-ring-r {
  background: #ff9ff3;
  color: white;
}

.finger-pinky-r {
  background: #c44569;
  color: white;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.rules-list li {
  padding: 0.35rem 0;
  padding-left: 1.75rem;
  position: relative;
  line-height: 1.4;
  color: var(--text-color, #fff);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.rules-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-color, #4ecdc4);
  font-weight: bold;
  font-size: 1.2rem;
}

.tutorial-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid var(--card-border, #333);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
}

.tutorial-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--card-border, #333);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--accent-color, #4ecdc4);
  transform: scale(1.2);
}

.tutorial-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent-color, #4ecdc4);
  color: white;
}

.btn-primary:hover {
  background: #45b7d1;
}

.btn-secondary {
  background: var(--btn-secondary-bg, #444);
  color: white;
}

.btn-secondary:hover {
  background: #555;
}

.welcome-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  justify-content: center;
  gap: 0.75rem;
  min-height: 0;
  overflow: hidden;
}

.welcome-icon {
  font-size: 3rem;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
}

.welcome-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 500px;
  flex-shrink: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.eye-tracking-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  justify-content: center;
}

.info-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  align-items: flex-start;
  flex-shrink: 0;
}

.info-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-content strong {
  display: block;
  color: var(--accent-color, #4ecdc4);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-content p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.3;
  color: var(--text-color, #ccc);
}

.info-note {
  margin-top: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(78, 205, 196, 0.3);
  flex-shrink: 0;
}

.info-note p {
  margin: 0;
  color: var(--accent-color, #4ecdc4);
  font-size: 0.8rem;
  line-height: 1.3;
}
</style>
