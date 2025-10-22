<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div>
        <h1 class="title">Portal Administrativo</h1>
        <p class="welcome-message">Bienvenido, {{ adminInfo.nombreCompleto }}</p>
      </div>
      <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle theme">
        <svg
          v-if="!isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </header>

    <div class="content">
      <aside class="sidebar">
        <nav class="nav">
          <button @click="setActiveTab('dashboard')" :class="{ active: activeTab === 'dashboard' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>
          <button @click="setActiveTab('medicos')" :class="{ active: activeTab === 'medicos' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            Médicos
          </button>
          <button @click="setActiveTab('pacientes')" :class="{ active: activeTab === 'pacientes' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Pacientes
          </button>
          <button @click="setActiveTab('centros')" :class="{ active: activeTab === 'centros' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Centros Médicos
          </button>
          <button
            @click="setActiveTab('especialidades')"
            :class="{ active: activeTab === 'especialidades' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Especialidades
          </button>
          <button
            @click="setActiveTab('medicamentos')"
            :class="{ active: activeTab === 'medicamentos' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
            Medicamentos
          </button>
          <button @click="goToProfile" :class="{ active: activeTab === 'perfil' }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mi Perfil
          </button>
        </nav>
        <button @click="logout" class="btn-logout-sidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar Sesión
        </button>
      </aside>

      <main class="main-panel">
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <div class="tab-header">
            <h2>Dashboard</h2>
          </div>

          <div class="stats-grid-full">
            <div class="stat-card">
              <h3>Médicos</h3>
              <p class="stat-number">{{ totalMedicos }}</p>
            </div>
            <div class="stat-card">
              <h3>Pacientes</h3>
              <p class="stat-number">{{ totalPacientes }}</p>
            </div>
            <div class="stat-card">
              <h3>Centros Médicos</h3>
              <p class="stat-number">{{ totalCentros }}</p>
            </div>
            <div class="stat-card">
              <h3>Especialidades</h3>
              <p class="stat-number">{{ totalEspecialidades }}</p>
            </div>
          </div>

          <div class="charts-grid dashboard-charts">
            <div class="card chart-container">
              <h4>Consultas últimos 7 días</h4>
              <v-chart class="chart" :option="chartConsultasPorDia" autoresize />
            </div>
            <div class="card chart-container">
              <h4>Médicos por Centro</h4>
              <v-chart class="chart" :option="chartMedicosPorCentro" autoresize />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'medicos'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Médicos</h2>
            <button @click="abrirModalEmpleado(null)" class="btn-primary">Agregar Médico</button>
          </div>

          <div class="filters">
            <input
              v-model="busquedaEmpleado"
              type="text"
              placeholder="Buscar por nombre, apellido, cédula o especialidad..."
            />
          </div>

          <ul class="item-list">
            <li
              v-for="medico in paginatedMedicos"
              :key="medico.id"
              @click="abrirModalEmpleado(medico)"
            >
              <div class="item-main-info">
                <span class="item-title">Dr. {{ medico.nombre }} {{ medico.apellido }}</span>
                <span class="item-subtitle">{{ medico.cedula }}</span>
              </div>
              <span class="chip">{{ medico.especialidadNombre }}</span>
            </li>
          </ul>

          <div class="pagination">
            <button @click="prevPage('medicos')" :disabled="currentPageMedicos === 1">
              Anterior
            </button>
            <span>Página {{ currentPageMedicos }} de {{ totalPagesMedicos }}</span>
            <button
              @click="nextPage('medicos')"
              :disabled="currentPageMedicos === totalPagesMedicos"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'pacientes'" class="tab-content patient-tab-layout">
          <div class="tab-header">
            <h2>Gestión de Pacientes</h2>
          </div>

          <div class="patient-charts-layout">
            <div class="card chart-container">
              <h4>Distribución por Edad</h4>
              <v-chart class="chart" :option="chartDistribucionEdad" autoresize />
            </div>
            <div class="card chart-container">
              <h4>Estado de Diagnóstico</h4>
              <v-chart class="chart" :option="chartPacientesDiagnosticados" autoresize />
            </div>
          </div>

          <div class="patient-lists-grid">
            <div class="patient-list-container">
              <div class="list-header">
                <h4>Diagnosticados</h4>
                <span class="list-counter">{{ pacientesDiagnosticadosFiltrados.length }}</span>
              </div>
              <input
                v-model="busquedaDiagnosticados"
                type="text"
                placeholder="Buscar por cédula..."
                class="mini-search"
              />
              <ul class="patient-list">
                <li v-for="p in pacientesDiagnosticadosFiltrados" :key="p.id">
                  <span class="status-dot diagnosed"></span>
                  <div class="item-main-info">
                    <span class="item-title">{{ p.nombre }} {{ p.apellido }}</span>
                    <span class="item-subtitle">{{ p.cedula }}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="patient-list-container">
              <div class="list-header">
                <h4>No Diagnosticados</h4>
                <span class="list-counter">{{ pacientesNoDiagnosticadosFiltrados.length }}</span>
              </div>
              <input
                v-model="busquedaNoDiagnosticados"
                type="text"
                placeholder="Buscar por cédula..."
                class="mini-search"
              />
              <ul class="patient-list">
                <li v-for="p in pacientesNoDiagnosticadosFiltrados" :key="p.id">
                  <span class="status-dot not-diagnosed"></span>
                  <div class="item-main-info">
                    <span class="item-title">{{ p.nombre }} {{ p.apellido }}</span>
                    <span class="item-subtitle">{{ p.cedula }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'centros'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Centros Médicos</h2>
            <button @click="abrirModalCentro(null)" class="btn-primary">Agregar Centro</button>
          </div>

          <div class="filters">
            <input v-model="busquedaCentro" type="text" placeholder="Buscar centro médico..." />
          </div>

          <ul class="item-list">
            <li
              v-for="centro in paginatedCentros"
              :key="centro.id"
              @click="abrirModalCentro(centro)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ centro.nombre }}</span>
                <span class="item-subtitle">{{ centro.direccion || 'Sin dirección' }}</span>
              </div>
            </li>
          </ul>

          <div class="pagination">
            <button @click="prevPage('centros')" :disabled="currentPageCentros === 1">
              Anterior
            </button>
            <span>Página {{ currentPageCentros }} de {{ totalPagesCentros }}</span>
            <button
              @click="nextPage('centros')"
              :disabled="currentPageCentros === totalPagesCentros"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'especialidades'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Especialidades</h2>
            <button @click="abrirModalEspecialidad(null)" class="btn-primary">
              Agregar Especialidad
            </button>
          </div>

          <div class="filters">
            <input
              v-model="busquedaEspecialidad"
              type="text"
              placeholder="Buscar especialidad..."
            />
          </div>

          <ul class="item-list">
            <li
              v-for="especialidad in paginatedEspecialidades"
              :key="especialidad.id"
              @click="abrirModalEspecialidad(especialidad)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ especialidad.nombre }}</span>
              </div>
            </li>
          </ul>

          <div class="pagination">
            <button @click="prevPage('especialidades')" :disabled="currentPageEspecialidades === 1">
              Anterior
            </button>
            <span>Página {{ currentPageEspecialidades }} de {{ totalPagesEspecialidades }}</span>
            <button
              @click="nextPage('especialidades')"
              :disabled="currentPageEspecialidades === totalPagesEspecialidades"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'medicamentos'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Medicamentos</h2>
            <button @click="abrirModalMedicamento(null)" class="btn-primary">
              Agregar Medicamento
            </button>
          </div>

          <div class="filters">
            <input
              v-model="busquedaMedicamento"
              type="text"
              placeholder="Buscar medicamento por nombre genérico, comercial o laboratorio..."
            />
          </div>

          <ul class="item-list">
            <li
              v-for="medicamento in paginatedMedicamentos"
              :key="medicamento.id"
              @click="abrirModalMedicamento(medicamento)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ medicamento.nombreGenerico }}</span>
                <span class="item-subtitle">
                  {{ medicamento.nombreComercial || 'Sin nombre comercial' }}
                </span>
              </div>
              <span class="chip">{{ medicamento.laboratorio || 'Sin laboratorio' }}</span>
            </li>
          </ul>

          <div class="pagination">
            <button @click="prevPage('medicamentos')" :disabled="currentPageMedicamentos === 1">
              Anterior
            </button>
            <span>Página {{ currentPageMedicamentos }} de {{ totalPagesMedicamentos }}</span>
            <button
              @click="nextPage('medicamentos')"
              :disabled="currentPageMedicamentos === totalPagesMedicamentos"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'perfil'" class="tab-content">
          <div class="tab-header">
            <h2>Mi Perfil</h2>
          </div>

          <div class="profile-grid">
            <div class="card profile-card">
              <div class="profile-avatar">
                {{ adminInfo.nombreCompleto?.charAt(0).toUpperCase() }}
              </div>
              <h3>{{ adminInfo.nombreCompleto }}</h3>
              <p>{{ adminInfo.rol }}</p>
              <p>{{ adminInfo.nombreCentroMedico }}</p>
            </div>

            <div class="card edit-profile-card">
              <form @submit.prevent="actualizarPerfil(adminEditable)" class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Nombre *</label>
                    <input v-model="adminEditable.nombre" type="text" required />
                  </div>
                  <div class="form-group">
                    <label>Apellido *</label>
                    <input v-model="adminEditable.apellido" type="text" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Cédula *</label>
                  <input v-model="adminEditable.cedula" type="text" maxlength="10" required />
                </div>

                <div class="form-group">
                  <label>Centro Médico *</label>
                  <select v-model="adminEditable.centroMedicoId" required>
                    <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                      {{ centro.nombre }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Nueva Contraseña (opcional)</label>
                  <input
                    v-model="adminEditable.password"
                    type="password"
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>

                <button type="submit" class="btn-primary full-width">Actualizar Perfil</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModalEmpleado" class="modal-overlay" @click.self="cerrarModalEmpleado">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEdicion ? 'Editar Médico' : 'Agregar Médico' }}</h3>
            <button @click="cerrarModalEmpleado" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedico(medicoEditable, modoEdicion)">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="medicoEditable.nombre" type="text" required />
                </div>
                <div class="form-group">
                  <label>Apellido *</label>
                  <input v-model="medicoEditable.apellido" type="text" required />
                </div>
              </div>

              <div class="form-group">
                <label>Cédula *</label>
                <input v-model="medicoEditable.cedula" type="text" maxlength="10" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Centro Médico *</label>
                  <select v-model="medicoEditable.centroMedicoId" required>
                    <option value="">Seleccione un centro</option>
                    <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                      {{ centro.nombre }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Especialidad *</label>
                  <select v-model="medicoEditable.especialidadId" required>
                    <option value="">Seleccione una especialidad</option>
                    <option
                      v-for="especialidad in especialidades"
                      :key="especialidad.id"
                      :value="especialidad.id"
                    >
                      {{ especialidad.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group" v-if="!modoEdicion">
                <label>Contraseña *</label>
                <input v-model="medicoEditable.password" type="password" :required="!modoEdicion" />
              </div>

              <div class="form-group" v-if="modoEdicion">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  v-model="medicoEditable.password"
                  type="password"
                  placeholder="Dejar en blanco para mantener la actual"
                />
              </div>

              <div class="modal-actions">
                <button
                  v-if="modoEdicion"
                  type="button"
                  @click="eliminarMedico(medicoEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalEmpleado" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">
                  {{ modoEdicion ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="showModalCentro" class="modal-overlay" @click.self="cerrarModalCentro">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEdicionCentro ? 'Editar Centro Médico' : 'Agregar Centro Médico' }}</h3>
            <button @click="cerrarModalCentro" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCentro(centroEditable, modoEdicionCentro)">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="centroEditable.nombre" type="text" required />
              </div>

              <div class="form-group">
                <label>Dirección</label>
                <textarea v-model="centroEditable.direccion"></textarea>
              </div>

              <div class="modal-actions">
                <button
                  v-if="modoEdicionCentro"
                  type="button"
                  @click="eliminarCentro(centroEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalCentro" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">
                  {{ modoEdicionCentro ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="showModalEspecialidad" class="modal-overlay" @click.self="cerrarModalEspecialidad">
        <div class="modal-content">
          <div class="modal-header">
            <h3>
              {{ modoEdicionEspecialidad ? 'Editar Especialidad' : 'Agregar Especialidad' }}
            </h3>
            <button @click="cerrarModalEspecialidad" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="guardarEspecialidad(especialidadEditable, modoEdicionEspecialidad)"
            >
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="especialidadEditable.nombre" type="text" required />
              </div>

              <div class="modal-actions">
                <button
                  v-if="modoEdicionEspecialidad"
                  type="button"
                  @click="eliminarEspecialidad(especialidadEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalEspecialidad" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">
                  {{ modoEdicionEspecialidad ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="showModalMedicamento" class="modal-overlay" @click.self="cerrarModalMedicamento">
        <div class="modal-content">
          <div class="modal-header">
            <h3>
              {{ modoEdicionMedicamento ? 'Editar Medicamento' : 'Agregar Medicamento' }}
            </h3>
            <button @click="cerrarModalMedicamento" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedicamento(medicamentoEditable, modoEdicionMedicamento)">
              <div class="form-group">
                <label>Nombre Genérico *</label>
                <input v-model="medicamentoEditable.nombreGenerico" type="text" required />
              </div>

              <div class="form-group">
                <label>Nombre Comercial</label>
                <input v-model="medicamentoEditable.nombreComercial" type="text" />
              </div>

              <div class="form-group">
                <label>Laboratorio</label>
                <input v-model="medicamentoEditable.laboratorio" type="text" />
              </div>

              <div class="modal-actions">
                <button
                  v-if="modoEdicionMedicamento"
                  type="button"
                  @click="eliminarMedicamento(medicamentoEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalMedicamento" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">
                  {{ modoEdicionMedicamento ? 'Actualizar' : 'Crear' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useAdminData } from '@/composables/portalAdmin/useAdminData'
import { useAdminModals } from '@/composables/portalAdmin/useAdminModals'
import { useAdminActions } from '@/composables/portalAdmin/useAdminActions'
import { useAdminUI } from '@/composables/portalAdmin/useAdminUI'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const {
  centrosMedicos,
  especialidades,
  adminInfo,
  currentPageMedicos,
  currentPageCentros,
  currentPageEspecialidades,
  currentPageMedicamentos,
  busquedaEmpleado,
  busquedaCentro,
  busquedaEspecialidad,
  busquedaMedicamento,
  busquedaDiagnosticados,
  busquedaNoDiagnosticados,
  totalMedicos,
  totalPacientes,
  totalCentros,
  totalEspecialidades,
  totalPagesMedicos,
  paginatedMedicos,
  pacientesDiagnosticadosFiltrados,
  pacientesNoDiagnosticadosFiltrados,
  totalPagesCentros,
  paginatedCentros,
  totalPagesEspecialidades,
  paginatedEspecialidades,
  totalPagesMedicamentos,
  paginatedMedicamentos,
  consultasPorDiaOptions,
  medicosPorCentroOptions,
  pacientesDiagnosticadosOptions,
  patientAgeDistributionOptions,
  cargarDatos,
  logout,
} = useAdminData()

const {
  showModalEmpleado,
  modoEdicion,
  medicoEditable,
  showModalCentro,
  modoEdicionCentro,
  centroEditable,
  showModalEspecialidad,
  modoEdicionEspecialidad,
  especialidadEditable,
  showModalMedicamento,
  modoEdicionMedicamento,
  medicamentoEditable,
  adminEditable,
  initializeAdminEditable,
  abrirModalEmpleado,
  cerrarModalEmpleado,
  abrirModalCentro,
  cerrarModalCentro,
  abrirModalEspecialidad,
  cerrarModalEspecialidad,
  abrirModalMedicamento,
  cerrarModalMedicamento,
} = useAdminModals(adminInfo)

const {
  guardarMedico,
  eliminarMedico,
  guardarCentro,
  eliminarCentro,
  guardarEspecialidad,
  eliminarEspecialidad,
  guardarMedicamento,
  eliminarMedicamento,
  actualizarPerfil,
} = useAdminActions(
  cargarDatos,
  cerrarModalEmpleado,
  cerrarModalCentro,
  cerrarModalEspecialidad,
  cerrarModalMedicamento,
  adminInfo,
)

const { activeTab, isDarkMode, toggleTheme, setActiveTab, nextPage, prevPage } = useAdminUI(
  currentPageMedicos,
  totalPagesMedicos,
  currentPageCentros,
  totalPagesCentros,
  currentPageEspecialidades,
  totalPagesEspecialidades,
  currentPageMedicamentos,
  totalPagesMedicamentos,
)

const goToProfile = () => {
  setActiveTab('perfil')
  initializeAdminEditable()
}

const chartConsultasPorDia = computed(() => consultasPorDiaOptions.value(isDarkMode.value))
const chartMedicosPorCentro = computed(() => medicosPorCentroOptions.value(isDarkMode.value))
const chartPacientesDiagnosticados = computed(() =>
  pacientesDiagnosticadosOptions.value(isDarkMode.value),
)
const chartDistribucionEdad = computed(() => patientAgeDistributionOptions.value(isDarkMode.value))

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@import '@/styles/portalAdmin.css';
</style>
