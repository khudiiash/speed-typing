<template>
  <div class="period-stats">
    <div v-if="sessions.length === 0" class="empty">{{ t.noData }}</div>
    <template v-else>
      <div class="stat-row">
        <span class="stat-label">{{ t.sessionsCompleted }}</span>
        <span class="stat-value">{{ sessions.length }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">{{ t.averageSpeed }} ({{ t.wpm }})</span>
        <span class="stat-value">{{ avgWpm }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">{{ t.bestSpeed }}</span>
        <span class="stat-value">{{ bestWpm }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">{{ t.accuracy }}</span>
        <span class="stat-value">{{ avgAccuracy }}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">{{ t.time }}</span>
        <span class="stat-value">{{ formatTime(totalTime) }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
  t: {
    type: Object,
    required: true,
  },
});

const avgWpm = computed(() => {
  if (props.sessions.length === 0) return 0;
  const sum = props.sessions.reduce((acc, s) => acc + (s.wpm || 0), 0);
  return Math.round(sum / props.sessions.length);
});

const bestWpm = computed(() => {
  if (props.sessions.length === 0) return 0;
  return Math.max(...props.sessions.map((s) => s.wpm || 0));
});

const avgAccuracy = computed(() => {
  if (props.sessions.length === 0) return 0;
  const sum = props.sessions.reduce((acc, s) => acc + (s.accuracy ?? 0), 0);
  return Math.round(sum / props.sessions.length);
});

const totalTime = computed(() => {
  if (props.sessions.length === 0) return 0;
  return props.sessions.reduce((acc, s) => acc + (s.time || 0), 0);
});

function formatTime(seconds) {
  if (!seconds) return '0s';
  const total = Math.floor(seconds);
  if (total < 60) return `${total}s`;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const m = mins % 60;
  return `${hours}h ${m}m`;
}
</script>

<style scoped>
.period-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #aaa);
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color, #fff);
}

.empty {
  font-size: 0.9rem;
  color: var(--text-secondary, #aaa);
  padding: 0.5rem 0;
}
</style>
