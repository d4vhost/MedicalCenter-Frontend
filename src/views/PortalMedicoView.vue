<template>
  <div class="portal">
    <h1>Portal del Médico</h1>
    <p>Bienvenido, Doctor. Aquí puede gestionar sus pacientes y consultas.</p>
    <button @click="logout">Cerrar Sesión</button>
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
.portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #0f172a;
  color: #e2e8f0;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
p {
  font-size: 1.2rem;
  color: #94a3b8;
}
button {
  margin-top: 2rem;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background-color: #334155;
  color: #e2e8f0;
  font-weight: 600;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #475569;
}
</style>
