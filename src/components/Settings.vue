<template>
  <div v-if="show" class="settings-modal" @click.self="$emit('close')">
    <div class="settings-content">
      <div class="settings-header">
        <h2>{{ t.settings }}</h2>
        <button @click="$emit('close')" class="settings-close-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="settings-body">
        
        <!-- Appearance -->
        <div class="settings-group">
          <h3 class="group-title">{{ t.display || 'Appearance' }}</h3>
          <div class="settings-card">
            <div class="setting-row" @click="handleThemeToggle">
              <div class="setting-info">
                <span class="setting-label">{{ t.theme || 'Theme' }}</span>
                <span class="setting-desc">{{ isDarkMode ? t.darkMode : t.lightMode }}</span>
              </div>
              <div class="toggle-switch" :class="{ active: isDarkMode }">
                <div class="toggle-slider"></div>
              </div>
            </div>
            <div class="setting-divider"></div>
            <div class="setting-row" @click="handleToggleKeyboard">
              <div class="setting-info">
                <span class="setting-label">{{ t.showVirtualKeyboard }}</span>
              </div>
              <div class="toggle-switch" :class="{ active: showKeyboard }">
                <div class="toggle-slider"></div>
              </div>
            </div>
            <div class="setting-divider"></div>
            <div class="setting-row" @click="handleToggleFingerIndicator">
              <div class="setting-info">
                <span class="setting-label">{{ t.showHandsIndicator }}</span>
              </div>
              <div class="toggle-switch" :class="{ active: showFingerIndicator }">
                <div class="toggle-slider"></div>
              </div>
            </div>
            <div class="setting-divider"></div>
            <div class="setting-row" @click="handleToggleMeters">
              <div class="setting-info">
                <span class="setting-label">{{ t.showMeters }}</span>
              </div>
              <div class="toggle-switch" :class="{ active: showMeters }">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Practice Settings -->
        <div class="settings-group">
          <h3 class="group-title">{{ t.practice || 'Practice' }}</h3>
          <div class="settings-card">
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">{{ t.selectMode }}</span>
              </div>
              <div class="segmented-control">
                <button
                  @click="$emit('update:mode', 'sequences')"
                  :class="['segment-btn', { active: mode === 'sequences' }]"
                >
                  {{ t.modeKeySequences }}
                </button>
                <button
                  @click="$emit('update:mode', 'text')"
                  :class="['segment-btn', { active: mode === 'text' }]"
                >
                  {{ t.modeText }}
                </button>
              </div>
            </div>
            <div class="setting-divider"></div>
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">{{ t.difficulty }}</span>
              </div>
              <div class="difficulty-slider-container">
                <div class="difficulty-labels">
                  <span :class="{ active: localDifficulty === 'easy' }" @click="setDifficulty('easy')">{{ t.easy }}</span>
                  <span :class="{ active: localDifficulty === 'medium' }" @click="setDifficulty('medium')">{{ t.medium }}</span>
                  <span :class="{ active: localDifficulty === 'hard' }" @click="setDifficulty('hard')">{{ t.hard }}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="1" 
                  :value="['easy', 'medium', 'hard'].indexOf(localDifficulty)"
                  @input="handleDifficultySliderChange"
                  class="custom-range"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Categories (only for sequences mode) -->
        <div class="settings-group" v-if="mode === 'sequences'">
          <h3 class="group-title">{{ t.practiceCategories }}</h3>
          <div class="settings-card categories-card">
            <div class="categories-grid">
              <button
                v-for="category in availableCategories"
                :key="category"
                @click="$emit('toggleCategory', category)"
                :class="['category-chip', { active: enabledCategories.has(category) }]"
                :title="t[categoryTranslationMap[category]] || category"
              >
                {{ getCategorySymbol(category) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced -->
        <div class="settings-group">
          <h3 class="group-title">{{ t.advanced || 'Advanced' }}</h3>
          <div class="settings-card">
            <div class="setting-row vertical-slider-row">
              <div class="setting-info">
                <span class="setting-label">Screen Y</span>
                <span class="setting-desc">{{ localScreenY.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="localScreenY"
                @input="handleScreenYChange"
                class="custom-range flex-range"
              />
            </div>
            <div class="setting-divider"></div>
            <div class="setting-row vertical-slider-row">
              <div class="setting-info">
                <span class="setting-label">Keyboard Y</span>
                <span class="setting-desc">{{ localKeyboardY.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="localKeyboardY"
                @input="handleKeyboardYChange"
                class="custom-range flex-range"
              />
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-group">
          <div class="settings-card danger-card">
            <button @click="$emit('clearStats')" class="btn-danger-text">
              {{ t.clearStats }}
            </button>
          </div>
        </div>

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
  showMeters: {
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
  isDarkMode: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close', 'update:mode', 'update:difficulty', 'update:showKeyboard', 'update:showFingerIndicator', 'update:showMeters', 'toggleCategory', 'clearStats', 'update:eyeTrackingScreenY', 'update:eyeTrackingKeyboardY', 'update:theme']);

const localDifficulty = ref(props.difficulty || 'medium');
const localScreenY = ref(settingsStorage.getEyeTrackingScreenY());
const localKeyboardY = ref(settingsStorage.getEyeTrackingKeyboardY());

watch(() => props.difficulty, (newVal) => {
  localDifficulty.value = newVal || 'medium';
});

function handleThemeToggle() {
  const newTheme = props.isDarkMode ? 'light' : 'dark';
  settingsStorage.setTheme(newTheme);
  emit('update:theme', newTheme);
}

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

function handleToggleMeters() {
  const newValue = !props.showMeters;
  settingsStorage.setShowMeters(newValue);
  emit('update:showMeters', newValue);
}

function handleDifficultySliderChange(event) {
  const levels = ['easy', 'medium', 'hard'];
  const newDiff = levels[event.target.value];
  localDifficulty.value = newDiff;
  emit('update:difficulty', newDiff);
}

function setDifficulty(level) {
  localDifficulty.value = level;
  emit('update:difficulty', level);
}

const getCategorySymbol = (category) => {
  const isUk = props.t.easy === 'Легко';
  const symbols = {
    topRow: isUk ? 'верхній ряд' : 'top row',
    homeRow: isUk ? 'середній ряд' : 'home row',
    bottomRow: isUk ? 'нижній ряд' : 'bottom row',
    simpleWords: isUk ? 'прості слова' : 'simple words',
    numbers: isUk ? 'цифри' : 'numbers',
    capitals: isUk ? 'великі літери' : 'capital letters',
    punctuation: isUk ? 'пунктуація' : 'punctuation',
    letterCombinations: isUk ? 'комбінації літер' : 'letter combinations',
    mixedRows: isUk ? 'змішані рядки' : 'mixed rows',
    commonWords: isUk ? 'поширені слова' : 'common words',
    numbersAdvanced: isUk ? 'цифри' : 'numbers',
    capitalsAdvanced: isUk ? 'великі літери' : 'capital letters',
    punctuationAdvanced: isUk ? 'пунктуація' : 'punctuation',
    symbols: isUk ? 'символи' : 'symbols',
    complexCombinations: isUk ? 'складні комбінації' : 'complex combinations',
    programming: isUk ? 'програмування' : 'programming',
    mixedAdvanced: isUk ? 'мікс' : 'mix',
  };
  return symbols[category] || category;
};

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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-content {
  background: var(--bg-color, #1e1e1e);
  border-radius: 20px;
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  background: var(--card-bg, #2a2a2a);
}

.settings-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color, #fff);
  letter-spacing: -0.02em;
}

.settings-close-btn {
  background: var(--btn-secondary-bg, rgba(255, 255, 255, 0.1));
  border: none;
  color: var(--text-color, #fff);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  padding: 0;
}

.settings-close-btn:hover {
  background: var(--card-border, rgba(255, 255, 255, 0.2));
  transform: scale(1.05);
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-color, #1a1a1a);
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary, #888);
  margin: 0 0 0 0.5rem;
}

.settings-card {
  background: var(--card-bg, #2a2a2a);
  border-radius: 12px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  overflow: hidden;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  min-height: 3.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.vertical-slider-row {
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  cursor: default;
}

.vertical-slider-row .setting-info {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.setting-row:hover {
  background-color: var(--border-color, rgba(255, 255, 255, 0.02));
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color, #fff);
}

.setting-desc {
  font-size: 0.75rem;
  color: var(--text-secondary, #aaa);
}

.setting-divider {
  height: 1px;
  background: var(--border-color, rgba(255, 255, 255, 0.05));
  margin: 0 1.25rem;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  background: var(--progress-bg, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  border: 1px solid transparent;
}

.toggle-switch.active {
  background: var(--accent-color);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-slider {
  transform: translateX(22px);
}

.segmented-control {
  display: flex;
  background: var(--progress-bg, rgba(0, 0, 0, 0.2));
  border-radius: 8px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.segment-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #aaa);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.segment-btn:hover {
  color: var(--text-color, #fff);
}

.segment-btn.active {
  background: var(--card-bg, #333);
  color: var(--text-color, #fff);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:root.light-mode .segment-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:root.light-mode .segmented-control {
  background: #e2e8f0;
}

.inline-select {
  width: auto;
  min-width: 120px;
  padding: 0.5rem 2rem 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background-color: var(--input-bg, rgba(0, 0, 0, 0.2));
  color: var(--text-color, #fff);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  transition: all 0.2s;
}

:root.light-mode .inline-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230f172a' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

.inline-select:hover {
  border-color: var(--text-secondary, rgba(255, 255, 255, 0.2));
}

.inline-select:focus {
  outline: none;
  border-color: var(--accent-color);
}

.difficulty-slider-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 160px;
}

.difficulty-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.difficulty-labels span {
  font-size: 0.75rem;
  color: var(--text-secondary, #aaa);
  cursor: pointer;
  transition: all 0.2s;
}

.difficulty-labels span.active {
  color: var(--accent-color);
  font-weight: 600;
}

.custom-range {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--progress-bg, rgba(255, 255, 255, 0.1));
  border-radius: 3px;
  outline: none;
  transition: all 0.2s;
}

:root.light-mode .custom-range {
  background: #cbd5e1;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s;
}

.custom-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.custom-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s;
}

.custom-range::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.flex-range {
  width: 100%;
  margin-top: 0.25rem;
}

.categories-card {
  padding: 1rem;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-chip {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background: var(--input-bg, rgba(0, 0, 0, 0.2));
  color: var(--text-secondary, #aaa);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

:root.light-mode .category-chip {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #64748b;
}

.category-chip:hover {
  border-color: var(--text-secondary, rgba(255, 255, 255, 0.3));
  color: var(--text-color, #fff);
}

:root.light-mode .category-chip:hover {
  border-color: #94a3b8;
  color: #0f172a;
}

.category-chip.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: #fff;
}

:root.light-mode .category-chip.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: var(--bg-color); /* Changed to use bg-color for better contrast */
}

.compact-input {
  width: 100px;
  padding: 0.5rem;
  text-align: right;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background: var(--input-bg, rgba(0, 0, 0, 0.2));
  color: var(--text-color, #fff);
  font-family: monospace;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.compact-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.danger-card {
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
}

.btn-danger-text {
  background: transparent;
  color: #ef4444;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  width: 100%;
}

.btn-danger-text:hover {
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 600px) {
  .settings-content {
    border-radius: 16px;
    max-height: 95vh;
  }
  
  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .segmented-control {
    width: 100%;
  }
  
  .segment-btn {
    flex: 1;
  }
  
  .inline-select, .compact-input {
    width: 100%;
    text-align: left;
  }
}
</style>