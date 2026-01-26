<template>
  <Teleport to="body">
    <div v-if="showWarning" class="eye-tracker-warning">
      <div class="warning-content">
        <div class="warning-icon">👁️</div>
        <h3>{{ t.lookingAtKeyboard || 'Looking at Keyboard' }}</h3>
        <p>{{ t.lookingAtKeyboardMessage || 'Please look at the screen, not the keyboard. Typing has been paused.' }}</p>
        <button @click="dismissWarning" class="btn-primary">{{ t.continue || 'Continue' }}</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, markRaw, shallowRef, nextTick } from 'vue';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { settingsStorage } from '../utils/storage.js';

const videoWidth = ref(480);
const videoHeight = ref(360);

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  t: {
    type: Object,
    required: true,
  },
  eyeTrackingScreenY: {
    type: Number,
    default: null,
  },
  eyeTrackingKeyboardY: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['lookingAtKeyboard', 'lookingAtScreen', 'loading', 'ready', 'eyePositionUpdate', 'smoothedAverageUpdate', 'calibrationStep', 'calibrationProgress']);

const showWarning = ref(false);
const warningSetTime = ref(0);
const WARNING_MIN_DURATION = 1000;
const videoRef = ref(null);
const canvasRef = ref(null);
const model = shallowRef(null);
const stream = ref(null);
const isTracking = ref(false);
const lookingAtKeyboardCount = ref(0);
const lookingAtScreenCount = ref(0);
const THRESHOLD_COUNT = 3;
const savedBackend = ref(null);
const backendErrorCount = ref(0);
const MAX_BACKEND_ERRORS = 5;
const hasStartedTracking = ref(false); 
const isLoading = ref(false); 
const isReady = ref(false); 
const screenBaselineY = ref(settingsStorage.getEyeTrackingScreenY()); 
const keyboardY = ref(settingsStorage.getEyeTrackingKeyboardY());
const currentEyePosition = ref(0.45);


const eyePositionHistory = ref([]);
const SMOOTHING_BUFFER_SIZE = 10;
const smoothedEyeAverage = ref(0.45); 



const DETECTION_INTERVAL = 50; 
let lastDetectionTime = 0;
let animationFrameId = null;
let frameCount = 0;
let isPageVisible = true;


let visibilityChangeHandler = null;

onMounted(() => {
  visibilityChangeHandler = () => {
    isPageVisible = !document.hidden;
    if (!isPageVisible && isTracking.value) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else if (isPageVisible && isTracking.value && props.isActive) {
      detectGaze();
    }
  };
  
  document.addEventListener('visibilitychange', visibilityChangeHandler);
});

onUnmounted(() => {
  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
  }
  stopTracking();
  stopCamera();
});


watch(() => props.enabled, async (newVal) => {
  if (newVal && !isReady.value && !isLoading.value) {
    
    await initializeEyeTracking();
  } else if (!newVal) {
    
    stopTracking();
    stopCamera();
    isReady.value = false;
    isLoading.value = false;
  }
});

watch(() => props.isActive, (newVal, oldVal) => {
  if (newVal && isReady.value && !hasStartedTracking.value) {
    startTracking();
    hasStartedTracking.value = true;
  } else if (!newVal && hasStartedTracking.value) {
    if (!showWarning.value) {
      stopTracking();
      hasStartedTracking.value = false;
    }
  }
});

watch(() => props.eyeTrackingScreenY, (newVal) => {
  if (newVal !== null) {
    screenBaselineY.value = newVal;
    settingsStorage.setEyeTrackingScreenY(newVal);
  }
});

watch(() => props.eyeTrackingKeyboardY, (newVal) => {
  if (newVal !== null) {
    keyboardY.value = newVal;
    settingsStorage.setEyeTrackingKeyboardY(newVal);
  }
});


function resetTracking() {
  hasStartedTracking.value = false;
  showWarning.value = false;
  warningSetTime.value = 0;
  lookingAtKeyboardCount.value = 0;
  lookingAtScreenCount.value = 0;
  screenBaselineY.value = settingsStorage.getEyeTrackingScreenY();
  keyboardY.value = settingsStorage.getEyeTrackingKeyboardY();
  eyePositionHistory.value = [];
  smoothedEyeAverage.value = 0.45;
  emit('smoothedAverageUpdate', 0.45);
}


