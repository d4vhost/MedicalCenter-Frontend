<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Portal del Administrador</h1>
        <p class="welcome-message">Gestión Integral del Sistema Médico</p>
      </div>
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
    </header>

    <main class="content">
      <div class="sidebar">
        <nav class="nav">
          <button @click="activeTab = 'dashboard'" :class="{ active: activeTab === 'dashboard' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zm-10 0V15h8v6z" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button @click="activeTab = 'empleados'" :class="{ active: activeTab === 'empleados' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"
              />
            </svg>
            <span>Médicos</span>
          </button>
          <button @click="activeTab = 'pacientes'" :class="{ active: activeTab === 'pacientes' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
              />
            </svg>
            <span>Pacientes</span>
          </button>
          <button @click="activeTab = 'centros'" :class="{ active: activeTab === 'centros' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
              />
            </svg>
            <span>Centros Médicos</span>
          </button>
          <button
            @click="activeTab = 'especialidades'"
            :class="{ active: activeTab === 'especialidades' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-2h2v2zm2-4h-6v-2h6v2z"
              />
            </svg>
            <span>Especialidades</span>
          </button>
          <button
            @click="activeTab = 'medicamentos'"
            :class="{ active: activeTab === 'medicamentos' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M15.02 3.02c.03 0 .06.01.1.01c5.52.12 1.3 16.2-4.21 16.09c-5.51-.11-1.3-16.19 4.2-16.08l-.1-.02zM12 21.03c-1.42 0-2.8-.54-3.82-1.55c-2.11-2.11-2.11-5.52 0-7.64c2.11-2.11 5.52-2.11 7.64 0c2.11 2.11 2.11 5.52 0 7.64c-1.02 1.01-2.4 1.55-3.82 1.55zM6 3.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S7.38 3.5 6 3.5z"
              />
            </svg>
            <span>Medicamentos</span>
          </button>
          <button @click="activeTab = 'perfil'" :class="{ active: activeTab === 'perfil' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            <span>Mi Perfil</span>
          </button>
        </nav>
        <button @click="logout" class="btn-logout-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5l-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div class="main-panel">
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <div class="tab-header">
            <h2>Dashboard General</h2>
          </div>
          <div class="stats-grid-full">
            <div class="stat-card">
              <h3>Médicos Activos</h3>
              <p class="stat-number">{{ totalMedicos }}</p>
            </div>
            <div class="stat-card">
              <h3>Pacientes Registrados</h3>
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
            <div class="chart-container card">
              <h4>Consultas por Día (Últimos 7 Días)</h4>
              <v-chart class="chart" :option="consultasPorDiaOptions" autoresize />
            </div>
            <div class="chart-container card">
              <h4>Distribución de Médicos por Centro</h4>
              <v-chart class="chart" :option="medicosPorCentroOptions" autoresize />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'empleados'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Médicos</h2>
            <button @click="abrirModalEmpleado(null)" class="btn-primary">Nuevo Médico</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaEmpleado"
              placeholder="Buscar por nombre, cédula o especialidad..."
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
                <span class="item-subtitle"
                  >C.I: {{ medico.cedula }} | {{ medico.especialidadNombre }}</span
                >
              </div>
              <span class="chip">{{ medico.nombreCentroMedico }}</span>
            </li>
            <li v-if="!paginatedMedicos.length" class="readonly-item">
              No se encontraron médicos.
            </li>
          </ul>
          <div class="pagination" v-if="medicosFiltrados.length > 0">
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
            <h2>Estadísticas de Pacientes</h2>
          </div>
          <div class="patient-charts-layout">
            <div class="chart-container card">
              <h4>Estado de Pacientes</h4>
              <v-chart class="chart" :option="pacientesDiagnosticadosOptions" autoresize />
            </div>
            <div class="chart-container card">
              <h4>Distribución por Edad</h4>
              <v-chart class="chart" :option="patientAgeDistributionOptions" autoresize />
            </div>
          </div>
          <div class="patient-lists-grid">
            <div class="patient-list-container">
              <div class="list-header">
                <h4>Diagnosticados</h4>
                <span class="list-counter">{{ pacientesDiagnosticadosFiltrados.length }}</span>
              </div>
              <input
                type="text"
                class="mini-search"
                v-model="busquedaDiagnosticados"
                placeholder="Buscar por cédula..."
              />
              <ul class="patient-list">
                <li v-for="paciente in pacientesDiagnosticadosFiltrados" :key="paciente.id">
                  <span class="status-dot diagnosed"></span>
                  <div class="item-main-info">
                    <span class="item-title">{{ paciente.nombre }} {{ paciente.apellido }}</span>
                    <span class="item-subtitle">C.I: {{ paciente.cedula }}</span>
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
                type="text"
                class="mini-search"
                v-model="busquedaNoDiagnosticados"
                placeholder="Buscar por cédula..."
              />
              <ul class="patient-list">
                <li v-for="paciente in pacientesNoDiagnosticadosFiltrados" :key="paciente.id">
                  <span class="status-dot not-diagnosed"></span>
                  <div class="item-main-info">
                    <span class="item-title">{{ paciente.nombre }} {{ paciente.apellido }}</span>
                    <span class="item-subtitle">C.I: {{ paciente.cedula }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'centros'" class="tab-content">
          <div class="tab-header">
            <h2>Centros Médicos</h2>
            <button @click="abrirModalCentro(null)" class="btn-primary">Nuevo Centro</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaCentro"
              placeholder="Buscar por nombre de centro..."
            />
          </div>
          <ul class="item-list">
            <li
              v-for="centro in paginatedCentros"
              :key="centro.id"
              @click="abrirModalCentro(centro)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ centro.nombre }}</span>
                <span class="item-subtitle">{{ centro.direccion }}</span>
              </div>
            </li>
            <li v-if="!paginatedCentros.length" class="readonly-item">
              No hay centros médicos registrados.
            </li>
          </ul>
          <div class="pagination" v-if="centrosFiltrados.length > 0">
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
            <h2>Especialidades Médicas</h2>
            <button @click="abrirModalEspecialidad(null)" class="btn-primary">
              Nueva Especialidad
            </button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaEspecialidad"
              placeholder="Buscar por nombre de especialidad..."
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
            <li v-if="!paginatedEspecialidades.length" class="readonly-item">
              No hay especialidades registradas.
            </li>
          </ul>
          <div class="pagination" v-if="especialidadesFiltradas.length > 0">
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
            <h2>Catálogo de Medicamentos</h2>
            <button @click="abrirModalMedicamento(null)" class="btn-primary">
              Nuevo Medicamento
            </button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaMedicamento"
              placeholder="Buscar por nombre o laboratorio..."
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
                <span class="item-subtitle"
                  >{{ medicamento.nombreComercial }} - {{ medicamento.laboratorio }}</span
                >
              </div>
            </li>
            <li v-if="!paginatedMedicamentos.length" class="readonly-item">
              No hay medicamentos registrados.
            </li>
          </ul>
          <div class="pagination" v-if="medicamentosFiltrados.length > 0">
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
              <div class="profile-avatar">AD</div>
              <h3>{{ adminInfo.nombreCompleto }}</h3>
              <p>{{ adminInfo.rol }}</p>
              <span class="chip">{{ adminInfo.nombreCentroMedico }}</span>
            </div>
            <div class="card edit-profile-card">
              <h4>Actualizar Información Personal</h4>
              <form @submit.prevent="actualizarPerfil" class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="admin-cedula">Cédula</label>
                    <input
                      type="text"
                      id="admin-cedula"
                      v-model="adminEditable.cedula"
                      required
                      maxlength="10"
                    />
                  </div>
                  <div class="form-group">
                    <label for="admin-centro">Centro Médico</label>
                    <select id="admin-centro" v-model="adminEditable.centroMedicoId" required>
                      <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                        {{ centro.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="admin-nombre">Nombre</label>
                    <input
                      type="text"
                      id="admin-nombre"
                      v-model="adminEditable.nombre"
                      required
                      maxlength="40"
                    />
                  </div>
                  <div class="form-group">
                    <label for="admin-apellido">Apellido</label>
                    <input
                      type="text"
                      id="admin-apellido"
                      v-model="adminEditable.apellido"
                      required
                      maxlength="40"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="admin-password">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="admin-password"
                    v-model="adminEditable.password"
                    placeholder="Dejar en blanco para no cambiar"
                  />
                </div>
                <button type="submit" class="btn-primary full-width">Guardar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Transition name="modal-fade">
      <div v-if="showModalEmpleado" class="modal-overlay" @click.self="cerrarModalEmpleado">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>{{ modoEdicion ? 'Editar Médico' : 'Nuevo Médico' }}</h3>
            <button @click="cerrarModalEmpleado" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedico">
              <div class="form-row">
                <div class="form-group">
                  <label for="emp-cedula">Cédula *</label>
                  <input
                    type="text"
                    id="emp-cedula"
                    v-model="medicoEditable.cedula"
                    required
                    maxlength="10"
                    :disabled="modoEdicion"
                  />
                </div>
                <div class="form-group">
                  <label for="emp-nombre">Nombre *</label>
                  <input
                    type="text"
                    id="emp-nombre"
                    v-model="medicoEditable.nombre"
                    required
                    maxlength="40"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="emp-apellido">Apellido *</label>
                  <input
                    type="text"
                    id="emp-apellido"
                    v-model="medicoEditable.apellido"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="emp-password">{{
                    modoEdicion ? 'Nueva Contraseña (opcional)' : 'Contraseña *'
                  }}</label>
                  <input
                    type="password"
                    id="emp-password"
                    v-model="medicoEditable.password"
                    :required="!modoEdicion"
                    minlength="6"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="med-especialidad">Especialidad *</label>
                  <select id="med-especialidad" v-model="medicoEditable.especialidadId" required>
                    <option disabled value="">Seleccione una especialidad</option>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="emp-centro">Centro Médico *</label>
                  <select id="emp-centro" v-model="medicoEditable.centroMedicoId" required>
                    <option disabled value="">Seleccione un centro</option>
                    <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                      {{ centro.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicion"
                  type="button"
                  @click="eliminarMedico(medicoEditable.id!)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalEmpleado" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">Guardar</button>
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
            <h3>{{ modoEdicionCentro ? 'Editar Centro Médico' : 'Nuevo Centro Médico' }}</h3>
            <button @click="cerrarModalCentro" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCentro">
              <div class="form-group">
                <label for="centro-nombre">Nombre *</label>
                <input
                  type="text"
                  id="centro-nombre"
                  v-model="centroEditable.nombre"
                  required
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="centro-direccion">Dirección</label>
                <input
                  type="text"
                  id="centro-direccion"
                  v-model="centroEditable.direccion"
                  maxlength="60"
                />
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionCentro"
                  type="button"
                  @click="eliminarCentro(centroEditable.id!)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalCentro" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">Guardar</button>
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
            <h3>{{ modoEdicionEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad' }}</h3>
            <button @click="cerrarModalEspecialidad" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEspecialidad">
              <div class="form-group">
                <label for="esp-nombre">Nombre *</label>
                <input
                  type="text"
                  id="esp-nombre"
                  v-model="especialidadEditable.nombre"
                  required
                  maxlength="40"
                />
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionEspecialidad"
                  type="button"
                  @click="eliminarEspecialidad(especialidadEditable.id!)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalEspecialidad" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">Guardar</button>
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
            <h3>{{ modoEdicionMedicamento ? 'Editar Medicamento' : 'Nuevo Medicamento' }}</h3>
            <button @click="cerrarModalMedicamento" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedicamento">
              <div class="form-group">
                <label for="med-generico">Nombre Genérico *</label>
                <input
                  type="text"
                  id="med-generico"
                  v-model="medicamentoEditable.nombreGenerico"
                  required
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="med-comercial">Nombre Comercial</label>
                <input
                  type="text"
                  id="med-comercial"
                  v-model="medicamentoEditable.nombreComercial"
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="med-laboratorio">Laboratorio</label>
                <input
                  type="text"
                  id="med-laboratorio"
                  v-model="medicamentoEditable.laboratorio"
                  maxlength="40"
                />
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionMedicamento"
                  type="button"
                  @click="eliminarMedicamento(medicamentoEditable.id!)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalMedicamento" class="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" class="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, provide, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const router = useRouter()
const activeTab = ref('dashboard')
const isDarkMode = ref(false)

provide(
  THEME_KEY,
  computed(() => (isDarkMode.value ? 'dark' : 'light')),
)

// ... (Interfaces remain the same)
interface Empleado {
  id: number
  cedula: string
  nombre: string
  apellido: string
  password?: string
  rol: string
  centroMedicoId: number
  nombreCentroMedico: string
}
interface Medico {
  id: number
  empleadoId: number
  nombreCompleto: string
  especialidadId: number
  nombreEspecialidad: string
  centroMedicoId: number
  nombreCentroMedico: string
}
interface MedicoDetallado extends Empleado {
  medicoId: number
  especialidadId: number
  especialidadNombre: string
}
interface Paciente {
  id: number
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento?: string
  direccion?: string
}
interface CentroMedico {
  id: number
  nombre: string
  direccion: string
}
interface Especialidad {
  id: number
  nombre: string
}
interface Medicamento {
  id: number
  nombreGenerico: string
  nombreComercial?: string
  laboratorio?: string
}
interface Diagnostico {
  id: number
  consultaId: number
  enfermedadNombre: string
}
interface Consulta {
  id: number
  pacienteId: number
  medicoId: number
  fechaHora: string
}
interface DecodedToken {
  sub: string
  role: string
  given_name: string
}
interface AdminInfo {
  id: number
  nombreCompleto: string
  rol: string
  cedula: string
  nombreCentroMedico: string
}
interface AdminEditable {
  nombre: string
  apellido: string
  password?: string
  cedula?: string
  centroMedicoId?: number
}
interface PacienteConEstado extends Paciente {
  isDiagnosed: boolean
}

const empleados = ref<Empleado[]>([])
const medicos = ref<Medico[]>([])
const pacientes = ref<Paciente[]>([])
const centrosMedicos = ref<CentroMedico[]>([])
const especialidades = ref<Especialidad[]>([])
const medicamentos = ref<Medicamento[]>([])
const diagnosticos = ref<Diagnostico[]>([])
const consultas = ref<Consulta[]>([])
const adminInfo = ref<Partial<AdminInfo>>({})
const adminEditable = reactive<AdminEditable>({ nombre: '', apellido: '', password: '' })
const adminEmpleadoId = ref<number>(0)

const ITEMS_PER_PAGE_DEFAULT = 8
const ITEMS_PER_PAGE_STATIC = 5
const currentPageMedicos = ref(1)
const currentPageCentros = ref(1)
const currentPageEspecialidades = ref(1)
const currentPageMedicamentos = ref(1)

const busquedaEmpleado = ref('')
const busquedaCentro = ref('')
const busquedaEspecialidad = ref('')
const busquedaMedicamento = ref('')
const busquedaDiagnosticados = ref('')
const busquedaNoDiagnosticados = ref('')

const showModalEmpleado = ref(false)
const modoEdicion = ref(false)
const medicoEditable = ref<Partial<MedicoDetallado & { password?: string }>>({})
const showModalCentro = ref(false)
const modoEdicionCentro = ref(false)
const centroEditable = ref<Partial<CentroMedico>>({})
const showModalEspecialidad = ref(false)
const modoEdicionEspecialidad = ref(false)
const especialidadEditable = ref<Partial<Especialidad>>({})
const showModalMedicamento = ref(false)
const modoEdicionMedicamento = ref(false)
const medicamentoEditable = ref<Partial<Medicamento>>({})

const totalMedicos = computed(() => medicos.value.length)
const totalPacientes = computed(() => pacientes.value.length)
const totalCentros = computed(() => centrosMedicos.value.length)
const totalEspecialidades = computed(() => especialidades.value.length)

const diagnosedPatientIds = computed(() => {
  const patientIds = new Set<number>()
  const consultasConDiagnostico = new Set(diagnosticos.value.map((d) => d.consultaId))
  consultas.value.forEach((c) => {
    if (consultasConDiagnostico.has(c.id)) {
      patientIds.add(c.pacienteId)
    }
  })
  return patientIds
})

const totalPacientesDiagnosticados = computed(() => diagnosedPatientIds.value.size)

const medicosDetallados = computed((): MedicoDetallado[] => {
  const empleadosMap = new Map(empleados.value.map((e) => [e.id, e]))
  const especialidadesMap = new Map(especialidades.value.map((e) => [e.id, e.nombre]))
  return medicos.value
    .map((medico) => {
      const empleado = empleadosMap.get(medico.empleadoId)
      return {
        ...(empleado || {}),
        id: empleado?.id || 0,
        medicoId: medico.id,
        especialidadId: medico.especialidadId,
        especialidadNombre: especialidadesMap.get(medico.especialidadId) || 'N/A',
      } as MedicoDetallado
    })
    .filter((m) => m.id)
})

const medicosFiltrados = computed(() => {
  const busqueda = busquedaEmpleado.value.toLowerCase()
  if (!busqueda) return medicosDetallados.value
  return medicosDetallados.value.filter(
    (med) =>
      med.nombre.toLowerCase().includes(busqueda) ||
      med.apellido.toLowerCase().includes(busqueda) ||
      med.cedula.includes(busqueda) ||
      med.especialidadNombre.toLowerCase().includes(busqueda),
  )
})

const totalPagesMedicos = computed(() =>
  Math.ceil(medicosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT),
)
const paginatedMedicos = computed(() => {
  const start = (currentPageMedicos.value - 1) * ITEMS_PER_PAGE_DEFAULT
  return medicosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
})

const pacientesConEstado = computed((): PacienteConEstado[] => {
  const ids = diagnosedPatientIds.value
  return pacientes.value.map((p) => ({
    ...p,
    isDiagnosed: ids.has(p.id),
  }))
})

const pacientesDiagnosticados = computed(() =>
  pacientesConEstado.value.filter((p) => p.isDiagnosed),
)
const pacientesNoDiagnosticados = computed(() =>
  pacientesConEstado.value.filter((p) => !p.isDiagnosed),
)

const pacientesDiagnosticadosFiltrados = computed(() => {
  const busqueda = busquedaDiagnosticados.value
  if (!busqueda) return pacientesDiagnosticados.value
  return pacientesDiagnosticados.value.filter((p) => p.cedula.includes(busqueda))
})

const pacientesNoDiagnosticadosFiltrados = computed(() => {
  const busqueda = busquedaNoDiagnosticados.value
  if (!busqueda) return pacientesNoDiagnosticados.value
  return pacientesNoDiagnosticados.value.filter((p) => p.cedula.includes(busqueda))
})

const centrosFiltrados = computed(() => {
  const busqueda = busquedaCentro.value.toLowerCase()
  if (!busqueda) return centrosMedicos.value
  return centrosMedicos.value.filter((c) => c.nombre.toLowerCase().includes(busqueda))
})
const totalPagesCentros = computed(() =>
  Math.ceil(centrosFiltrados.value.length / ITEMS_PER_PAGE_STATIC),
)
const paginatedCentros = computed(() => {
  const start = (currentPageCentros.value - 1) * ITEMS_PER_PAGE_STATIC
  return centrosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_STATIC)
})

const especialidadesFiltradas = computed(() => {
  const busqueda = busquedaEspecialidad.value.toLowerCase()
  if (!busqueda) return especialidades.value
  return especialidades.value.filter((e) => e.nombre.toLowerCase().includes(busqueda))
})
const totalPagesEspecialidades = computed(() =>
  Math.ceil(especialidadesFiltradas.value.length / ITEMS_PER_PAGE_STATIC),
)
const paginatedEspecialidades = computed(() => {
  const start = (currentPageEspecialidades.value - 1) * ITEMS_PER_PAGE_STATIC
  return especialidadesFiltradas.value.slice(start, start + ITEMS_PER_PAGE_STATIC)
})

const medicamentosFiltrados = computed(() => {
  const busqueda = busquedaMedicamento.value.toLowerCase()
  return medicamentos.value.filter(
    (med) =>
      !busqueda ||
      med.nombreGenerico.toLowerCase().includes(busqueda) ||
      med.nombreComercial?.toLowerCase().includes(busqueda) ||
      med.laboratorio?.toLowerCase().includes(busqueda),
  )
})
const totalPagesMedicamentos = computed(() =>
  Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT),
)
const paginatedMedicamentos = computed(() => {
  const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE_DEFAULT
  return medicamentosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
})

const baseChartOptions = computed(() => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'inherit', color: isDarkMode.value ? '#f5f5f7' : '#1d1d1f' },
  tooltip: {
    trigger: 'item',
    backgroundColor: isDarkMode.value ? '#2c2c2e' : '#ffffff',
    borderColor: isDarkMode.value ? '#38383a' : '#e5e5e5',
    textStyle: { color: isDarkMode.value ? '#f5f5f7' : '#1d1d1f' },
  },
}))

const consultasPorDiaOptions = computed(() => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const data = last7Days.map(
    (day) =>
      consultas.value.filter(
        (c) => c.fechaHora && new Date(c.fechaHora).toISOString().split('T')[0] === day,
      ).length,
  )

  return {
    ...baseChartOptions.value,
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: last7Days.map((d) =>
        new Date(d + 'T00:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }),
      ),
      axisLine: { lineStyle: { color: isDarkMode.value ? '#38383a' : '#e5e5e5' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: isDarkMode.value ? '#38383a' : '#e5e5e5' } },
    },
    series: [{ data, type: 'bar', color: '#0891b2' }],
  }
})

const medicosPorCentroOptions = computed(() => {
  const data = centrosMedicos.value.map((centro) => ({
    name: centro.nombre,
    value: empleados.value.filter((e) => e.rol === 'Medico' && e.centroMedicoId === centro.id)
      .length,
  }))
  return {
    ...baseChartOptions.value,
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: baseChartOptions.value.textStyle.color },
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  }
})

