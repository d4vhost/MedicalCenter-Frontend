<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Navbar Fija -->
    <header class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12L22 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12V22"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12L2 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 9.5L17 14.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="logo-text">MedicalCenter</span>
        </div>
        <nav class="nav-links">
          <a href="#services">Servicios</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
          <button class="btn-login" @click="$router.push('/login')">Acceso al Sistema</button>
        </nav>
      </div>
    </header>

    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="main-headline">Innovación y Cuidado en Cada Diagnóstico.</h1>
          <p class="sub-headline">
            Bienvenido a MedicalCenter, donde la tecnología avanzada se une a la atención humana
            para ofrecerle la mejor experiencia en salud.
          </p>
          <button class="btn-primary" @click="$router.push('/login')">Agendar una Cita</button>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="services-section">
        <div class="container">
          <h2 class="section-title">Servicios Integrales para su Bienestar</h2>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>Emergencias 24/7</h3>
              <p>Atención inmediata con especialistas de turno para cualquier urgencia.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              </div>
              <h3>Consulta Externa</h3>
              <p>Acceso a una amplia red de especialistas en más de 30 áreas médicas.</p>
            </div>
            <div class="service-card">
              <div class="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3>Laboratorio Clínico</h3>
              <p>Resultados precisos y rápidos con la tecnología más avanzada del país.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="about-section">
        <div class="container about-content">
          <div class="about-text">
            <h2 class="section-title">Nuestra Misión: Su Salud</h2>
            <p>
              En MedicalCenter, combinamos décadas de experiencia médica con un enfoque innovador y
              tecnológico. Creemos que la atención médica debe ser accesible, personalizada y, sobre
              todo, humana. Nuestro sistema distribuido garantiza que su información esté segura y
              disponible en cualquiera de nuestros centros, ofreciendo una atención continua y sin
              interrupciones.
            </p>
          </div>
          <div class="about-image">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Doctora mostrando resultados en una tablet"
            />
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <footer id="contact" class="footer">
        <div class="container footer-content">
          <p>&copy; 2025 MedicalCenter. Todos los derechos reservados.</p>
          <div class="contact-info">
            <span>info@medicalcenter.com</span> | <span>(03) 299-8200</span>
          </div>
        </div>
      </footer>
    </main>

    <!-- Dark Mode Toggle -->
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
    >
      <svg
        v-if="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
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
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }
})
</script>

<style scoped>
/* Define las variables de color para el tema claro y oscuro */
.page-container {
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --primary-color: #0891b2;
  --secondary-color: #06b6d4;
  --surface-color: #ffffff;
  --border-color: #dee2e6;
  --headline-color: #0f172a;
  --text-muted-color: #6c757d;

  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.page-container.dark-mode {
  --bg-color: #0f172a;
  --text-color: #e2e8f0;
  --primary-color: #22d3ee;
  --secondary-color: #0891b2;
  --surface-color: #1e293b;
  --border-color: #334155;
  --headline-color: #f1f5f9;
  --text-muted-color: #94a3b8;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}
.dark-mode .navbar {
  background-color: rgba(15, 23, 42, 0.7);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
}

.nav-links a {
  margin: 0 1rem;
  text-decoration: none;
  color: var(--text-muted-color);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.btn-login {
  padding: 0.5rem 1rem;
  border: 1px solid var(--primary-color);
  background-color: transparent;
  color: var(--primary-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-login:hover {
  background-color: var(--primary-color);
  color: white;
}
.dark-mode .btn-login:hover {
  color: var(--bg-color);
}

/* Hero Section */
.hero {
  padding-top: 10rem;
  padding-bottom: 6rem;
  text-align: center;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.main-headline {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.sub-headline {
  font-size: 1.25rem;
  color: var(--text-muted-color);
  margin-bottom: 2.5rem;
}

.btn-primary {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(8, 145, 178, 0.2);
}

.dark-mode .btn-primary {
  color: var(--bg-color);
}

.dark-mode .btn-primary:hover {
  box-shadow: 0 10px 20px rgba(34, 211, 238, 0.2);
}

/* Services Section */
.services-section {
  padding: 5rem 0;
  background-color: var(--surface-color);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--headline-color);
  margin-bottom: 3.5rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-card {
  background-color: var(--bg-color);
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
}
.dark-mode .service-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.service-icon {
  display: inline-flex;
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.dark-mode .service-icon {
  color: var(--bg-color);
}

.service-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--headline-color);
}

.service-card p {
  color: var(--text-muted-color);
  line-height: 1.6;
}

/* About Section */
.about-section {
  padding: 6rem 0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.about-image img {
  width: 100%;
  border-radius: 16px;
}

.about-text .section-title {
  text-align: left;
  margin-bottom: 2rem;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-muted-color);
}

/* Footer */
.footer {
  padding: 2rem 0;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted-color);
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: var(--primary-color);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 992px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
  .about-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-links a {
    display: none;
  }
  .main-headline {
    font-size: 2.5rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .services-grid {
    grid-template-columns: 1fr;
  }
  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
