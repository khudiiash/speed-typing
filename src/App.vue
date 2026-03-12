<template>
  <div class="app">
    <header class="app-header">
      <div class="logo-container" @click="handleLogoClick" :title="t.restart || 'Restart exercise'">
        <svg class="keyboard-logo" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M13.4,70.3c-0.6,0.2-1.7,1.1-2.3,1.9L10,73.7V128v54.4l1.8,1.8l1.8,1.8H128h114.3l1.8-1.8l1.8-1.8V128V73.5l-1.6-1.7l-1.6-1.8l-114.2-0.1C65.9,69.8,14,70,13.4,70.3z M43,90c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-3.6,0-4-0.1-4.9-1.3c-1.2-1.9-0.9-8.2,0.6-9.2C35.5,88.8,41.7,88.9,43,90z M62.2,90c1,0.7,1.2,1.3,1.2,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.6,0.9-5.5,5.6-5.5C59.7,89.1,61.3,89.4,62.2,90z M81.6,90c1,0.7,1.2,1.3,1.2,4.4c0,5.3-0.6,6-5.5,6c-5.2,0-5.8-0.6-5.8-5.5s0.9-5.8,5.6-5.8C79.1,89.1,80.7,89.4,81.6,90z M101.1,90.2c0.9,0.9,1.1,1.8,1.1,4.5c0,5-0.7,5.8-5.5,5.8c-5.2,0-5.8-0.6-5.8-5.7c0-4.9,0.8-5.6,5.8-5.6C99.3,89.1,100.2,89.3,101.1,90.2z M120.5,90.3c1,1,1.1,1.6,0.9,4.9c-0.3,4.7-0.9,5.3-5.9,5.3c-4.8,0-5.3-0.5-5.3-5.5c0-5.2,0.6-5.8,5.5-5.8C118.7,89.1,119.6,89.3,120.5,90.3z M139.1,89.6c1.1,0.8,1.8,2.7,1.8,5.2c0,2.5-0.7,4.5-1.8,5.2c-0.9,0.6-7.3,0.5-8.5-0.1c-0.9-0.5-1-1.2-1-4.7c0-5.4,0.5-6.1,5.3-6.1C136.9,89.1,138.8,89.3,139.1,89.6z M158.8,90c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-3.6,0-4-0.1-4.8-1.3c-1.2-1.9-0.9-8.2,0.6-9.2C151.3,88.8,157.5,88.9,158.8,90z M178.2,90c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.7,0.9-5.5,5.8-5.5C176.2,89.1,177.5,89.4,178.2,90z M197.4,90c1,0.7,1.2,1.3,1.2,4.4c0,5.3-0.6,6-5.5,6c-5.2,0-5.8-0.6-5.8-5.5s0.9-5.8,5.5-5.8C195,89.1,196.6,89.4,197.4,90z M222.8,90.2c0.3,0.6,0.5,2.6,0.5,4.6c0,2.9-0.2,3.8-1.1,4.7c-1,1-1.6,1.1-8.4,0.9c-5.7-0.1-7.4-0.3-7.8-1c-0.8-1.2-0.6-8.8,0.1-9.6c0.4-0.4,3.1-0.6,8.4-0.6C221.6,89.1,222.3,89.2,222.8,90.2z M67.8,112.1c0.8,0.7,1,1.7,1,4.6c0,5.1-0.6,5.8-5.4,5.8c-5.1,0-5.7-0.5-5.7-5.7c0-3.4,0.2-4.3,1-4.9C60.3,110.8,66.5,111,67.8,112.1z M87.2,112.1c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.7,0.9-5.5,5.8-5.5C85.2,111.2,86.5,111.5,87.2,112.1z M106.3,112.1c1,0.7,1.2,1.3,1.2,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.6,0.9-5.5,5.5-5.5C103.9,111.2,105.5,111.5,106.3,112.1z M125.8,112.3c0.9,0.9,1.1,1.8,1.1,4.5c0,5-0.7,5.8-5.5,5.8c-5.2,0-5.8-0.6-5.8-5.7c0-4.9,0.8-5.6,5.8-5.6C124.1,111.2,125,111.4,125.8,112.3z M145.2,112.3c0.9,0.9,1.1,1.8,1.1,4.6c0,4.8-0.9,5.7-5.8,5.7s-5.5-0.6-5.5-5.6c0-5.1,0.6-5.8,5.5-5.8C143.5,111.2,144.4,111.4,145.2,112.3z M164.3,111.9c1.1,0.8,1.8,5.2,1.2,7.6c-0.6,2.4-1.7,3-5.7,3c-4.9,0-5.4-0.5-5.4-5.5c0-5.2,0.6-5.8,5.4-5.8C161.9,111.2,163.8,111.5,164.3,111.9z M183.6,112.1c0.8,0.7,1,1.7,1,4.8c0,5.1-0.5,5.6-5.3,5.6c-4.6,0-5.5-0.6-5.9-4.2c-0.3-3.2,0.1-5.1,1.3-6.2C175.8,110.8,182.3,110.9,183.6,112.1z M203,112.1c0.8,0.7,1,1.7,1,4.6c0,5.1-0.6,5.8-5.5,5.8c-5,0-5.8-0.8-5.8-5.7c0-4.8,0.9-5.7,5.8-5.7C201,111.2,202.3,111.5,203,112.1z M222.4,112.1c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.7,0.9-5.5,5.8-5.5C220.4,111.2,221.7,111.5,222.4,112.1z M49,112.6c0.6,1.6,0.3,8.6-0.3,9.3c-0.4,0.4-3,0.6-7.8,0.6c-8.3,0-8.2,0.1-8.2-5.4s-0.1-5.4,8.6-5.4C47.5,111.8,48.7,111.9,49,112.6z M73.6,134.4c1,1,1.1,1.6,0.9,4.9c-0.3,4.7-0.9,5.3-5.9,5.3c-4.8,0-5.3-0.5-5.3-5.5c0-5.2,0.6-5.8,5.5-5.8C71.9,133.3,72.7,133.5,73.6,134.4z M92.7,134.2c0.6,0.6,0.9,1.9,0.9,4.8c0,5.1-0.5,5.7-5.2,5.7c-5.3,0-5.6-0.3-5.6-5.4c0-5.4,0.4-5.9,5.4-5.9C90.8,133.3,92.1,133.5,92.7,134.2z M111.9,134.2c0.8,0.7,1,1.7,1,4.6c0,5.1-0.6,5.8-5.5,5.8c-5,0-5.8-0.8-5.8-5.7c0-4.8,0.9-5.7,5.8-5.7C110,133.3,111.2,133.6,111.9,134.2z M131.3,134.2c0.8,0.7,1,1.7,1,4.6c0,5.2-0.6,5.8-5.7,5.8c-4.9,0-5.6-0.8-5.6-5.8c0-4.7,0.9-5.6,5.8-5.6C129.3,133.3,130.6,133.6,131.3,134.2z M150.7,134.2c0.8,0.6,1,1.7,1,4.4c0,5.2-0.7,6-5.5,6c-5.2,0-5.8-0.6-5.8-5.5c0-5,0.8-5.8,5.8-5.8C148.7,133.3,150,133.6,150.7,134.2z M170,134.4c0.9,0.9,1.1,1.8,1.1,4.6c0,4.8-0.9,5.7-5.8,5.7c-4.9,0-5.5-0.6-5.5-5.5c0-5.1,0.6-5.8,5.5-5.8C168.2,133.3,169.2,133.5,170,134.4z M189.5,134.4c1,1,1.1,1.6,0.9,4.9c-0.3,4.7-0.9,5.3-5.8,5.3c-4.8,0-5.4-0.6-5.4-5.5c0-5.1,0.6-5.8,5.5-5.8C187.7,133.3,188.6,133.5,189.5,134.4z M54.1,134.5c0.4,0.4,0.6,2.3,0.6,4.7c0,2.5-0.3,4.4-0.6,4.7c-0.4,0.4-3.4,0.6-10.1,0.6c-6.7,0-9.7-0.2-10.1-0.6c-0.4-0.4-0.6-2.3-0.6-4.9c0-3.4,0.2-4.3,1-4.7C35.5,133.6,53.3,133.7,54.1,134.5z M222.5,135c0.5,0.8,0.9,2.4,0.9,4.2c0,1.8-0.3,3.4-0.9,4.2c-0.8,1.1-1.1,1.2-11.7,1.2c-7.8,0-11-0.2-11.5-0.6c-0.9-0.9-0.9-8.6,0-9.5c0.5-0.5,3.8-0.6,11.5-0.6C221.4,133.9,221.7,133.9,222.5,135z M43,156.3c0.8,0.7,1,1.7,1,4.6c0,5.1-0.6,5.8-5.5,5.8c-5,0-5.8-0.8-5.8-5.7c0-4.8,0.9-5.7,5.8-5.7C41,155.4,42.3,155.7,43,156.3z M62.4,156.3c0.8,0.7,1,1.7,1,4.6c0,5.1-0.6,5.8-5.5,5.8c-5,0-5.8-0.8-5.8-5.7c0-4.8,0.9-5.7,5.8-5.7C60.4,155.4,61.7,155.7,62.4,156.3z M81.8,156.3c0.8,0.6,1,1.7,1,4.4c0,5.2-0.7,6-5.5,6c-5.2,0-5.8-0.6-5.8-5.5c0-5.2,0.6-5.8,5.6-5.8C79.8,155.4,81,155.6,81.8,156.3z M163.9,156.8c1.2,1.9,0.9,8.2-0.6,9.2c-0.9,0.6-7.1,0.8-35.9,0.8c-31,0-35-0.1-35.7-0.9c-0.6-0.6-0.9-1.9-0.9-4.8c0-2.9,0.2-4.2,0.9-4.8c0.8-0.8,4.7-0.9,36-0.9H163L163.9,156.8z M183.6,156.3c1.3,1.2,1.4,8,0.1,9.4c-1.2,1.3-8,1.4-9.4,0.1c-1.3-1.2-1.4-8-0.1-9.4C175.4,155,182.1,155,183.6,156.3z M202.9,156.5c0.9,0.9,1.1,1.8,1.1,4.5c0,5-0.7,5.8-5.5,5.8c-5.2,0-5.8-0.6-5.8-5.5c0-5.1,0.6-5.8,5.5-5.8C201.1,155.4,202,155.6,202.9,156.5z M222,156.2c0.8,0.6,1.1,1.6,1.2,4.5c0.3,5.2-0.5,6-5.8,6c-5,0-5.4-0.5-5.4-5.5c0-5.2,0.6-5.8,5.4-5.8C219.7,155.4,221.4,155.7,222,156.2z"/>
        </svg>
      </div>

      <div class="header-actions">
        <select v-model="language" @change="handleLanguageChange" class="language-select">
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
        <button 
          @click="handleEyeTrackerToggle" 
          class="eye-tracker-btn"
          :class="{ active: eyeTrackingEnabled }"
          :title="eyeTrackingEnabled ? (t.eyeTracking || 'Eye Tracking') + ' (On)' : (t.eyeTracking || 'Eye Tracking') + ' (Off)'"
        >
          <svg class="eyes-icon" viewBox="0 0 256 256" width="32" height="32">
            <!-- Eye outline from eye.svg -->
            <path 
              class="eye" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="8"
              :opacity="eyeTrackingEnabled ? 1 : 0.3"
              d="M128.5,211.2c-52,0-97.7-31.2-116.4-79L10,128l1-4.2c19.8-47.8,65.5-79,117.5-79c50.9,0,97.7,32.2,116.4,79 l1,4.2l-2.1,4.2C226.2,178.9,179.5,211.2,128.5,211.2z M32.9,128c16.6,37.4,54.1,62.4,95.6,62.4c41.6,0,79-25,95.6-62.4 c-16.6-37.4-54.1-62.4-95.6-62.4C86.9,65.6,49.5,90.6,32.9,128z"
            />
            <!-- Iris/Pupil that moves based on eye position -->
            <circle 
              class="pupil" 
              cx="128" 
              :cy="eyeTrackingEnabled && eyeTrackingReady ? (168 - currentEyePosition * 80) : 128" 
              r="20" 
              fill="currentColor"
              :opacity="eyeTrackingEnabled && eyeTrackingReady ? 1 : 0"
            />
            <!-- Closed eye when not active -->
            <g v-if="!eyeTrackingEnabled" class="closed-eyes">
              <line x1="50" y1="128" x2="206" y2="128" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
            </g>
          </svg>
        </button>
        <button @click="showTutorial = true" class="tutorial-btn" :title="t.tutorial">
          <svg class="book-icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M51.1,103.9v76.4l3.3,0.4c1.7,0.2,5,0.4,7.2,0.4c4.9,0,19.2,1.5,27.1,2.8c8.5,1.4,19,4.1,27,6.9c3.9,1.4,7.1,2.5,7.3,2.5c0.1,0,0.2-30.7,0.2-68.2c0-54-0.2-68.2-0.7-68.5c-0.4-0.2-14.9-6.1-32.2-13.2C72.9,36.5,57.1,30,55,29.1l-3.9-1.6L51.1,103.9L51.1,103.9z"/>
            <path fill="currentColor" d="M169.5,42.2l-35.7,14.7l-0.2,68.2c-0.1,37.6,0,68.3,0.1,68.3c0.2,0,2.5-0.9,5.1-1.8c14.9-5.8,32.7-9.1,55.5-10.5c5.9-0.4,10.8-0.7,10.9-0.8c0.1-0.1,0.1-34.6,0.1-76.5l-0.2-76.2L169.5,42.2z"/>
            <path fill="currentColor" d="M10,135.1c0.1,50.5,0.4,74.6,0.8,74.5c0.4-0.1,7.1-0.4,15.1-0.8c28.3-1.4,54.4,1.4,71.9,7.5c2.9,1,8.5,3.4,12.4,5.3c9.6,4.9,14.8,6.8,17.8,6.8c3.1,0,8.2-1.9,17.6-6.6c19.1-9.6,39.2-13.3,71.6-13.2c9.3,0.1,19.6,0.3,22.9,0.6l6,0.5v-74.6c0-59.5-0.2-74.6-0.7-74.3c-0.4,0.1-4.9,1.5-9.8,3l-9.1,2.7v64.4c0,69.8,0.1,67-3.3,68.8c-0.9,0.5-6.5,0.9-16.7,1.2c-8.4,0.2-18,0.7-21.2,1.1c-19.9,2.3-36.1,7.1-51,14.9l-5.9,3.1l-8.9-4.4c-20.5-10.1-38.5-13.9-70.2-14.7l-15.9-0.4l-1.7-1.7l-1.7-1.7l-0.2-65.4l-0.1-65.4l-9.1-2.6c-5-1.5-9.4-2.8-9.8-3C10,60.6,9.9,75.5,10,135.1z"/>
          </svg>
        </button>
        <button @click="view = 'globalStats'" class="stats-header-btn" :title="t.globalStatistics || t.stats">
          <svg class="chart-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </button>
        <button @click="showSettings = !showSettings" class="settings-btn" :title="t.settings">
          <svg class="gear-icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M233.1,104.6h-12.5c-2.3-9.1-5.9-17.6-10.7-25.3l9-9c2.4-2.4,3.8-5.7,3.8-9.1s-1.3-6.7-3.8-9.1l-15-15c-4.9-4.9-13.4-4.9-18.2,0l-9.4,9.3c-7.7-4.5-15.9-7.9-25-10.1V22.9c0-7.1-5.7-12.9-12.8-12.9h-21.2c-7.1,0-12.7,5.8-12.7,12.9v13.4c-9.1,2.2-17.3,5.7-25,10.1l-9.4-9.3c-4.9-4.9-13.4-4.9-18.2,0l-15,15c-2.4,2.4-3.8,5.7-3.8,9.1c0,3.4,1.3,6.7,3.8,9.1l9,9c-4.7,7.8-8.4,16.3-10.7,25.3H22.8c-7.1,0-12.8,5.7-12.8,12.8v21.2c0,7.1,5.7,12.7,12.8,12.7h12.5c2.3,9.1,5.9,17.6,10.7,25.4l-9,9.1c-2.4,2.4-3.8,5.7-3.8,9.1c0,3.4,1.3,6.7,3.8,9.1l15,15c2.4,2.4,5.7,3.8,9.1,3.8c3.4,0,6.7-1.3,9.1-3.8l9.4-9.3c7.7,4.5,16,7.9,25,10.2v13.4c0,7.1,5.6,12.8,12.7,12.8h21.2c7.1,0,12.8-5.7,12.8-12.8v-13.4c9.1-2.2,17.3-5.7,25-10.1l9.3,9.3c2.4,2.4,5.7,3.8,9.1,3.8s6.7-1.3,9.1-3.8l15-15c2.4-2.4,3.8-5.7,3.8-9.1c0-3.4-1.3-6.7-3.8-9.1l-9-9.1c4.7-7.8,8.4-16.3,10.7-25.4h12.5c7.1,0,12.9-5.6,12.9-12.7v-21.2C246.1,110.4,240.2,104.6,233.1,104.6z M128,168.4c-22.5,0-40.7-18.1-40.7-40.3c0-22.3,18.2-40.3,40.7-40.3c22.5,0,40.7,18,40.7,40.3C168.7,150.3,150.5,168.4,128,168.4z"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="app-content">
      <!-- Settings Modal -->
      <Settings
        :show="showSettings"
        :t="t"
        :mode="mode"
        :difficulty="difficulty"
        :show-keyboard="showKeyboard"
        :show-finger-indicator="showFingerIndicator"
        :available-categories="availableCategories"
        :enabled-categories="enabledCategories"
        :category-translation-map="categoryTranslationMap"
        :is-dark-mode="isDarkMode"
        @close="showSettings = false"
        @update:mode="selectMode"
        @update:difficulty="handleDifficultyChange"
        @update:show-keyboard="showKeyboard = $event"
        @update:show-finger-indicator="showFingerIndicator = $event"
        @update:eye-tracking-screen-y="eyeTrackingScreenY = $event"
        @update:eye-tracking-keyboard-y="eyeTrackingKeyboardY = $event"
        @update:theme="handleThemeChange"
        @toggle-category="toggleCategory"
        @clear-stats="handleClearStats"
      />

      <!-- Typing View -->
      <div v-if="view === 'typing'" class="typing-view" @click="handleTypingViewClick">
        <div class="typing-layout">
          <div class="side-stats left-stats">
            <TopStats
              :is-typing="isTyping"
              :speed="currentSpeed"
              :accuracy="currentAccuracy"
              :t="t"
              type="speed"
            />
          </div>
          
          <TypingArea
            ref="typingAreaRef"
            :target-text="currentText"
            :source-url="textSourceUrl"
            :source-title="textSourceTitle"
            :is-loading="isLoadingText"
            :is-active="isTyping && !isLookingAtKeyboard"
            :is-paused="isPaused || isLookingAtKeyboard"
            :time-remaining="timeRemaining"
            :language="language"
            :t="t"
            :eye-tracking-avg-y="eyeTrackingAvgY"
            :eye-tracking-screen-y="eyeTrackingScreenY"
            :eye-tracking-keyboard-y="eyeTrackingKeyboardY"
            :eye-tracking-enabled="eyeTrackingEnabled"
            :eye-tracking-ready="eyeTrackingReady"
            :is-looking-at-keyboard="isLookingAtKeyboard"
            @input="handleTypingInput"
            @keydown="handleKeyDown"
            @keyup="handleKeyUp"
            @complete="handleComplete"
            @update:activeKey="activeKey = $event"
            @update:errorKey="errorKey = $event"
            @update:expectedKey="expectedKey = $event"
            @update:mistakes="handleMistakesUpdate"
            @update:shiftPressed="isShiftPressed = $event"
            @update:combo="handleComboUpdate"
          />
          
          <div class="side-stats right-stats">
            <TopStats
              :is-typing="isTyping"
              :speed="currentSpeed"
              :accuracy="currentAccuracy"
              :t="t"
              type="accuracy"
            />
          </div>
        </div>
        
        <Keyboard
          v-if="showKeyboard"
          :language="language"
          :active-key="activeKey"
          :error-key="errorKey"
          :expected-key="expectedKey"
          :is-shift-pressed="isShiftPressed"
        />
        
        <FingerIndicator
          v-if="showFingerIndicator"
          :expected-key="expectedKey"
          :language="language"
          :is-shift-pressed="isShiftPressed"
          :t="t"
        />
        
        <div class="typing-controls" v-if="isPaused">
          <button @click="resumeTyping" class="btn-primary">
            {{ t.resume }}
          </button>
        </div>
      </div>

      <!-- Stats View (after session) -->
      <div v-if="view === 'stats'" class="stats-view">
        <Stats
          ref="statsRef"
          :stats="sessionStats"
          :all-sessions="allSessions"
          :t="t"
          :language="language"
          @new-session="handleNewSession"
          @back-to-menu="view = 'typing'; handleNewSession()"
        />
      </div>

      <!-- Global Statistics View -->
      <div v-if="view === 'globalStats'" class="stats-view">
        <GlobalStats
          :all-sessions="allSessions"
          :t="t"
          @close="view = 'typing'"
        />
      </div>

    </div>
    
    <!-- EyeTracker -->
    <EyeTracker
      :eye-tracking-screen-y="eyeTrackingScreenY"
      :eye-tracking-keyboard-y="eyeTrackingKeyboardY"
      ref="eyeTrackerRef"
      :enabled="eyeTrackingEnabled"
      :is-active="view === 'typing' && isTyping && eyeTrackingReady"
      :t="t"
      @looking-at-keyboard="handleLookingAtKeyboard"
      @looking-at-screen="handleLookingAtScreen"
      @loading="handleEyeTrackingLoading"
      @ready="handleEyeTrackingReady"
      @eye-position-update="handleEyePositionUpdate"
      @smoothed-average-update="handleSmoothedAverageUpdate"
      @calibration-step="handleCalibrationStep"
      @calibration-progress="handleCalibrationProgress"
    />
    
    <!-- Loading screen for eye tracking initialization and calibration -->
    <div v-if="eyeTrackingLoading || calibrationStep" class="eye-tracking-loading">
      <!-- Screen calibration marker (top half) -->
      <div v-if="calibrationStep === 'screen'" class="eye-target-top">
        <div class="target-circle"></div>
        <p>{{ t.lookAtTarget || 'Look at this target' }}</p>
      </div>
      
      <!-- Keyboard calibration marker (bottom with arrow) -->
      <div v-if="calibrationStep === 'keyboard'" class="eye-target-bottom">
        <svg class="keyboard-icon" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
        </svg>
        <svg class="arrow-down" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
        <p>{{ t.lookAtKeyboard || 'Look at your keyboard' }}</p>
      </div>
      
      <div class="loading-content">
        <div v-if="!calibrationStep" class="loading-spinner"></div>
        <div v-else class="calibration-icon">👁️</div>
        <h3 v-if="!calibrationStep">{{ t.initializingEyeTracking || 'Initializing Eye Tracking' }}</h3>
        <h3 v-else>{{ calibrationStep === 'screen' ? (t.calibrateScreen || 'Calibrate Screen') : (t.calibrateKeyboard || 'Calibrate Keyboard') }}</h3>
        <p v-if="!calibrationStep">{{ t.initializingEyeTrackingMessage || 'Please wait while we set up eye tracking...' }}</p>
        <p v-else>{{ calibrationStep === 'screen' ? (t.calibrateScreenMessage || 'Please look at the screen. We are calibrating your eye position.') : (t.calibrateKeyboardMessage || 'Now please look at your keyboard. We are calibrating the keyboard position.') }}</p>
        <div v-if="calibrationStep" class="calibration-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (calibrationProgress / calibrationTotal * 100) + '%' }"></div>
          </div>
          <p class="progress-text">{{ calibrationProgress }} / {{ calibrationTotal }}</p>
        </div>
      </div>
    </div>
    
    <!-- Tutorial Modal -->
    <Tutorial
      :show="showTutorial"
      :language="language"
      :t="t"
      @close="closeTutorial"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import TypingArea from './components/TypingArea.vue';
