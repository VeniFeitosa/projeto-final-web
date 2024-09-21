<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const url = ref(route.path);

onMounted(() => {
  console.log('Componente montado');
  console.log(route.path);
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">EventConnect</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :class="{ active: route.path === '/' }"
              to="/"
            >Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :class="{ active: route.path === '/login' }"
              to="/login"
            >Login</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Estilização da classe 'active' */
.nav-link.active {
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
}
</style>