function addToEyePositionHistory(eyeY) {
  eyePositionHistory.value.push(eyeY);
  
  if (eyePositionHistory.value.length > SMOOTHING_BUFFER_SIZE) {
    eyePositionHistory.value = eyePositionHistory.value.slice(-SMOOTHING_BUFFER_SIZE);
  }
  
  if (eyePositionHistory.value.length > 0) {
    const recentPositions = eyePositionHistory.value.slice(-SMOOTHING_BUFFER_SIZE);
    const average = recentPositions.reduce((sum, val) => sum + val, 0) / recentPositions.length;
    smoothedEyeAverage.value = average;
    
    emit('smoothedAverageUpdate', average);
    
    if (eyeY < keyboardY.value && eyePositionHistory.value.length >= SMOOTHING_BUFFER_SIZE) {
      return average;
    }
  } else {
    smoothedEyeAverage.value = eyeY;
    emit('smoothedAverageUpdate', eyeY);
  }
  
  return eyeY;
}


defineExpose({
  resetTracking,
  currentEyePosition,
  showWarning,
  smoothedEyeAverage,
  screenBaselineY,
  keyboardY
});

async function initializeEyeTracking() {
  isLoading.value = true;
  emit('loading', true);
  
  try {
    await loadModel();
    
    await waitForWarmup();
    
    isLoading.value = false;
    emit('loading', false);
    
    if (videoRef.value) {
      if (videoRef.value.paused) {
        await videoRef.value.play();
      }
      
      if (videoRef.value.readyState < 2) {
        await new Promise((resolve) => {
          const checkReady = () => {
            if (videoRef.value.readyState >= 2) {
              resolve();
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        });
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    isReady.value = true;
    emit('ready', true);
  } catch (error) {
    isLoading.value = false;
    isReady.value = false;
    emit('loading', false);
    emit('ready', false);
  }
}

async function waitForWarmup() {
  return Promise.resolve();
}

async function loadModel() {
  try {
    await tf.ready();
    
    const backends = [];
    if (tf.findBackendFactory('webgpu')) {
      backends.push('webgpu');
    }
    if (tf.findBackendFactory('webgl')) {
      backends.push('webgl');
    }
    
    let backendSet = false;
    for (const backendName of backends) {
      try {
        await tf.setBackend(backendName);
        await tf.ready();
        backendSet = true;
        break;
      } catch (backendError) {
        if (backendName === backends[backends.length - 1]) {
          throw backendError;
        }
        continue;
      }
    }
    
    if (!backendSet) {
      throw new Error('Failed to set TensorFlow backend');
    }
    
    const engine = tf.engine();
    if (!engine || !engine.backend) {
      throw new Error('Backend engine is not properly initialized');
    }
    
    const detectorConfig = {
      runtime: 'tfjs',
      maxFaces: 1,
      refineLandmarks: true, 
      
      
    };
    
    const detector = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      detectorConfig
    );
    
    model.value = markRaw(detector);
    savedBackend.value = tf.getBackend();
    
    
    await initializeCamera();
    
    
    
    
    const warmupCanvas = document.createElement('canvas');
    warmupCanvas.width = videoWidth.value;
    warmupCanvas.height = videoHeight.value;
    const warmupCtx = warmupCanvas.getContext('2d');
    warmupCtx.fillStyle = '#000';
    warmupCtx.fillRect(0, 0, videoWidth.value, videoHeight.value);
    
    try {
      await detector.estimateFaces(warmupCanvas, {
        flipHorizontal: false,
        returnTensors: false,
        staticImageMode: true,
      });
      
    } catch (warmupError) {
    }
  } catch (error) {
  }
}

async function initializeCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return;
  }
  
  if (videoRef.value) {
    
    return;
  }
  
  try {
    
    
    const constraints = {
      video: { 
        width: videoWidth.value,  
        height: videoHeight.value, 
        facingMode: 'user'
      }
    };
    
    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
    
    const video = document.createElement('video');
    video.srcObject = stream.value;
    video.autoplay = true;
    video.playsInline = true;
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    document.body.appendChild(video);
    videoRef.value = video;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth.value;  
    canvas.height = videoHeight.value;
    canvas.style.position = 'fixed';
    canvas.style.top = '-9999px';
    canvas.style.left = '-9999px';
    canvas.style.width = '1px';
    canvas.style.height = '1px';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);
    canvasRef.value = canvas;
    
    await video.play();
    
    await new Promise((resolve) => {
      if (video.readyState >= 2) {
        resolve();
      } else {
        video.addEventListener('loadeddata', resolve, { once: true });
      }
    });
    
  } catch (error) {
  }
}

