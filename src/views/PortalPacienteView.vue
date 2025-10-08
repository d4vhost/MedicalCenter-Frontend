<template>
  <div class="portal">
    <h1>Portal de Paciente</h1>
    <p>Bienvenido. Aquí puedes consultar tu historial médico y citas.</p>
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('authToken')
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
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
