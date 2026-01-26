<template>
  <div v-if="show" class="settings-modal" @click.self="$emit('close')">
    <div class="settings-content">
      <div class="settings-header">
        <h2>{{ t.settings }}</h2>
        <button @click="$emit('close')" class="settings-close-btn">×</button>
      </div>
      
      <div class="settings-body">
        <!-- Display Options -->
        <div class="settings-section">
          <h3 class="section-title">{{ t.display }}</h3>
          <div class="toggle-group">
            <label class="toggle-item">
              <span class="toggle-label">{{ t.showVirtualKeyboard }}</span>
              <div class="toggle-switch" :class="{ active: showKeyboard }" @click="handleToggleKeyboard">
                <div class="toggle-slider"></div>
              </div>
            </label>
            <label class="toggle-item">
              <span class="toggle-label">{{ t.showHandsIndicator }}</span>
              <div class="toggle-switch" :class="{ active: showFingerIndicator }" @click="handleToggleFingerIndicator">
                <div class="toggle-slider"></div>
              </div>
            </label>
          </div>
        </div>

        <!-- Practice Mode -->
        <div class="settings-section">
          <h3 class="section-title">{{ t.selectMode }}</h3>
          <div class="mode-selector">
            <button
              @click="$emit('update:mode', 'sequences')"
              :class="['mode-btn', { active: mode === 'sequences' }]"
            >
              {{ t.modeKeySequences }}
            </button>
            <button
              @click="$emit('update:mode', 'text')"
              :class="['mode-btn', { active: mode === 'text' }]"
            >
              {{ t.modeText }}
            </button>
          </div>
        </div>
        
        <!-- Difficulty -->
        <div class="settings-section">
          <h3 class="section-title">{{ t.difficulty }}</h3>
          <select v-model="localDifficulty" @change="handleDifficultyChange" class="settings-select">
            <option value="easy">{{ t.easy }}</option>
            <option value="medium">{{ t.medium }}</option>
            <option value="hard">{{ t.hard }}</option>
          </select>
        </div>
        
        <!-- Categories (only for sequences mode) -->
        <div class="settings-section" v-if="mode === 'sequences'">
          <h3 class="section-title">{{ t.practiceCategories }}</h3>
          <div class="categories-grid">
            <button
              v-for="category in availableCategories"
              :key="category"
              @click="$emit('toggleCategory', category)"
              :class="['category-btn', { active: enabledCategories.has(category) }]"
            >
              {{ t[categoryTranslationMap[category]] || category }}
            </button>
          </div>
        </div>

        <!-- Eye Tracking -->
        <div class="settings-section">
          <h3 class="section-title">Eye Tracking</h3>
          <div class="eye-tracking-inputs">
            <div class="input-group">
              <label class="input-label">Screen Y</label>
              <input
                type="number"
                step="0.001"
                v-model.number="localScreenY"
                @change="handleScreenYChange"
                class="settings-input"
                min="0"
                max="1"
              />
            </div>
            <div class="input-group">
              <label class="input-label">Keyboard Y</label>
              <input
                type="number"
                step="0.001"
                v-model.number="localKeyboardY"
                @change="handleKeyboardYChange"
                class="settings-input"
                min="0"
                max="1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-footer">
        <button @click="$emit('clearStats')" class="btn-danger">
          {{ t.clearStats }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { settingsStorage } from '../utils/storage.js';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  t: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  showKeyboard: {
    type: Boolean,
    required: true,
  },
  showFingerIndicator: {
    type: Boolean,
    required: true,
  },
  availableCategories: {
    type: Array,
    default: () => [],
  },
  enabledCategories: {
    type: Set,
    required: true,
  },
  categoryTranslationMap: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'update:mode', 'update:difficulty', 'update:showKeyboard', 'update:showFingerIndicator', 'toggleCategory', 'clearStats', 'update:eyeTrackingScreenY', 'update:eyeTrackingKeyboardY']);

const localDifficulty = ref(props.difficulty || 'medium');
const localScreenY = ref(settingsStorage.getEyeTrackingScreenY());
const localKeyboardY = ref(settingsStorage.getEyeTrackingKeyboardY());

watch(() => props.difficulty, (newVal) => {
  localDifficulty.value = newVal || 'medium';
});

function handleToggleKeyboard() {
  const newValue = !props.showKeyboard;
  settingsStorage.setShowKeyboard(newValue);
  emit('update:showKeyboard', newValue);
}

function handleToggleFingerIndicator() {
  const newValue = !props.showFingerIndicator;
  settingsStorage.setShowFingerIndicator(newValue);
  emit('update:showFingerIndicator', newValue);
}

function handleDifficultyChange(event) {
  localDifficulty.value = event.target.value;
  emit('update:difficulty', event.target.value);
}

function handleScreenYChange() {
  settingsStorage.setEyeTrackingScreenY(localScreenY.value);
  emit('update:eyeTrackingScreenY', localScreenY.value);
}

function handleKeyboardYChange() {
  settingsStorage.setEyeTrackingKeyboardY(localKeyboardY.value);
  emit('update:eyeTrackingKeyboardY', localKeyboardY.value);
}
</script>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.settings-content {
  background: var(--card-bg, #1e1e1e);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.settings-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color, #fff);
}

.settings-close-btn {
  background: none;
  border: none;
  color: var(--text-secondary, #aaa);
  font-size: 2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
  line-height: 1;
  padding: 0;
}

.settings-close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #fff);
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary, #888);
  margin: 0;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 0;
}

.toggle-label {
  font-size: 0.95rem;
  color: var(--text-color, #fff);
  user-select: none;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 13px;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-switch.active {
  background: var(--accent-color, #4ecdc4);
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(22px);
}

.settings-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #fff);
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.settings-select:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.08);
}

.settings-select:focus {
  outline: none;
  border-color: var(--accent-color, #4ecdc4);
  background-color: rgba(255, 255, 255, 0.08);
}

.settings-select option {
  background: var(--card-bg, #1e1e1e);
  color: var(--text-color, #fff);
  padding: 0.5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

.category-btn {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #fff);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.category-btn.active {
  background: var(--accent-color, #4ecdc4);
  border-color: var(--accent-color, #4ecdc4);
  color: #1a1a1a;
  font-weight: 600;
}

.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.mode-btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #fff);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  font-weight: 500;
}

.mode-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.mode-btn.active {
  background: var(--accent-color, #4ecdc4);
  border-color: var(--accent-color, #4ecdc4);
  color: #1a1a1a;
  font-weight: 600;
}

.settings-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.settings-footer button {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.eye-tracking-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
  font-weight: 500;
}

.settings-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color, #fff);
  font-size: 0.95rem;
  font-family: monospace;
  transition: border-color 0.2s, background-color 0.2s;
}

.settings-input:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.08);
}

.settings-input:focus {
  outline: none;
  border-color: var(--accent-color, #4ecdc4);
  background-color: rgba(255, 255, 255, 0.08);
}

.settings-input::-webkit-inner-spin-button,
.settings-input::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