const pacientesDiagnosticadosOptions = computed(() => ({
  ...baseChartOptions.value,
  tooltip: { trigger: 'item' },
  legend: {
    top: '5%',
    left: 'center',
    textStyle: { color: baseChartOptions.value.textStyle.color },
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: [
        { value: totalPacientesDiagnosticados.value, name: 'Diagnosticados' },
        {
          value: totalPacientes.value - totalPacientesDiagnosticados.value,
          name: 'No Diagnosticados',
        },
      ],
    },
  ],
}))

const patientAgeDistributionOptions = computed(() => {
  const ageGroups = {
    '0-18': 0,
    '19-30': 0,
    '31-45': 0,
    '46+': 0,
  }
  const currentYear = new Date().getFullYear()
  pacientes.value.forEach((p) => {
    if (p.fechaNacimiento) {
      const birthYear = new Date(p.fechaNacimiento).getFullYear()
      const age = currentYear - birthYear
      if (age <= 18) ageGroups['0-18']++
      else if (age <= 30) ageGroups['19-30']++
      else if (age <= 45) ageGroups['31-45']++
      else ageGroups['46+']++
    }
  })
  return {
    ...baseChartOptions.value,
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: Object.keys(ageGroups),
      axisLine: { lineStyle: { color: isDarkMode.value ? '#38383a' : '#e5e5e5' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: isDarkMode.value ? '#38383a' : '#e5e5e5' } },
    },
    series: [
      {
        data: Object.values(ageGroups),
        type: 'bar',
        colorBy: 'series',
        color: '#22d3ee',
      },
    ],
  }
})

