<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

const route = useRoute();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
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
        <ul class="navbar-nav">
            <li class="nav-item">
            <RouterLink
                class="nav-link rounded"
                :class="{ active: route.path === '/' }"
                to="/"
            >HOME</RouterLink>
            </li>
            <li v-if="!userStore.isAuthenticated" class="nav-item">
            <RouterLink
                class="nav-link rounded"
                :class="{ active: route.path === '/login' }"
                to="/login"
            >LOGIN</RouterLink>
            </li>
            <li v-if="userStore.isAuthenticated && userStore.role !== 'Admin'" class="nav-item">
            <RouterLink
                class="nav-link rounded"
                :class="{ active: route.path === '/registrations' }"
                to="/registrations"
            >MINHAS INSCRIÇÕES</RouterLink>
            </li>
            <li v-if="userStore.isAuthenticated && userStore.role === 'Admin'" class="nav-item">
                <RouterLink
                    class="nav-link rounded"
                    :class="{ active: route.path === '/admin/eventos' }"
                    to="/admin/eventos"
                >MANTER EVENTOS</RouterLink>
            </li>
            <li v-if="userStore.isAuthenticated && userStore.role === 'Admin'" class="nav-item">
                <RouterLink
                    class="nav-link rounded"
                    :class="{ active: route.path === '/admin/categorias' }"
                    to="/admin/categorias"
                >MANTER CATEGORIAS</RouterLink>
            </li>
        </ul>
        <div v-if="userStore.isAuthenticated" class="ms-auto d-flex align-items-center justify-content-center gap-3">
            <h5 class="text-white">
                {{ userStore.username }}
            </h5>
            <button class="btn btn-danger" @click="handleLogout">Sair</button>
        </div>
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