async function startTracking() {
  
  
  
  if (!model.value || !videoRef.value || !canvasRef.value) {
    
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!model.value || !videoRef.value || !canvasRef.value) {
      
      if (!videoRef.value) {
        await initializeCamera();
      }
      if (!model.value || !videoRef.value || !canvasRef.value) {
        return;
      }
    }
  }
  
  
  
  if (videoRef.value && videoRef.value.paused) {
    await videoRef.value.play();
  }
  
  
  if (!isTracking.value) {
    isTracking.value = true;
    detectGaze();
  }
}

function stopTracking() {
  isTracking.value = false;
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  lookingAtKeyboardCount.value = 0;
  lookingAtScreenCount.value = 0;
  backendErrorCount.value = 0;
  hasStartedTracking.value = false;
  screenBaselineY.value = settingsStorage.getEyeTrackingScreenY();
  keyboardY.value = settingsStorage.getEyeTrackingKeyboardY();
  eyePositionHistory.value = [];
  smoothedEyeAverage.value = 0.45;
  emit('smoothedAverageUpdate', 0.45);
}

function stopCamera() {
  
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  
  if (videoRef.value) {
    document.body.removeChild(videoRef.value);
    videoRef.value = null;
  }
  
  if (canvasRef.value) {
    document.body.removeChild(canvasRef.value);
    canvasRef.value = null;
  }
}

