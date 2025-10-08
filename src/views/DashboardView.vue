<template>
  <div class="dashboard">
    <h1>Bienvenido al Panel de Control</h1>
    <p>Login exitoso. Aquí iría la interfaz principal del sistema.</p>
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
</style>