import Keyboard from './components/Keyboard.vue';
import Stats from './components/Stats.vue';
import Settings from './components/Settings.vue';
import TopStats from './components/TopStats.vue';
import Tutorial from './components/Tutorial.vue';
import FingerIndicator from './components/FingerIndicator.vue';
import EyeTracker from './components/EyeTracker.vue';
import GlobalStats from './components/GlobalStats.vue';

const eyeTrackerRef = ref(null);
const currentEyePosition = ref(0.5);
const eyeTrackingAvgY = ref(null);

const isLookingAtKeyboard = computed(() => {
  return eyeTrackerRef.value?.showWarning?.value ?? false;
});

function handleSmoothedAverageUpdate(value) {
  if (value !== null && value !== undefined && typeof value === 'number') {
    eyeTrackingAvgY.value = value;
  } else {
    eyeTrackingAvgY.value = null;
  }
}
import { translations } from './data/translations.js';
import { getPracticeText, calculateStats, getAvailableCategories } from './utils/practiceGenerator.js';
import { initDB, saveSession, getAllSessions, clearAllSessions } from './utils/storage.js';
import { settingsStorage } from './utils/storage.js';
import { keySequences } from './data/practiceData.js';

const view = ref('typing');
const language = ref(settingsStorage.getLanguage());
const mode = ref(settingsStorage.getMode());
const difficulty = ref(settingsStorage.getDifficulty() || 'medium');
const showSettings = ref(false);
const isDarkMode = ref(settingsStorage.getTheme() === 'dark');
const showKeyboard = ref(settingsStorage.getShowKeyboard());
const showFingerIndicator = ref(settingsStorage.getShowFingerIndicator());
const eyeTrackingScreenY = ref(settingsStorage.getEyeTrackingScreenY());
const eyeTrackingKeyboardY = ref(settingsStorage.getEyeTrackingKeyboardY()); 
const showTutorial = ref(false);
const eyeTrackingEnabled = ref(false);
const eyeTrackingLoading = ref(false);
const eyeTrackingReady = ref(false);
const calibrationStep = ref(null); 
const calibrationProgress = ref(0);
const calibrationTotal = ref(30);


