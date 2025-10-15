<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
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
          <a @click="$router.push('/portal-consultas')">Consultas</a>
          <button class="btn-login" @click="$router.push('/login')">Acceso al Sistema</button>
        </nav>
      </div>
    </header>

    <main>
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

      <footer id="contact" class="footer">
        <div class="container footer-content">
          <p>&copy; 2025 MedicalCenter. Todos los derechos reservados.</p>
          <div class="contact-info">
            <span>info@medicalcenter.com</span> | <span>(03) 299-8200</span>
          </div>
        </div>
      </footer>
    </main>

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
/* ===== VARIABLES DE TEMA ===== */
.page-container {
  --bg-color: #fafafa;
  --surface-color: #ffffff;
  --surface-elevated: #ffffff;
  --border-color: #e5e5e5;
  --border-light: #f0f0f0;
  --text-color: #1d1d1f;
  --headline-color: #000000;
  --text-muted-color: #86868b;
  --primary-color: #0891b2;
  --primary-hover: #0e7490;
  --secondary-color: #f5f5f7;
  --secondary-hover: #e8e8ed;
  --danger-color: #ff3b30;
  --danger-hover: #d70015;
  --success-color: #34c759;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;

  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);
}

.page-container.dark-mode {
  --bg-color: #000000;
  --surface-color: #1c1c1e;
  --surface-elevated: #2c2c2e;
  --border-color: #38383a;
  --border-light: #2c2c2e;
  --text-color: #f5f5f7;
  --headline-color: #ffffff;
  --text-muted-color: #98989d;
  --primary-color: #0891b2;
  --primary-hover: #0a7a94;
  --secondary-color: #2c2c2e;
  --secondary-hover: #3a3a3c;
  --danger-color: #ff453a;
  --danger-hover: #ff6961;
  --success-color: #32d74b;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

/* ===== NAVBAR ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  z-index: 1000;
  transition: all var(--transition-normal);
}

.dark-mode .navbar {
  background-color: rgba(0, 0, 0, 0.8);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-links a {
  padding: 0.625rem 1rem;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9375rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.nav-links a:hover {
  color: var(--primary-color);
  background-color: var(--secondary-color);
}

.btn-login {
  padding: 0.625rem 1.25rem;
  margin-left: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--surface-color);
  color: var(--text-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-login:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ===== HERO SECTION ===== */
.hero {
  padding-top: 10rem;
  padding-bottom: 6rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.main-headline {
  font-size: 3.75rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.sub-headline {
  font-size: 1.375rem;
  color: var(--text-muted-color);
  margin-bottom: 2.5rem;
  line-height: 1.5;
  font-weight: 400;
}

.btn-primary {
  padding: 1rem 2.5rem;
  font-size: 1.0625rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  letter-spacing: -0.01em;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

/* ===== SERVICES SECTION ===== */
.services-section {
  padding: 6rem 0;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 4rem;
  letter-spacing: -0.03em;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.service-card {
  background-color: var(--bg-color);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.service-icon {
  display: inline-flex;
  padding: 1.125rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  transition: all var(--transition-normal);
}

.service-card:hover .service-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(8, 145, 178, 0.3);
}

.dark-mode .service-card:hover .service-icon {
  box-shadow: 0 8px 20px rgba(8, 145, 178, 0.4);
}

.service-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}

.service-card p {
  color: var(--text-muted-color);
  line-height: 1.6;
  font-size: 0.9375rem;
}

/* ===== ABOUT SECTION ===== */
.about-section {
  padding: 6rem 0;
  background-color: var(--bg-color);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5rem;
}

.about-image img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal);
}

.about-image img:hover {
  transform: scale(1.02);
}

.about-text .section-title {
  text-align: left;
  margin-bottom: 2rem;
}

.about-text p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-muted-color);
}

/* ===== FOOTER ===== */
.footer {
  padding: 2.5rem 0;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted-color);
  font-size: 0.9375rem;
}

.contact-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* ===== THEME TOGGLE ===== */
.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  color: var(--primary-color);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: var(--shadow-lg);
  background-color: var(--surface-elevated);
}

.theme-toggle:active {
  transform: scale(1.05);
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted-color);
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: var(--border-color);
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted-color);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .main-headline {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1.5rem;
  }

  .nav-links a:not(.btn-login) {
    display: none;
  }

  .hero {
    padding-top: 8rem;
    padding-bottom: 4rem;
  }

  .hero-content {
    padding: 0 1.5rem;
  }

  .main-headline {
    font-size: 2.25rem;
  }

  .sub-headline {
    font-size: 1.125rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .services-section,
  .about-section {
    padding: 4rem 0;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-card {
    padding: 2rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .theme-toggle {
    width: 50px;
    height: 50px;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .main-headline {
    font-size: 1.875rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .btn-primary {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}

/* ===== ANIMACIONES ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-card {
  animation: fadeInUp 0.6s ease-out;
}

.service-card:nth-child(1) {
  animation-delay: 0.1s;
}

.service-card:nth-child(2) {
  animation-delay: 0.2s;
}

.service-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* ===== TRANSICIONES SUAVES ===== */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: var(--transition-fast);
  transition-timing-function: ease;
}

button,
a {
  transition-property: background-color, border-color, color, transform, box-shadow;
  transition-duration: var(--transition-fast);
}
</style>