// ... (Other methods like toggleTheme, aplicarTema, etc., remain the same)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

const aplicarTema = () => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}

const nextPage = (tab: string) => {
  switch (tab) {
    case 'medicos':
      if (currentPageMedicos.value < totalPagesMedicos.value) currentPageMedicos.value++
      break
    case 'centros':
      if (currentPageCentros.value < totalPagesCentros.value) currentPageCentros.value++
      break
    case 'especialidades':
      if (currentPageEspecialidades.value < totalPagesEspecialidades.value)
        currentPageEspecialidades.value++
      break
    case 'medicamentos':
      if (currentPageMedicamentos.value < totalPagesMedicamentos.value)
        currentPageMedicamentos.value++
      break
  }
}

const prevPage = (tab: string) => {
  switch (tab) {
    case 'medicos':
      if (currentPageMedicos.value > 1) currentPageMedicos.value--
      break
    case 'centros':
      if (currentPageCentros.value > 1) currentPageCentros.value--
      break
    case 'especialidades':
      if (currentPageEspecialidades.value > 1) currentPageEspecialidades.value--
      break
    case 'medicamentos':
      if (currentPageMedicamentos.value > 1) currentPageMedicamentos.value--
      break
  }
}

// ... (cargarDatos, cargarAdminInfo, and all other CRUD methods remain the same)
const cargarDatos = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      logout()
      return
    }
    const decodedToken = jwtDecode<DecodedToken>(token)
    adminEmpleadoId.value = Number(decodedToken.sub)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const [
      resEmpleados,
      resMedicos,
      resPacientes,
      resCentros,
      resEspecialidades,
      resMedicamentos,
      resConsultas,
      resDiagnosticos,
    ] = await Promise.all([
      apiClient.get('/Empleados', config),
      apiClient.get('/Medicos', config),
      apiClient.get('/Pacientes', config),
      apiClient.get('/CentrosMedicos', config),
      apiClient.get('/Especialidades', config),
      apiClient.get('/Medicamentos', config),
      apiClient.get('/ConsultasMedicas', config),
      apiClient.get('/Diagnosticos', config),
    ])
    empleados.value = resEmpleados.data
    medicos.value = resMedicos.data
    pacientes.value = resPacientes.data
    centrosMedicos.value = resCentros.data
    especialidades.value = resEspecialidades.data
    medicamentos.value = resMedicamentos.data
    consultas.value = resConsultas.data
    diagnosticos.value = resDiagnosticos.data
    cargarAdminInfo()
  } catch (error) {
    console.error('Error cargando datos:', error)
    if (isAxiosError(error) && error.response?.status === 401) logout()
  }
}