const enabledCategories = ref(new Set());
const categoryTranslationMap = {
  homeRow: 'categoryHomeRow',
  topRow: 'categoryTopRow',
  bottomRow: 'categoryBottomRow',
  simpleWords: 'categorySimpleWords',
  numbers: 'categoryNumbers',
  capitals: 'categoryCapitals',
  punctuation: 'categoryPunctuation',
  letterCombinations: 'categoryLetterCombinations',
  mixedRows: 'categoryMixedRows',
  commonWords: 'categoryCommonWords',
  numbersAdvanced: 'categoryNumbersAdvanced',
  capitalsAdvanced: 'categoryCapitalsAdvanced',
  punctuationAdvanced: 'categoryPunctuationAdvanced',
  symbols: 'categorySymbols',
  complexCombinations: 'categoryComplexCombinations',
  programming: 'categoryProgramming',
  mixedAdvanced: 'categoryMixedAdvanced',
};

const t = computed(() => translations[language.value] || translations.en);

const isTyping = ref(false);
const isPaused = ref(false);
const timeRemaining = ref(60);
const elapsedTime = ref(0);
const currentText = ref('');
const textSourceUrl = ref(null);
const textSourceTitle = ref(null);
const isLoadingText = ref(false);
const userInput = ref('');
const activeKey = ref('');
const errorKey = ref('');
const expectedKey = ref('');
const typingAreaRef = ref(null);
const totalMistakes = ref(0);
const totalCharsTyped = ref(0);
const isShiftPressed = ref(false);
const currentCombo = ref(0);
const maxCombo = ref(0);