async function detectGaze() {
  if (!isPageVisible) {
    return;
  }
  
  if (!isTracking.value) {
    if (showWarning.value && hasStartedTracking.value) {
      isTracking.value = true;
    } else {
      return;
    }
  }
  
  const now = Date.now();
  if (now - lastDetectionTime < DETECTION_INTERVAL) {
    if (isTracking.value && isPageVisible) {
      animationFrameId = requestAnimationFrame(detectGaze);
    }
    return;
  }
  lastDetectionTime = now;
  frameCount++;
  
  if (!model.value || !videoRef.value || !canvasRef.value) {
    if (isTracking.value) {
      animationFrameId = requestAnimationFrame(detectGaze);
    }
    return;
  }
  
  if (videoRef.value.readyState < 2) {
    if (isTracking.value) {
      animationFrameId = requestAnimationFrame(detectGaze);
    }
    return;
  }
  
  try {
    let currentBackend = tf.getBackend();
    if (!currentBackend) {
      
      const fallbackBackends = ['webgpu', 'webgl'];
      
      let restored = false;
      for (const backendName of fallbackBackends) {
        try {
          await tf.setBackend(backendName);
          await tf.ready();
          currentBackend = tf.getBackend();
          if (currentBackend) {
            savedBackend.value = currentBackend;
            restored = true;
            break;
          }
        } catch (backendError) {
          continue;
        }
      }
      
      if (!restored) {
        if (isTracking.value) {
          animationFrameId = requestAnimationFrame(detectGaze);
        }
        return;
      }
    }
    
    const ctx = canvasRef.value.getContext('2d');
    canvasRef.value.width = videoRef.value.videoWidth || videoWidth.value;
    canvasRef.value.height = videoRef.value.videoHeight || videoHeight.value;
    ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
    
    const estimationConfig = {
      flipHorizontal: false,
      returnTensors: false, 
      staticImageMode: false,
      
    };
    
    const detector = model.value;
    if (!detector || typeof detector.estimateFaces !== 'function') {
      if (isTracking.value) {
        animationFrameId = requestAnimationFrame(detectGaze);
      }
      return;
    }
    
    let predictions;
    try {
      if (!tf.getBackend()) {
        throw new Error('Backend lost before estimateFaces call');
      }
      
      predictions = await detector.estimateFaces(canvasRef.value, estimationConfig);
    } catch (detectionError) {
      const isBackendError = detectionError.message && 
        (detectionError.message.includes('backend') || 
         detectionError.message.includes('Backend') ||
         detectionError.message.includes('Cannot read properties of undefined'));
      
      if (isBackendError) {
        backendErrorCount.value++;
        
        if (backendErrorCount.value >= MAX_BACKEND_ERRORS) {
          stopTracking();
          return;
        }
        
        try {
          const fallbackBackends = ['webgpu', 'webgl'];
          
          let restored = false;
          for (const backendName of fallbackBackends) {
            try {
              await tf.setBackend(backendName);
              await new Promise(resolve => setTimeout(resolve, 100));
              await tf.ready();
              
              const restoredBackend = tf.getBackend();
              if (restoredBackend) {
                savedBackend.value = restoredBackend;
                backendErrorCount.value = 0;
                restored = true;
                break;
              }
            } catch (err) {
              continue;
            }
          }
        } catch (recoveryError) {
          
        }
        
        if (isTracking.value) {
          animationFrameId = requestAnimationFrame(detectGaze);
        }
        return;
      }
      
      if (isTracking.value) {
        animationFrameId = requestAnimationFrame(detectGaze);
      }
      return;
    }
    
    backendErrorCount.value = 0;
    
    if (predictions.length > 0) {
      const face = predictions[0];
      const keypoints = face.keypoints;
      
      if (!keypoints || keypoints.length < 468) {
        if (isTracking.value) {
          animationFrameId = requestAnimationFrame(detectGaze);
        }
        return;
      }
      
      
      
      
      const leftEyeInner = keypoints[33];
      const leftEyeOuter = keypoints[133];
      const leftEyeTop = keypoints[159];
      const leftEyeBottom = keypoints[145];
      
      const rightEyeInner = keypoints[362];
      const rightEyeOuter = keypoints[263];
      const rightEyeTop = keypoints[386];
      const rightEyeBottom = keypoints[374];
      
      
      
      const leftIrisCenter = keypoints[468];
      const rightIrisCenter = keypoints[473];
      
      
      const hasIrisTracking = leftIrisCenter && rightIrisCenter && 
                              leftIrisCenter.x !== undefined && rightIrisCenter.y !== undefined;
      
      let isLookingDown = false;
      let gazeVerticalRatio = null; 
      
      if (hasIrisTracking) {
        
        
        const leftEyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
        const leftEyeHeight = Math.abs(leftEyeBottom.y - leftEyeTop.y);
        const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
        const rightEyeHeight = Math.abs(rightEyeBottom.y - rightEyeTop.y);
        
        if (leftEyeWidth > 0 && leftEyeHeight > 0 && rightEyeWidth > 0 && rightEyeHeight > 0) {
          
          
          const leftIrisY = (leftIrisCenter.y - leftEyeTop.y) / leftEyeHeight;
          const rightIrisY = (rightIrisCenter.y - rightEyeTop.y) / rightEyeHeight;
          
          
          const avgIrisY = (leftIrisY + rightIrisY) / 2;
          gazeVerticalRatio = avgIrisY;
          currentEyePosition.value = avgIrisY;
          emit('eyePositionUpdate', avgIrisY); 
          
          if (hasStartedTracking.value) {
            
            const smoothedEyeY = addToEyePositionHistory(avgIrisY);
            
            isLookingDown = smoothedEyeY < keyboardY.value;
            
          }
          
          
          
          
          
          
          
          
          
          
          
          
        }
      } else {
        
        const noseTip = keypoints[1];
        const leftEye = keypoints[33];
        const rightEye = keypoints[263];
        const chin = keypoints[175];
        
        if (noseTip && leftEye && rightEye && chin && 
            noseTip.x !== undefined && noseTip.y !== undefined) {
          const eyeY = (leftEye.y + rightEye.y) / 2;
          const noseY = noseTip.y;
          const chinY = chin.y;
          
          const verticalOffset = noseY - eyeY;
          const faceHeight = chinY - eyeY;
          gazeVerticalRatio = verticalOffset / faceHeight;
          
          
          if (hasStartedTracking.value) {
            
            const smoothedEyeY = addToEyePositionHistory(gazeVerticalRatio);
            
            isLookingDown = smoothedEyeY < keyboardY.value;
            
          }
        }
      }
      
      if (gazeVerticalRatio !== null && hasStartedTracking.value) {
        
        if (isLookingDown) {
          lookingAtKeyboardCount.value++;
          lookingAtScreenCount.value = 0;
          
          
          if (lookingAtKeyboardCount.value >= THRESHOLD_COUNT) {
            if (!showWarning.value) {
              showWarning.value = true;
              warningSetTime.value = Date.now();
              
              lookingAtScreenCount.value = 0;
              
              if (props.isActive) {
                emit('lookingAtKeyboard');
              }
            }
          }
        } else {
          if (!showWarning.value) {
            lookingAtScreenCount.value++;
            
            if (lookingAtScreenCount.value >= THRESHOLD_COUNT) {
              lookingAtKeyboardCount.value = 0;
            }
            
            const midpoint = (screenBaselineY.value + keyboardY.value) / 2;
            const averageAboveMidpoint = smoothedEyeAverage.value > midpoint;
            
            if (averageAboveMidpoint && lookingAtScreenCount.value >= THRESHOLD_COUNT) {
              lookingAtKeyboardCount.value = 0;
            }
          } else {
            if (warningSetTime.value === 0) {
              warningSetTime.value = Date.now();
            }
            
            const timeSinceWarning = Date.now() - warningSetTime.value;
            const canClearWarning = timeSinceWarning >= WARNING_MIN_DURATION;
            
            if (!canClearWarning) {
              lookingAtScreenCount.value = 0;
            } else {
              lookingAtScreenCount.value++;
              
              if (lookingAtScreenCount.value >= THRESHOLD_COUNT * 2) {
                const midpoint = (screenBaselineY.value + keyboardY.value) / 2;
                const averageAboveMidpoint = smoothedEyeAverage.value > midpoint;
                
                if (averageAboveMidpoint) {
                  showWarning.value = false;
                  warningSetTime.value = 0;
                  lookingAtKeyboardCount.value = 0;
                  emit('lookingAtScreen');
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
  }
  
  if (isTracking.value) {
    animationFrameId = requestAnimationFrame(detectGaze);
  }
}

function dismissWarning() {
  showWarning.value = false;
  warningSetTime.value = 0;
  lookingAtKeyboardCount.value = 0;
  emit('lookingAtScreen');
}
</script>

<style scoped>
.eye-position-display {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background: rgba(0, 0, 0, 0.85);
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 9999;
  font-family: monospace;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.eye-position-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.eye-position-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.eye-position-value {
  font-size: 16px;
  font-weight: bold;
  color: #4ecdc4;
}

.eye-tracker-calibration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.3s ease;
}

.eye-tracker-warning {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.9) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 10002 !important;
  animation: fadeIn 0.3s ease;
  pointer-events: auto !important;
  visibility: visible !important;
  opacity: 1 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.calibration-content,
.warning-content {
  background: #2a2a2a !important;
  border: 2px solid #4ecdc4 !important;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  position: relative;
  z-index: 1;
  color: #fff !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
}

.calibration-icon,
.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block !important;
  line-height: 1;
  visibility: visible !important;
  opacity: 1 !important;
}

.calibration-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--card-border, #333);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
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

.calibration-content h3,
.warning-content h3 {
  color: #4ecdc4 !important;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.calibration-content p,
.warning-content p {
  color: #fff !important;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  display: block !important;
  font-size: 1rem;
  visibility: visible !important;
  opacity: 1 !important;
}


.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  border: none;
  background: var(--accent-color, #4ecdc4);
  color: #000;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--accent-color-hover, #3db3a8);
  transform: scale(1.05);
}
</style>

<!-- Non-scoped styles for teleported warning -->
<style>
.eye-tracker-warning {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.9) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 10002 !important;
  animation: fadeIn 0.3s ease;
  pointer-events: auto !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.eye-tracker-warning .warning-content {
  background: #2a2a2a !important;
  border: 2px solid #4ecdc4 !important;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  position: relative;
  z-index: 1;
  color: #fff !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
}

.eye-tracker-warning .warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block !important;
  line-height: 1;
  visibility: visible !important;
  opacity: 1 !important;
}

.eye-tracker-warning .warning-content h3 {
  color: #4ecdc4 !important;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.eye-tracker-warning .warning-content p {
  color: #fff !important;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  display: block !important;
  font-size: 1rem;
  visibility: visible !important;
  opacity: 1 !important;
}

.eye-tracker-warning .btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  border: none;
  background: #4ecdc4 !important;
  color: #000 !important;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.eye-tracker-warning .btn-primary:hover {
  background: #3db3a8 !important;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