const cargarAdminInfo = () => {
  const admin = empleados.value.find((e) => e.id === adminEmpleadoId.value)
  if (admin) {
    adminInfo.value = {
      id: admin.id,
      nombreCompleto: `${admin.nombre} ${admin.apellido}`,
      rol: admin.rol,
      cedula: admin.cedula,
      nombreCentroMedico: admin.nombreCentroMedico,
    }
    adminEditable.nombre = admin.nombre
    adminEditable.apellido = admin.apellido
    adminEditable.cedula = admin.cedula
    adminEditable.centroMedicoId = admin.centroMedicoId
    adminEditable.password = ''
  }
}

const abrirModalEmpleado = (medico: MedicoDetallado | null) => {
  if (medico) {
    modoEdicion.value = true
    medicoEditable.value = { ...medico }
    delete medicoEditable.value.password
  } else {
    modoEdicion.value = false
    medicoEditable.value = { rol: 'Medico', centroMedicoId: undefined, especialidadId: undefined }
  }
  showModalEmpleado.value = true
}
const cerrarModalEmpleado = () => (showModalEmpleado.value = false)

const guardarMedico = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return
  const { id, nombre, apellido, cedula, password, centroMedicoId, especialidadId } =
    medicoEditable.value
  try {
    if (modoEdicion.value) {
      await apiClient.put(
        `/Empleados/${id}`,
        { cedula, nombre, apellido, password, rol: 'Medico', centroMedicoId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const medicoOriginal = medicosDetallados.value.find((m) => m.id === id)
      if (medicoOriginal)
        await apiClient.put(
          `/Medicos/${medicoOriginal.medicoId}`,
          { empleadoId: id, especialidadId },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      alert(`Dr. ${nombre} ${apellido} actualizado con éxito`)
    } else {
      const resEmpleado = await apiClient.post(
        '/Empleados',
        { cedula, nombre, apellido, password, rol: 'Medico', centroMedicoId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      await apiClient.post(
        '/Medicos',
        { empleadoId: resEmpleado.data.id, especialidadId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const espNombre = especialidades.value.find((e) => e.id === especialidadId)?.nombre || ''
      alert(`Dr. ${nombre} ${apellido} (${espNombre}) creado con éxito`)
    }
    cerrarModalEmpleado()
    await cargarDatos()
  } catch (error) {
    console.error('Error al guardar médico:', error)
    alert('No se pudo guardar la información del médico.')
  }
}

const eliminarMedico = async (empleadoId: number) => {
  if (!confirm('¿Está seguro de eliminar este médico?')) return
  const token = localStorage.getItem('authToken')
  try {
    const medico = medicos.value.find((m) => m.empleadoId === empleadoId)
    if (medico)
      await apiClient.delete(`/Medicos/${medico.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    await apiClient.delete(`/Empleados/${empleadoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Médico eliminado con éxito.')
    cerrarModalEmpleado()
    await cargarDatos()
  } catch (error) {
    console.error('Error al eliminar médico:', error)
    alert('No se pudo eliminar el médico.')
  }
}

const abrirModalCentro = (centro: CentroMedico | null) => {
  modoEdicionCentro.value = !!centro
  centroEditable.value = centro ? { ...centro } : {}
  showModalCentro.value = true
}
const cerrarModalCentro = () => (showModalCentro.value = false)
const guardarCentro = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    if (modoEdicionCentro.value)
      await apiClient.put(`/CentrosMedicos/${centroEditable.value.id}`, centroEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    else
      await apiClient.post('/CentrosMedicos', centroEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    cerrarModalCentro()
    await cargarDatos()
  } catch {
    alert('Error guardando centro')
  }
}
const eliminarCentro = async (id: number) => {
  if (!confirm('¿Eliminar centro?')) return
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/CentrosMedicos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    cerrarModalCentro()
    await cargarDatos()
  } catch {
    alert('Error eliminando centro')
  }
}

const abrirModalEspecialidad = (especialidad: Especialidad | null) => {
  modoEdicionEspecialidad.value = !!especialidad
  especialidadEditable.value = especialidad ? { ...especialidad } : {}
  showModalEspecialidad.value = true
}
const cerrarModalEspecialidad = () => (showModalEspecialidad.value = false)
const guardarEspecialidad = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    if (modoEdicionEspecialidad.value)
      await apiClient.put(
        `/Especialidades/${especialidadEditable.value.id}`,
        especialidadEditable.value,
        { headers: { Authorization: `Bearer ${token}` } },
      )
    else
      await apiClient.post('/Especialidades', especialidadEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    cerrarModalEspecialidad()
    await cargarDatos()
  } catch {
    alert('Error guardando especialidad')
  }
}
const eliminarEspecialidad = async (id: number) => {
  if (!confirm('¿Eliminar especialidad?')) return
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Especialidades/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    cerrarModalEspecialidad()
    await cargarDatos()
  } catch {
    alert('Error eliminando especialidad')
  }
}

const abrirModalMedicamento = (medicamento: Medicamento | null) => {
  modoEdicionMedicamento.value = !!medicamento
  medicamentoEditable.value = medicamento ? { ...medicamento } : {}
  showModalMedicamento.value = true
}
const cerrarModalMedicamento = () => (showModalMedicamento.value = false)
const guardarMedicamento = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    if (modoEdicionMedicamento.value)
      await apiClient.put(
        `/Medicamentos/${medicamentoEditable.value.id}`,
        medicamentoEditable.value,
        { headers: { Authorization: `Bearer ${token}` } },
      )
    else
      await apiClient.post('/Medicamentos', medicamentoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
    cerrarModalMedicamento()
    await cargarDatos()
  } catch {
    alert('Error guardando medicamento')
  }
}
const eliminarMedicamento = async (id: number) => {
  if (!confirm('¿Eliminar medicamento?')) return
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Medicamentos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    cerrarModalMedicamento()
    await cargarDatos()
  } catch {
    alert('Error eliminando medicamento')
  }
}

const actualizarPerfil = async () => {
  const token = localStorage.getItem('authToken')
  if (!adminInfo.value.id || !token) return

  const payload: Partial<Empleado> = { ...adminEditable, rol: adminInfo.value.rol }
  if (!adminEditable.password) {
    delete payload.password
  } else if (adminEditable.password.length < 4) {
    alert('La contraseña debe tener al menos 4 caracteres.')
    return
  }
  try {
    await apiClient.put(`/Empleados/${adminInfo.value.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Perfil actualizado con éxito')
    adminEditable.password = ''
    await cargarDatos()
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    alert('No se pudo actualizar el perfil.')
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  aplicarTema()
  cargarDatos()
})

watch(isDarkMode, () => {
  provide(THEME_KEY, isDarkMode.value ? 'dark' : 'light')
})
</script>

<style scoped>
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
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-color);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}
.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.02em;
  margin: 0;
}
.welcome-message {
  font-size: 0.9rem;
  color: var(--text-muted-color);
  font-weight: 400;
  margin-top: 0.125rem;
}
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted-color);
  padding: 0.625rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.theme-toggle:hover {
  color: var(--headline-color);
  background-color: var(--secondary-color);
  transform: scale(1.05);
}
.content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}
.sidebar {
  width: 260px;
  flex-shrink: 0;
  padding: 2rem 1.25rem;
  border-right: 1px solid var(--border-color);
  background-color: var(--surface-color);
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.nav button {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  font-size: 0.9375rem;
  font-weight: 400;
  border-radius: var(--radius-md);
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all var(--transition-fast);
}
.nav button:hover {
  background-color: var(--secondary-color);
  color: var(--headline-color);
}
.nav button.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}
.nav button svg {
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}
.nav button.active svg {
  opacity: 1;
}
.btn-logout-sidebar {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-muted-color);
  font-size: 0.9375rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  width: 100%;
  transition: all var(--transition-fast);
}
.btn-logout-sidebar:hover {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--danger-color);
}
.dark-mode .btn-logout-sidebar:hover {
  background-color: rgba(255, 69, 58, 0.15);
}
.main-panel {
  flex-grow: 1;
  padding: 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}
.tab-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0;
  border-bottom: none;
  flex-shrink: 0;
}
.tab-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--headline-color);
  margin: 0;
  letter-spacing: -0.03em;
}

.patient-tab-layout {
  gap: 1.5rem;
  overflow: hidden;
}

.patient-charts-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  flex-shrink: 0;
}
.patient-charts-layout .chart {
  min-height: 220px;
}
.patient-lists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex-grow: 1;
  overflow: hidden;
}
.patient-list-container {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.list-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}
.list-counter {
  background-color: var(--secondary-color);
  color: var(--text-muted-color);
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
}
.mini-search {
  width: 100%;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  transition: all var(--transition-fast);
}
.mini-search:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
}
.dark-mode .mini-search {
  background-color: var(--surface-elevated);
}
.dark-mode .mini-search:focus {
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2);
}
.patient-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.patient-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background-color: transparent;
  transition: background-color var(--transition-fast);
}
.patient-list li:hover {
  background-color: var(--secondary-color);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}
.status-dot.diagnosed {
  background-color: var(--success-color);
}
.status-dot.not-diagnosed {
  background-color: var(--danger-color);
}

.stats-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background-color: var(--surface-color);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted-color);
}
.stat-card .stat-number {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--headline-color);
}
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.dashboard-charts .chart {
  min-height: 300px;
}
.chart-container {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.chart-container h4 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  flex-shrink: 0;
}
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex-grow: 1;
  overflow-y: auto;
}
.item-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.item-list li.readonly-item {
  cursor: default;
}
.item-list li:hover:not(.readonly-item) {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.item-list li:active:not(.readonly-item) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
.item-main-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.item-title {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
}
.item-subtitle {
  font-size: 0.8125rem;
  color: var(--text-muted-color);
  font-weight: 400;
}
.chip {
  background-color: var(--secondary-color);
  color: var(--text-color);
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}
.filters {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.filters input {
  flex-grow: 1;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.filters input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}
.dark-mode .filters input:focus {
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.2);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  flex-shrink: 0;
  padding: 0.5rem;
}
.pagination button {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.pagination button:hover:not(:disabled) {
  background-color: var(--secondary-hover);
  border-color: var(--text-muted-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination span {
  color: var(--text-muted-color);
  font-size: 0.875rem;
  font-weight: 500;
}
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  letter-spacing: -0.01em;
}
.dark-mode .btn-primary {
  color: #000;
}
.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.btn-secondary:hover {
  background-color: var(--secondary-hover);
  border-color: var(--text-muted-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-danger {
  background-color: var(--danger-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.btn-danger:hover {
  background-color: var(--danger-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.form-row {
  display: flex;
  gap: 1.5rem;
}
.form-row .form-group {
  flex: 1;
}
.form-group {
  margin-bottom: 1.25rem;
}
.form-group:last-child {
  margin-bottom: 0;
}
.form-group label {
  display: block;
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted-color);
  font-weight: 500;
  letter-spacing: -0.01em;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  font-family: inherit;
}
.form-group select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}
.dark-mode .form-group select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2398989d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
}
.form-group textarea {
  resize: vertical;
  min-height: 100px;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}
.dark-mode .form-group input:focus,
.dark-mode .form-group select:focus,
.dark-mode .form-group textarea:focus {
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.2);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--transition-normal);
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform var(--transition-normal);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.96) translateY(10px);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dark-mode .modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
.modal-content {
  background-color: var(--surface-color);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 600px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}
.modal-content.modal-lg {
  max-width: 800px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  background-color: var(--surface-color);
}
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}
.btn-close-modal {
  background: var(--secondary-color);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-muted-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  line-height: 1;
}
.btn-close-modal:hover {
  color: var(--headline-color);
  background-color: var(--secondary-hover);
  transform: scale(1.05);
}
.modal-body {
  padding: 2rem;
  overflow-y: auto;
}
.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2.5rem;
  align-items: stretch;
}
.card {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
}
.profile-card {
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}
.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #0e7490);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 20px rgba(8, 145, 178, 0.3);
}
.dark-mode .profile-avatar {
  background: linear-gradient(135deg, var(--primary-color), #06b6d4);
  box-shadow: 0 4px 20px rgba(34, 211, 238, 0.4);
}
.profile-card h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}
.profile-card p {
  color: var(--text-muted-color);
  margin-top: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
}
.btn-primary.full-width {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
}
.edit-profile-card .profile-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.edit-profile-card .profile-form .btn-primary {
  margin-top: auto;
}
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
</style>