const progressPercent = computed(() => {
  if (!currentText.value) return 0;
  return Math.min((userInput.value.length / currentText.value.length) * 100, 100);
});


const comboColorLevel = computed(() => {
  
  
  if (currentCombo.value === 0) return 0;
  if (maxCombo.value === 0) return 0;
  const level = Math.floor(maxCombo.value / 25) + 1;
  return Math.min(level, 5);
});


const comboColorClass = computed(() => {
  const level = comboColorLevel.value;
  if (level === 0) return ''; 
  return `combo-color-${level}`;
});


const recentKeystrokes = ref([]);

const currentSpeed = computed(() => {
  const _tick = elapsedTime.value;
  if (!isTyping.value || _tick <= 0) {
    return { wpm: 0, cpm: 0 };
  }

  const now = Date.now();
  const windowMs = 3000;
  
  // Filter keystrokes within the window
  const recent = recentKeystrokes.value.filter(time => now - time <= windowMs);
  
  // Calculate actual window duration, minimum 1 second to avoid crazy spikes at the very start
  const actualWindowMs = Math.max(1000, Math.min(_tick * 1000, windowMs));
  if (actualWindowMs <= 0) return { wpm: 0, cpm: 0 };

  const cpm = Math.round((recent.length / (actualWindowMs / 1000)) * 60);
  const wpm = Math.round(cpm / 5);

  return { wpm, cpm };
});

