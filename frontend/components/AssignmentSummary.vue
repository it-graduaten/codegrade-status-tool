<template>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <span :class="assignment.mandatory ? 'fw-bold' : ''">{{ assignment.name }}</span>
    <span class="badge bg-primary rounded-pill" :class="color">{{
      assignment.grade ?? "-"
    }}</span>
  </li>
</template>
<script setup>
const props = defineProps({
  assignment: Object,
});

const color = computed(() => {
  if (props.assignment.grade === undefined) return "bg-secondary";
  if (props.assignment.grade == 10) return "bg-success";
  if (props.assignment.grade >= 5) return "bg-warning";
  return "bg-danger";
});
</script>
