<template>
  <div class="page-container">
    <header class="header">
      <h1 class="title">Portal del Administrador</h1>
      <button @click="logout" class="btn-secondary">Cerrar Sesión</button>
    </header>

    <main class="content">
      <div class="welcome-message">
        <h2>Bienvenido, Administrador</h2>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  background-color: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #334155;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.content {
  background-color: #1e293b;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.welcome-message {
  text-align: center;
}

.welcome-message h2 {
  font-size: 2rem;
  color: #f1f5f9;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  background-color: #334155;
  color: #e2e8f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: #475569;
}
</style>