const currentAccuracy = computed(() => {
  if (totalCharsTyped.value === 0) return 100;
  const correctChars = totalCharsTyped.value - totalMistakes.value;
  return Math.round((correctChars / totalCharsTyped.value) * 100);
});




function limitTextLength(text, difficulty = 'medium') {
  if (!text) return '';
  
  
  let maxChars;
  switch (difficulty) {
    case 'easy':
      maxChars = 200;
      break;
    case 'medium':
      maxChars = 300;
      break;
    case 'hard':
      maxChars = 400;
      break;
    default:
      maxChars = 300;
  }
  
  if (text.length <= maxChars) {
    return text;
  }
  
  
  const truncated = text.substring(0, maxChars);
  const sentenceEndRegex = /[.!?]\s+/g;
  let lastSentenceEnd = -1;
  let match;
  
  sentenceEndRegex.lastIndex = 0;
  
  while ((match = sentenceEndRegex.exec(text)) !== null) {
    if (match.index + match[0].length <= maxChars) {
      lastSentenceEnd = match.index + match[0].length;
    } else {
      break;
    }
  }
  
  
  if (lastSentenceEnd > 0 && lastSentenceEnd > maxChars * 0.5) {
    return text.substring(0, lastSentenceEnd).trim();
  }
  
  
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.8) {
    return truncated.substring(0, lastSpace).trim();
  }
  
  
  return truncated.trim();
}

