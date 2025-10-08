<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #e0f2fe;
}

::-webkit-scrollbar-thumb {
  background: #0891b2;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0e7490;
}

/* Dark mode scrollbar */
.dark-mode ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: #22d3ee;
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #06b6d4;
}
</style>
