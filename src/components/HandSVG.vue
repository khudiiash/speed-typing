<template>
  <HandSVGIcon 
    ref="svgRef"
    class="hand-svg-component"
    :style="svgStyle"
  />
</template>

<script setup>
import { computed, ref, watch, onMounted, onUpdated, nextTick } from 'vue';
import HandSVGIcon from '../assets/hand.svg?component';

const props = defineProps({
  hand: {
    type: String,
    default: 'left',
  },
  activeFinger: {
    type: String,
    default: null,
  },
});

const svgRef = ref(null);


const fingerColors = {
  'pinky-l': '#ff6b6b',
  'ring-l': '#4ecdc4',
  'middle-l': '#45b7d1',
  'index-l': '#96ceb4',
  'thumb': '#ffeaa7',
  'index-r': '#a8e6cf',
  'middle-r': '#ffd93d',
  'ring-r': '#ff9ff3',
  'pinky-r': '#c44569',
};


const fingerIdToType = computed(() => {
  if (props.hand === 'left') {
    return {
      'little': 'pinky-l',
      'ring': 'ring-l',
      'middle': 'middle-l',
      'index': 'index-l',
      'thumb': 'thumb',
    };
  } else {
    
    return {
      'little': 'pinky-r',
      'ring': 'ring-r',
      'middle': 'middle-r',
      'index': 'index-r',
      'thumb': 'thumb',
    };
  }
});

const fingerPathIndices = {
  'little': 3,
  'ring': 4,
  'middle': 5,
  'index': 6,
  'thumb': 7,
};

function updateFingerHighlights() {
  if (!svgRef.value) return;
  
  let svgElement = svgRef.value;
  if (svgElement.$el) {
    svgElement = svgElement.$el;
  }
  
  if (svgElement instanceof Element) {
    const svg = svgElement.querySelector?.('svg') || (svgElement.tagName === 'svg' ? svgElement : null);
    if (!svg) return;
    
    
    const allPaths = Array.from(svg.querySelectorAll('path'));
    
    
    for (let i = 0; i < 3 && i < allPaths.length; i++) {
      const handPath = allPaths[i];
      if (handPath) {
        handPath.setAttribute('class', 'hand-outline');
        handPath.style.opacity = '0.1';
      }
    }
    
    
    Object.entries(fingerPathIndices).forEach(([fingerId, pathIndex]) => {
      const fingerElement = allPaths[pathIndex];
      if (!fingerElement) return;
      
      const fingerType = fingerIdToType.value[fingerId];
      
      if (props.activeFinger === fingerType && props.activeFinger) {
        const color = fingerColors[props.activeFinger] || '#ff6b6b';
        fingerElement.setAttribute('fill', color);
        fingerElement.setAttribute('class', 'finger-highlight');
        fingerElement.style.opacity = '1';
        fingerElement.style.visibility = 'visible';
        
        fingerElement.style.stroke = color;
        fingerElement.style.strokeWidth = '3';
        fingerElement.style.strokeLinejoin = 'round';
        fingerElement.style.strokeLinecap = 'round';
      } else {
        fingerElement.setAttribute('fill', 'none');
        fingerElement.removeAttribute('filter');
        fingerElement.removeAttribute('class');
        fingerElement.style.opacity = '0';
        fingerElement.style.visibility = 'hidden';
        fingerElement.style.stroke = 'none';
        fingerElement.style.strokeWidth = '';
      }
    });
  }
}

watch([() => props.activeFinger, () => props.hand], () => {
  nextTick(() => updateFingerHighlights());
}, { immediate: true });

onMounted(() => {
  setTimeout(() => updateFingerHighlights(), 0);
});

onUpdated(() => {
  nextTick(() => updateFingerHighlights());
});

const svgStyle = computed(() => ({
  width: '700px',
  height: '700px',
}));
</script>

<style scoped>
.hand-svg-component {
  width: 100%;
  height: 100%;
  display: block;
}

.hand-svg-component :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.hand-svg-component :deep(path.finger-highlight) {
  opacity: 1 !important;
}

</style>