const availableCategories = computed(() => {
  if (mode.value !== 'sequences') return [];
  const difficultyData = keySequences[language.value]?.[difficulty.value] || keySequences.en?.[difficulty.value] || {};
  return Object.keys(difficultyData);
});

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const sessionStats = ref({
  cpm: 0,
  wpm: 0,
  accuracy: 0,
  mistakes: 0,
  correctChars: 0,
  totalChars: 0,
});

const allSessions = ref([]);
let timerInterval = null;
let startTime = null;
let pausedTime = 0;
let sessionStartTime = null;

onMounted(async () => {
  await initDB();
  await loadSessions();
  updateTheme();
  
  
  loadEnabledCategories();
  
  startSession();
  
  
  const tutorialShown = localStorage.getItem('typingTrainer_tutorialShown');
  if (!tutorialShown) {
    showTutorial.value = true;
  }
  
  
  document.addEventListener('keydown', handleGlobalKeydown);
});

function handleGlobalKeydown(event) {
  
  if (event.key === 'Enter' && !event.target.matches('input, textarea, select')) {
    if (view.value === 'stats') {
      event.preventDefault();
      view.value = 'typing';
      isLoadingText.value = true;
      userInput.value = '';
      activeKey.value = '';
      errorKey.value = '';
      startSession();
    } else if (view.value === 'globalStats') {
      event.preventDefault();
      view.value = 'typing';
    } else if (view.value === 'typing' && !isTyping.value && userInput.value.length === 0) {
      event.preventDefault();
      startSession();
    }
  }

  if (event.key === 'Escape') {
    if (showSettings.value) {
      showSettings.value = false;
    } else if (view.value === 'globalStats') {
      view.value = 'typing';
    }
  }
}

watch(language, (newLang) => {
  settingsStorage.setLanguage(newLang);
});

watch(showSettings, (newVal, oldVal) => {
  if (!newVal && oldVal && view.value === 'typing') {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
});

watch([view, showSettings], ([newView, newShowSettings]) => {
  if (newView === 'typing' && !newShowSettings) {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
});

watch(isTyping, (newVal) => {
  if (newVal && view.value === 'typing' && !showSettings.value) {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
});

function handleLanguageChange() {
  settingsStorage.setLanguage(language.value);
  if (view.value === 'typing') {
    startSession();
  }
}

function selectMode(newMode) {
  mode.value = newMode;
  settingsStorage.setMode(newMode);
  
  
  if (newMode === 'sequences') {
    loadEnabledCategories();
  } else {
    enabledCategories.value = new Set();
  }
  
  if (view.value === 'typing') {
    startSession();
  }
}

function saveSettings(skipStartSession = false) {
  settingsStorage.setDifficulty(difficulty.value);
  
  if (!skipStartSession && view.value === 'typing') {
    startSession();
  }
}

function handleDifficultyChange(newDifficulty) {
  
  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!newDifficulty || !validDifficulties.includes(newDifficulty)) {
    newDifficulty = 'medium';
  }
  difficulty.value = newDifficulty;
  saveSettings();
  loadEnabledCategories();
}

function loadEnabledCategories() {
  if (mode.value !== 'sequences') {
    enabledCategories.value = new Set();
    return;
  }
  
  const stored = settingsStorage.getEnabledCategories(difficulty.value);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    
    const validCategories = stored.filter(cat => availableCategories.value.includes(cat));
    if (validCategories.length > 0) {
      enabledCategories.value = new Set(validCategories);
      return;
    }
  }
  
  
  enabledCategories.value = new Set(availableCategories.value);
  saveEnabledCategories();
}

function saveEnabledCategories() {
  if (mode.value === 'sequences') {
    settingsStorage.setEnabledCategories(difficulty.value, Array.from(enabledCategories.value));
  }
}

function toggleCategory(category) {
  if (enabledCategories.value.has(category)) {
    
    if (enabledCategories.value.size <= 1) {
      return;
    }
    enabledCategories.value.delete(category);
  } else {
    enabledCategories.value.add(category);
  }
  saveEnabledCategories();
  
  
  if (view.value === 'typing') {
    startSession();
  }
}



function updateTheme() {
  const theme = settingsStorage.getTheme();
  const root = document.documentElement;
  root.classList.remove('light-mode', 'dark-mode');
  root.classList.add(theme === 'light' ? 'light-mode' : 'dark-mode');
  isDarkMode.value = theme === 'dark';
}

function closeTutorial() {
  showTutorial.value = false;
  localStorage.setItem('typingTrainer_tutorialShown', 'true');
  
  if (view.value === 'typing') {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
}

async function loadSessions() {
  allSessions.value = await getAllSessions();
}

async function startSession() {
  const enabledCategoriesArray = enabledCategories.value.size > 0 
    ? Array.from(enabledCategories.value) 
    : null;
  
  currentCombo.value = 0;
  maxCombo.value = 0;
  
  isLoadingText.value = true;
  try {
    const practiceResult = await getPracticeText(language.value, mode.value, difficulty.value, null, enabledCategoriesArray);
  
  
  if (typeof practiceResult === 'string') {
    currentText.value = practiceResult;
    textSourceUrl.value = null;
    textSourceTitle.value = null;
  } else if (practiceResult && typeof practiceResult === 'object' && practiceResult !== null && 'text' in practiceResult) {
    const textValue = practiceResult.text;
    currentText.value = typeof textValue === 'string' ? textValue : String(textValue || '');
    textSourceUrl.value = practiceResult.sourceUrl || null;
    textSourceTitle.value = practiceResult.sourceTitle || null;
  } else {
    currentText.value = typeof practiceResult === 'object' && practiceResult !== null 
      ? String(practiceResult) 
      : (typeof practiceResult === 'string' ? practiceResult : '');
    textSourceUrl.value = null;
    textSourceTitle.value = null;
  }
  
  
  if (typeof currentText.value !== 'string') {
    currentText.value = String(currentText.value || '');
  }
  
  
  } finally {
    isLoadingText.value = false;
  }
  
  userInput.value = '';
  activeKey.value = '';
  errorKey.value = '';
  expectedKey.value = currentText.value.length > 0 ? currentText.value[0] : '';
  elapsedTime.value = 0;
  totalMistakes.value = 0;
  totalCharsTyped.value = 0;
  isShiftPressed.value = false;
  currentCombo.value = 0;
  maxCombo.value = 0;
  recentKeystrokes.value = [];
  view.value = 'typing';
  isTyping.value = false;
  isPaused.value = false;
  timeRemaining.value = 60;
  if (typingAreaRef.value) {
    typingAreaRef.value.reset();
  }
  
  nextTick(() => {
    if (!showSettings.value) {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    }
  });
}

function startTyping() {
  
  if (eyeTrackingEnabled.value && !eyeTrackingReady.value) {
    return;
  }
  
  if (!isTyping.value && !isPaused.value) {
    sessionStartTime = Date.now();
    startTime = Date.now();
  } else if (isPaused.value) {
    startTime = Date.now() - pausedTime;
  }
  
  isTyping.value = true;
  isPaused.value = false;
  
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    elapsedTime.value = elapsed;
    timeRemaining.value = Math.max(0, 60 - elapsed);
    
    
  }, 100);
  
  typingAreaRef.value?.$el.querySelector('textarea')?.focus();
}

