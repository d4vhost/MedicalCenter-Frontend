<template>
  <div class="sidebar" :class="{ 'is-open': isOpen }">
    <button
      v-if="isOpen && isSmallScreen"
      class="btn-close-sidebar"
      @click="$emit('closeSidebar')"
      aria-label="Cerrar menú"
    >
      &times;
    </button>

    <nav class="nav">
      <button
        @click="$emit('setActiveTab', 'consultas')"
        :class="{ active: activeTab === 'consultas' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
          />
        </svg>
        <span>CONSULTAS</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'pacientes')"
        :class="{ active: activeTab === 'pacientes' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
          />
        </svg>
        <span>PACIENTES</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'medicamentos')"
        :class="{ active: activeTab === 'medicamentos' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15.02 3.02c.03 0 .06.01.1.01c5.52.12 1.3 16.2-4.21 16.09c-5.51-.11-1.3-16.19 4.2-16.08l-.1-.02zM12 21.03c-1.42 0-2.8-.54-3.82-1.55c-2.11-2.11-2.11-5.52 0-7.64c2.11-2.11 5.52-2.11 7.64 0c2.11 2.11 2.11 5.52 0 7.64c-1.02 1.01-2.4 1.55-3.82 1.55zM6 3.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S7.38 3.5 6 3.5z"
          />
        </svg>
        <span>MEDICAMENTOS</span>
      </button>
      <button @click="$emit('setActiveTab', 'perfil')" :class="{ active: activeTab === 'perfil' }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
        <span>MI PERFIL</span>
      </button>
    </nav>
    <button @click="$emit('logout')" class="btn-logout-sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5l-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
        />
      </svg>
      <span>Cerrar Sesión</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: string
  isOpen: boolean
  isSmallScreen: boolean // Prop añadida
}>()

defineEmits(['setActiveTab', 'logout', 'closeSidebar']) // Evento 'closeSidebar' añadido
</script>
