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
          <button @click="setActiveTab('dashboard')" :class="{ active: activeTab === 'dashboard' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zm-10 0V15h8v6z" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button @click="setActiveTab('empleados')" :class="{ active: activeTab === 'empleados' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"
              />
            </svg>
            <span>Médicos</span>
          </button>
          <button @click="setActiveTab('pacientes')" :class="{ active: activeTab === 'pacientes' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
              />
            </svg>
            <span>Pacientes</span>
          </button>
          <button @click="setActiveTab('centros')" :class="{ active: activeTab === 'centros' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
              />
            </svg>
            <span>Centros Médicos</span>
          </button>
          <button
            @click="setActiveTab('especialidades')"
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
            @click="setActiveTab('medicamentos')"
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
          <button
            @click="
              setActiveTab('perfil')
              initializeAdminEditable()
            "
            :class="{ active: activeTab === 'perfil' }"
          >
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
          <div class="tab-header"><h2>Dashboard General</h2></div>
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
              <v-chart class="chart" :option="chartOptions.consultasPorDia" autoresize />
            </div>
            <div class="chart-container card">
              <h4>Distribución de Médicos por Centro</h4>
              <v-chart class="chart" :option="chartOptions.medicosPorCentro" autoresize />
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
          <div class="tab-header"><h2>Estadísticas de Pacientes</h2></div>
          <div class="patient-charts-layout">
            <div class="chart-container card">
              <h4>Estado de Pacientes</h4>
              <v-chart class="chart" :option="chartOptions.pacientesDiagnosticados" autoresize />
            </div>
            <div class="chart-container card">
              <h4>Distribución por Edad</h4>
              <v-chart class="chart" :option="chartOptions.patientAgeDistribution" autoresize />
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
          <div class="tab-header"><h2>Mi Perfil</h2></div>
          <div class="profile-grid">
            <div class="card profile-card">
              <div class="profile-avatar">AD</div>
              <h3>{{ adminInfo.nombreCompleto }}</h3>
              <p>{{ adminInfo.rol }}</p>
              <span class="chip">{{ adminInfo.nombreCentroMedico }}</span>
            </div>
            <div class="card edit-profile-card">
              <h4>Actualizar Información Personal</h4>
              <form @submit.prevent="actualizarPerfil(adminEditable)" class="profile-form">
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
            <form @submit.prevent="guardarMedico(medicoEditable, modoEdicion)">
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
                  @click="eliminarMedico(medicoEditable.id)"
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
            <form @submit.prevent="guardarCentro(centroEditable, modoEdicionCentro)">
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
                  @click="eliminarCentro(centroEditable.id)"
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
            <form
              @submit.prevent="guardarEspecialidad(especialidadEditable, modoEdicionEspecialidad)"
            >
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
                  @click="eliminarEspecialidad(especialidadEditable.id)"
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
            <form @submit.prevent="guardarMedicamento(medicamentoEditable, modoEdicionMedicamento)">
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
                  @click="eliminarMedicamento(medicamentoEditable.id)"
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
import { onMounted, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import '@/styles/portalAdmin.css'

import { useAdminData } from '@/composables/portalAdmin/useAdminData'
import { useAdminUI } from '@/composables/portalAdmin/useAdminUI'
import { useAdminModals } from '@/composables/portalAdmin/useAdminModals'
import { useAdminActions } from '@/composables/portalAdmin/useAdminActions'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const {
  centrosMedicos,
  especialidades,
  adminInfo,
  busquedaEmpleado,
  busquedaCentro,
  busquedaEspecialidad,
  busquedaMedicamento,
  busquedaDiagnosticados,
  busquedaNoDiagnosticados,
  currentPageMedicos,
  currentPageCentros,
  currentPageEspecialidades,
  currentPageMedicamentos,
  totalMedicos,
  totalPacientes,
  totalCentros,
  totalEspecialidades,
  medicosFiltrados,
  totalPagesMedicos,
  paginatedMedicos,
  pacientesDiagnosticadosFiltrados,
  pacientesNoDiagnosticadosFiltrados,
  centrosFiltrados,
  totalPagesCentros,
  paginatedCentros,
  especialidadesFiltradas,
  totalPagesEspecialidades,
  paginatedEspecialidades,
  medicamentosFiltrados,
  totalPagesMedicamentos,
  paginatedMedicamentos,
  consultasPorDiaOptions,
  medicosPorCentroOptions,
  pacientesDiagnosticadosOptions,
  patientAgeDistributionOptions,
  cargarDatos,
} = useAdminData()

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

const {
  showModalEmpleado,
  showModalCentro,
  showModalEspecialidad,
  showModalMedicamento,
  modoEdicion,
  modoEdicionCentro,
  modoEdicionEspecialidad,
  modoEdicionMedicamento,
  medicoEditable,
  centroEditable,
  especialidadEditable,
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
  logout,
} = useAdminActions(
  cargarDatos,
  cerrarModalEmpleado,
  cerrarModalCentro,
  cerrarModalEspecialidad,
  cerrarModalMedicamento,
  adminInfo,
)

const chartOptions = computed(() => ({
  consultasPorDia: consultasPorDiaOptions(isDarkMode.value).value,
  medicosPorCentro: medicosPorCentroOptions(isDarkMode.value).value,
  pacientesDiagnosticados: pacientesDiagnosticadosOptions(isDarkMode.value).value,
  patientAgeDistribution: patientAgeDistributionOptions(isDarkMode.value).value,
}))

onMounted(() => {
  cargarDatos()
})

watch(
  adminInfo,
  (newInfo) => {
    if (newInfo.id) {
      initializeAdminEditable()
    }
  },
  { immediate: true, deep: true },
)
</script>