function handleTypingViewClick(event) {
  if (showSettings.value) {
    return;
  }
  if (view.value === 'typing') {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
}

function pauseTyping() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  pausedTime = Date.now() - startTime;
  isTyping.value = false;
  isPaused.value = true;
}

function resumeTyping() {
  startTyping();
}

function endSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  isTyping.value = false;
  isPaused.value = false;
  
  const elapsed = elapsedTime.value || (sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0);
  const comboMultiplier = getComboMultiplier(maxCombo.value);
  const stats = calculateStats(userInput.value, currentText.value, elapsed, totalMistakes.value, totalCharsTyped.value, comboMultiplier);
  sessionStats.value = {
    ...stats,
    wpm: stats.baseWpm, 
    cpm: stats.baseCpm, 
    time: elapsed,
    maxCombo: maxCombo.value,
    comboMultiplier: comboMultiplier,
  };
  
  
  saveSession({
    language: language.value,
    mode: mode.value,
    difficulty: difficulty.value,
    ...stats,
    wpm: stats.baseWpm, 
    cpm: stats.baseCpm, 
    time: elapsed,
    maxCombo: maxCombo.value,
  }).then(() => {
    loadSessions();
  });
  
  
  view.value = 'stats';
}

function handleTypingInput(input) {
  const oldLength = userInput.value.length;
  userInput.value = input;
  const newLength = userInput.value.length;
  
  const canStartTyping = !eyeTrackingEnabled.value || (eyeTrackingEnabled.value && eyeTrackingReady.value);
  if (!isTyping.value && !isPaused.value && input.length > 0 && canStartTyping) {
    startTyping();
  }

  if (newLength > oldLength) {
    const now = Date.now();
    for (let i = 0; i < newLength - oldLength; i++) {
      recentKeystrokes.value.push(now);
    }
    // Optional: clean up old keystrokes to prevent array growing too large over long sessions
    if (recentKeystrokes.value.length > 1000) {
      const windowMs = 3000;
      recentKeystrokes.value = recentKeystrokes.value.filter(time => now - time <= windowMs);
    }
  }
}

function handleMistakesUpdate({ totalMistakes: mistakes, totalCharsTyped: charsTyped }) {
  totalMistakes.value = mistakes;
  totalCharsTyped.value = charsTyped;
}

function handleComboUpdate({ current, max }) {
  currentCombo.value = current;
  maxCombo.value = max;
}

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

function handleComplete() {
  endSession();
}

function handleKeyDown({ key }) {
  activeKey.value = key.toLowerCase();
}

function handleKeyUp() {
  activeKey.value = '';
}

function handleNewSession() {
  userInput.value = '';
  activeKey.value = '';
  errorKey.value = '';
  startSession();
}

function handleLogoClick() {
  
  if (view.value === 'stats') {
    view.value = 'typing';
    handleNewSession();
  } else {
    
    startSession();
  }
}

async function handleClearStats() {
  if (confirm(t.value.clearStatsConfirm)) {
    await clearAllSessions();
    allSessions.value = [];
    showSettings.value = false;
  }
}

function handleThemeChange(theme) {
  settingsStorage.setTheme(theme);
  updateTheme();
}

function handleLookingAtKeyboard() {
  if (isTyping.value && !isPaused.value) {
    pauseTyping();
  }
}

function handleLookingAtScreen() {
  
  
  if (isPaused.value) {
    resumeTyping();
  }
}

function handleEyeTrackingToggle() {
  
}

