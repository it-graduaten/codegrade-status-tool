<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Codegrade Status Tool</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent"></div>
      <div class="d-flex">
        <select
          class="form-select me-2"
          aria-label="Default select example"
          v-model="selectedCourseId"
        >
          <option :value="0">Please select a course</option>
          <option :value="course.codegradeId" v-for="course in courses">
            {{ course.name }}
          </option>
        </select>
        <input
          class="form-control me-2"
          type="search"
          placeholder="Student number"
          aria-label="Student number"
          id="rnumber"
          v-model="studentNumber"
        />
        <button
          class="btn btn-outline-primary"
          @click="getCourseWithAssignmentsAndSubmissions"
        >
          Submit
        </button>
      </div>
    </div>
  </nav>
  <!-- Content -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
    <symbol id="check-circle-fill" viewBox="0 0 16 16">
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
      />
    </symbol>
    <symbol id="info-fill" viewBox="0 0 16 16">
      <path
        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
      />
    </symbol>
    <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
      <path
        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
      />
    </symbol>
  </svg>
  <div class="container mt-3">
    <div
      class="alert alert-primary d-flex align-items-center"
      role="alert"
      v-if="initialLoad"
    >
      <svg class="bi flex-shrink-0 me-2 alert-icon" role="img" aria-label="Info:">
        <use xlink:href="#info-fill" />
      </svg>
      <div>
        Please start by selecting a course and entering your student number. Then click
        &quot;Submit&quot; to fetch your data.
      </div>
    </div>
    <div
      class="alert alert-danger d-flex align-items-center"
      role="alert"
      v-if="hasError"
    >
      <svg class="bi flex-shrink-0 me-2 alert-icon" role="img" aria-label="Info:">
        <use xlink:href="#exclamation-triangle-fill" />
      </svg>
      <div class="d-flex flex-grow-1">
        <ul class="m-0">
          <li v-for="m in errorMessages">{{ m }}</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="container-fluid" v-if="!loading">
    <div class="row" v-if="selectedCourse != null">
      <div class="col-3 mt-3" v-for="c in selectedCourse.chapters" :key="c.uuid">
        <ChapterCard :chapter="c" />
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center" v-else>
    <div class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="container">
    <footer
      class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"
    >
      <div class="col-md-4 d-flex align-items-center">
        <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          <svg class="bi" width="30" height="24"><use xlink:href="#bootstrap" /></svg>
        </a>
        <span class="mb-3 mb-md-0 text-muted">&copy; Joren Synaeve</span>
      </div>

      <div class="col-md-4 justify-content-end d-flex text-muted">
        <p>
          Codegrade Status Tool is a hobby project by Joren Synaeve. This site is not
          affiliated with any of it's data sources. Use at own risk.
        </p>
      </div>
    </footer>
  </div>
</template>
<script setup>
/* Data */
const studentNumber = ref("");
let courses = ref([]);
const selectedCourseId = ref(0);
const selectedCourse = ref(null);
const loading = ref(false);
const initialLoad = ref(true);
const errorMessages = ref([]);
const hasError = ref(false);

const getCourses = async () => {
  courses.value = await $fetch(`/api/course`);
};

const getCourseWithAssignmentsAndSubmissions = () => {
  initialLoad.value = false;
  clearError();
  checkForError();

  if (hasError.value) return;
  loading.value = true;

  $fetch(
    `/api/submission?courseId=${selectedCourseId.value}&studentNumber=${studentNumber.value}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      selectedCourse.value = res;
      setLocalStorage();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

const clearError = () => {
  errorMessages.value = [];
  hasError.value = false;
};

const checkForError = () => {
  if (
    selectedCourseId.value === null ||
    selectedCourseId.value === undefined ||
    selectedCourseId.value === 0
  ) {
    errorMessages.value.push("Please select a course.");
    hasError.value = true;
  }
  if (
    studentNumber.value === null ||
    studentNumber.value === undefined ||
    studentNumber.value === ""
  ) {
    errorMessages.value.push("Please enter a student number.");
    hasError.value = true;
  }
};

const getLocalStorage = () => {
  const courseId = localStorage.getItem("codegrade-status-tool-courseId");
  if (courseId == undefined || courseId == null) selectedCourse.value = 0;
  else selectedCourseId.value = courseId;

  const rnumber = localStorage.getItem("codegrade-status-tool-studentNumber");
  if (rnumber == undefined || rnumber == null) studentNumber.value = "";
  else studentNumber.value = rnumber;
};

const setLocalStorage = () => {
  localStorage.setItem("codegrade-status-tool-courseId", selectedCourseId.value);
  localStorage.setItem("codegrade-status-tool-studentNumber", studentNumber.value);
};

getCourses();

onMounted(() => {
  getLocalStorage();
});
</script>
<script></script>
