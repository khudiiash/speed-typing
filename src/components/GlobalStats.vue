<template>
  <div class="global-stats">
    <div class="global-stats-header">
      <h2>{{ t.globalStatistics || 'Global Statistics' }}</h2>
      <button @click="$emit('close')" class="back-btn">{{ t.backToMenu }}</button>
    </div>

    <div class="periods-grid">
      <div class="period-card">
        <h3 class="period-title">{{ t.today }}</h3>
        <PeriodStats :sessions="todaySessions" :t="t" />
      </div>
      <div class="period-card">
        <h3 class="period-title">{{ t.thisWeek }}</h3>
        <PeriodStats :sessions="thisWeekSessions" :t="t" />
      </div>
      <div class="period-card">
        <h3 class="period-title">{{ t.allTime }}</h3>
        <PeriodStats :sessions="allSessions" :t="t" />
      </div>
    </div>

    <div v-if="allSessions.length === 0" class="no-data-message">
      {{ t.noData }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PeriodStats from './PeriodStats.vue';

const props = defineProps({
  allSessions: {
    type: Array,
    default: () => [],
  },
  t: {
    type: Object,
    required: true,
  },
});

defineEmits(['close']);

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfThisWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const todaySessions = computed(() => {
  const start = startOfToday();
  return props.allSessions.filter((s) => s.timestamp >= start);
});

const thisWeekSessions = computed(() => {
  const start = startOfThisWeek();
  return props.allSessions.filter((s) => s.timestamp >= start);
});
</script>

<style scoped>
.global-stats {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.global-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.global-stats-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--accent-color, #4ecdc4);
}

.back-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--card-border, #333);
  background: var(--btn-secondary-bg, #444);
  color: var(--text-color, #fff);
  font-size: 0.9rem;
  cursor: pointer;
}

.back-btn:hover {
  background: var(--card-border, #333);
}

.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  flex: 1;
  align-content: start;
}

.period-card {
  background: var(--card-bg, #2a2a2a);
  border: 2px solid var(--card-border, #333);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.period-title {
  margin: 0;
  font-size: 1rem;
  color: var(--accent-color, #4ecdc4);
  border-bottom: 1px solid var(--card-border, #333);
  padding-bottom: 0.5rem;
}

.no-data-message {
  text-align: center;
  color: var(--text-secondary, #aaa);
  padding: 2rem;
}
</style>
