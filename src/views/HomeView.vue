<template>
  <div class="welcome-page" :class="{ 'dark-mode': isDarkMode }">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hospital-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 class="hospital-name">Centro Hospitalario MedicalCenter</h1>
        <p class="hospital-tagline">Cuidando tu salud con tecnología y profesionalismo</p>
        <button class="btn-primary" @click="$router.push('/login')">Acceso al Sistema</button>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services">
      <div class="container">
        <h2 class="section-title">Nuestros Servicios</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3>Emergencias 24/7</h3>
            <p>Atención de urgencias las 24 horas del día, los 365 días del año</p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <h3>Consulta Externa</h3>
            <p>Especialistas médicos en todas las áreas de la salud</p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M3 9h18M3 15h18M15 3v18" />
              </svg>
            </div>
            <h3>Hospitalización</h3>
            <p>Habitaciones equipadas con tecnología de punta</p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3>Laboratorio Clínico</h3>
            <p>Exámenes y diagnósticos con resultados rápidos y precisos</p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Imagenología</h3>
            <p>Rayos X, Tomografías, Ecografías y más estudios</p>
          </div>

          <div class="service-card">
            <div class="service-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3>Cirugía</h3>
            <p>Quirófanos modernos para procedimientos especializados</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="info-content">
              <h3>Horario de Atención</h3>
              <p>Lunes a Viernes: 7:00 AM - 8:00 PM</p>
              <p>Sábados: 8:00 AM - 2:00 PM</p>
              <p>Emergencias: 24/7</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div class="info-content">
              <h3>Ubicación</h3>
              <p>Av. Principal y Calle Secundaria</p>
              <p>Quito, Ecuador</p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </div>
            <div class="info-content">
              <h3>Contacto</h3>
              <p>Tel: (02) 123-4567</p>
              <p>Emergencias: 911</p>
              <p>info@medicalcenter.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="container">
        <h2>¿Eres parte de nuestro personal médico?</h2>
        <p>Accede al sistema para gestionar pacientes, historias clínicas y más</p>
        <button class="btn-secondary" @click="$router.push('/login')">Iniciar Sesión</button>
      </div>
    </section>

    <!-- Dark Mode Toggle -->
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
    >
      <svg
        v-if="isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
})
</script>

<style scoped>
/* Variables de Color */
.welcome-page {
  --primary: #0891b2;
  --primary-dark: #0e7490;
  --secondary: #06b6d4;
  --accent: #22d3ee;
  --success: #10b981;
  --background: #f0f9ff;
  --surface: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border: #e0f2fe;
  --shadow: rgba(8, 145, 178, 0.1);
  min-height: 100vh;
  background: var(--background);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.welcome-page.dark-mode {
  --primary: #22d3ee;
  --primary-dark: #06b6d4;
  --secondary: #0891b2;
  --accent: #67e8f9;
  --success: #34d399;
  --background: #0f172a;
  --surface: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border: #334155;
  --shadow: rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 6rem 2rem;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hospital-logo {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hospital-logo svg {
  width: 60px;
  height: 60px;
  color: white;
}

.hospital-name {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hospital-tagline {
  font-size: 1.3rem;
  margin: 0 0 2.5rem 0;
  opacity: 0.95;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow);
}

.btn-primary {
  background: white;
  color: var(--primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: var(--primary);
  color: white;
}

.btn-secondary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

/* Services Section */
.services {
  padding: 5rem 2rem;
  background: var(--surface);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin: 0 0 3rem 0;
  color: var(--text-primary);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background: var(--background);
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
  box-shadow: 0 10px 30px var(--shadow);
}

.service-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.service-icon svg {
  width: 36px;
  height: 36px;
  color: white;
}

.service-card h3 {
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.service-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Info Section */
.info-section {
  padding: 5rem 2rem;
  background: var(--background);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.info-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px var(--shadow);
}

.info-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.info-content h3 {
  font-size: 1.3rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
}

.info-content p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  text-align: center;
  color: white;
}

.cta h2 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
}

.cta p {
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--primary);
  border: 3px solid var(--surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px var(--shadow);
  z-index: 1000;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px var(--shadow);
}

.theme-toggle svg {
  width: 28px;
  height: 28px;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .hospital-name {
    font-size: 2rem;
  }

  .hospital-tagline {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .services-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 4rem 1.5rem;
  }

  .cta h2 {
    font-size: 1.8rem;
  }
}
</style>