function handleEyeTrackerToggle() {
  eyeTrackingEnabled.value = !eyeTrackingEnabled.value;
  
  if (view.value === 'typing' && !showSettings.value) {
    nextTick(() => {
      typingAreaRef.value?.$el.querySelector('textarea')?.focus();
    });
  }
}

function handleEyeTrackingLoading(loading) {
  eyeTrackingLoading.value = loading;
  
  
}

function handleCalibrationStep(step) {
  calibrationStep.value = step;
  
  if (step) {
    eyeTrackingLoading.value = true;
  } else {
    
    eyeTrackingLoading.value = false;
  }
}

function handleCalibrationProgress({ step, progress, total }) {
  calibrationProgress.value = progress;
  calibrationTotal.value = total;
}

function handleEyeTrackingReady(ready) {
  eyeTrackingReady.value = ready;
  
  if (ready) {
    eyeTrackingLoading.value = false;
    calibrationStep.value = null;
    
    if (userInput.value.length > 0 && !isTyping.value && !isPaused.value) {
      startTyping();
    }
    
    
    if (view.value === 'typing' && !showSettings.value) {
      nextTick(() => {
        typingAreaRef.value?.$el.querySelector('textarea')?.focus();
      });
    }
  }
}

function handleEyePositionUpdate(position) {
  currentEyePosition.value = position;
}
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--header-bg, #1a1a1a);
  border-bottom: 2px solid var(--border-color, #333);
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color, #4ecdc4);
}

.logo h1 {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.1);
}

.logo-container:active {
  transform: scale(0.95);
}

.keyboard-logo {
  width: 40px;
  height: 40px;
  color: var(--accent-color, #4ecdc4);
  transition: opacity 0.2s;
}

.logo-container:hover .keyboard-logo {
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.tutorial-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.tutorial-btn:hover {
  border-color: var(--accent-color, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.1);
}

.book-icon {
  width: 24px;
  height: 24px;
  color: var(--text-color, #fff);
  transition: color 0.2s;
}

.tutorial-btn:hover .book-icon {
  color: var(--accent-color, #4ecdc4);
}

.language-select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  font-size: 1rem;
  cursor: pointer;
}

.eye-tracker-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.eye-tracker-btn:hover {
  border-color: var(--accent-color, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.1);
}

.eye-tracker-btn.active {
  border-color: var(--accent-color, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.2);
}

.eyes-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.eyes-icon .pupil {
  transition: cy 0.1s ease-out;
}

.eyes-icon .closed-eyes {
  opacity: 1;
}

.stats-header-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.stats-header-btn:hover {
  border-color: var(--accent-color, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.1);
}

.chart-icon {
  color: var(--text-color, #fff);
  transition: color 0.2s;
}

.stats-header-btn:hover .chart-icon {
  color: var(--accent-color, #4ecdc4);
}

.settings-btn {
  padding: 0.5rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.settings-btn:hover {
  border-color: var(--accent-color, #4ecdc4);
  background: rgba(var(--accent-rgb), 0.1);
}

.gear-icon {
  width: 24px;
  height: 24px;
  color: var(--text-color, #fff);
  transition: color 0.2s, transform 0.2s;
}

.settings-btn:hover .gear-icon {
  color: var(--accent-color, #4ecdc4);
  transform: rotate(15deg);
}

.app-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.typing-view {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.typing-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
}

.side-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  flex-shrink: 0;
}


.stats-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.typing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
}



.typing-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
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
  transform: translateY(-2px);
}

.eye-tracking-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

.eye-target-top {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10002;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulseTop 2s ease-in-out infinite;
}

.eye-target-bottom {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  z-index: 10002;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: pulseBottom 2s ease-in-out infinite;
}

.keyboard-icon {
  color: var(--accent-color, #4ecdc4);
  animation: float 2s ease-in-out infinite;
}

.arrow-down {
  color: var(--accent-color, #4ecdc4);
  animation: bounce 1s ease-in-out infinite;
  margin-top: -0.5rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

.target-circle {
  width: 60px;
  height: 60px;
  border: 4px solid var(--accent-color, #4ecdc4);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: pulse 2s ease-in-out infinite;
  position: relative;
}

.target-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: var(--accent-color, #4ecdc4);
  border-radius: 50%;
}

.eye-target-top p,
.eye-target-bottom p {
  color: var(--accent-color, #4ecdc4);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

@keyframes pulseTop {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes pulseBottom {
  0%, 100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, 0) scale(1.1);
    opacity: 0.8;
  }
}

.loading-content {
  text-align: center;
  color: var(--text-color, #fff);
  margin-top: 8rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--card-border, #333);
  border-top-color: var(--accent-color, #4ecdc4);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-content h3 {
  color: var(--accent-color, #4ecdc4);
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.loading-content p {
  color: var(--text-secondary, #aaa);
  margin: 0 0 1.5rem 0;
}

.calibration-icon {
  font-size: 4rem;
  margin: 0 auto 1.5rem;
}

.calibration-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  max-width: 400px;
  height: 8px;
  background: var(--card-border, #333);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color, #4ecdc4);
  transition: width 0.2s ease;
  border-radius: 4px;
}

.progress-text {
  color: var(--text-secondary, #aaa);
  font-size: 0.9rem;
  margin: 0;
}

.btn-secondary {
  background: var(--btn-secondary-bg, #444);
  color: white;
}

.btn-secondary:hover {
  background: #555;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
  width: 100%;
}

.btn-danger:hover {
  background: #ff5252;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .app-content {
    padding: 1rem;
  }
  
  .settings-content {
    max-width: 100%;
    width: 95%;
    padding: 1rem;
  }
  
  .settings-content h2 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .setting-group {
    margin-bottom: 0.75rem;
  }
  
  .setting-group-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .actions-row {
    flex-direction: column;
  }
  
  .actions-row button {
    width: 100%;
  }
  
  .mode-selector {
    grid-template-columns: 1fr;
  }
  
  .mode-btn {
    width: 100%;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.4rem;
  }
  
  .category-btn {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
  
}
</style>
