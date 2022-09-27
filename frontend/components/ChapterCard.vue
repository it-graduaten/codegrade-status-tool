<template>
  <div class="card">
    <h5 class="card-header">
      {{ chapter.number }}&nbsp;&dash;&nbsp;{{ chapter.name }} {{ chapter.uuid }}
    </h5>
    <div class="card-body">
      {{ chapter.assignments.length }}
      <ul class="list-group list-group-flush">
        <AssignmentSummary :assignment="a" v-for="a in chapter.assignments" />
      </ul>
    </div>
    <div class="card-footer text-muted">Deadline: {{ deadline }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  chapter: Object,
});

const deadline = computed(() => {
  const date = new Date(props.chapter.deadline);
  const day = date.getDate();
  // Add leading 0 to day
  const dayString = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  // Add leading 0 to month
  const monthString = month < 10 ? `0${month}` : month;
  const year = date.getFullYear();
  return `${dayString}/${monthString}/${year}`;
});
</script>
