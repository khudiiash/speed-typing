# Speed Typing Trainer

A touch typing trainer application supporting Ukrainian and English languages, built with Vue 3.

## Features

### Training Modes
- **Key Sequences**: Practice specific key combinations and finger movements
- **Random Texts**: Type random texts fetched from Wikipedia for real-world practice

### Eye Tracking (Optional)
- Monitors eye position to detect if you're looking at the keyboard
- Shows warnings when eyes are detected on the keyboard
- Automatically pauses the session until eyes return to the screen
- Helps develop proper touch typing habits

### Learning Tools
- **Tutorial**: Interactive guide explaining the foundations of touch typing
- **Finger Indicator**: Visual guide showing which fingers to use for each key
- **Keyboard Schema**: Visual keyboard layout showing key locations

### Statistics
- Comprehensive tracking system for typing speed, accuracy, and progress
- Real-time performance metrics during typing sessions

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- Vue 3
- Vite
- TensorFlow.js (for eye tracking)
