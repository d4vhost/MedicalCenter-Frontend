<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Portal del Médico</h1>
        <p class="welcome-message">Bienvenido, Dr. {{ medico.nombreCompleto }}</p>
      </div>
      <button class="theme-toggle" @click="toggleTheme" aria-label="Cambiar tema">
        <svg
          v-if="!isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-5.4-5.4c0-1.81 1-3.35 2.26-4.4A8.995 8.995 0 0 0 12 3z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.73 12.73a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06zM18.01 4.58a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0zM4.58 18.01a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0z"
          />
        </svg>
      </button>
    </header>

    <main class="content">
      <div class="sidebar">
        <nav class="nav">
          <button @click="activeTab = 'consultas'" :class="{ active: activeTab === 'consultas' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
              /></svg
            ><span>Consultas</span>
          </button>
          <button @click="activeTab = 'pacientes'" :class="{ active: activeTab === 'pacientes' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              /></svg
            ><span>Pacientes</span>
          </button>
          <button
            @click="activeTab = 'medicamentos'"
            :class="{ active: activeTab === 'medicamentos' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M15.02 3.02c.03 0 .06.01.1.01c5.52.12 1.3 16.2-4.21 16.09c-5.51-.11-1.3-16.19 4.2-16.08l-.1-.02zM12 21.03c-1.42 0-2.8-.54-3.82-1.55c-2.11-2.11-2.11-5.52 0-7.64c2.11-2.11 5.52-2.11 7.64 0c2.11 2.11 2.11 5.52 0 7.64c-1.02 1.01-2.4 1.55-3.82 1.55zM6 3.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S7.38 3.5 6 3.5z"
              /></svg
            ><span>Medicamentos</span>
          </button>
          <button @click="activeTab = 'perfil'" :class="{ active: activeTab === 'perfil' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              /></svg
            ><span>Mi Perfil</span>
          </button>
        </nav>
        <button @click="logout" class="btn-logout-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5l-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            /></svg
          ><span>Cerrar Sesión</span>
        </button>
      </div>

      <div class="main-panel">
        <div v-if="activeTab === 'consultas'" class="tab-content">
          <div class="tab-header">
            <h2>Consultas Médicas</h2>
            <button @click="abrirModalNuevaConsulta" class="btn-primary">Nueva Consulta</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaConsultaCedula"
              placeholder="Buscar por Cédula Paciente..."
            /><input type="date" v-model="busquedaConsultaFecha" />
          </div>
          <ul class="item-list">
            <li
              v-for="consulta in paginatedConsultas"
              :key="consulta.id"
              @click="seleccionarConsulta(consulta)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ consulta.nombrePaciente }}</span
                ><span class="item-subtitle">{{
                  new Date(consulta.fechaHora).toLocaleString()
                }}</span>
              </div>
              <span class="chip">{{ consulta.motivo }}</span>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesConsultas > 0">
            <button @click="prevPage('consultas')" :disabled="currentPageConsultas === 1">
              Anterior</button
            ><span>Página {{ currentPageConsultas }} de {{ totalPagesConsultas }}</span
            ><button
              @click="nextPage('consultas')"
              :disabled="currentPageConsultas === totalPagesConsultas"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'pacientes'" class="tab-content">
          <div class="tab-header">
            <h2>Gestionar Pacientes</h2>
            <button @click="abrirModalNuevoPaciente" class="btn-primary">Agregar Paciente</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaPacienteCedula"
              placeholder="Buscar por Cédula..."
            />
          </div>
          <ul class="item-list">
            <li
              v-for="paciente in paginatedPacientes"
              :key="paciente.id"
              @click="seleccionarPaciente(paciente)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ paciente.nombre }} {{ paciente.apellido }}</span
                ><span class="item-subtitle">C.I: {{ paciente.cedula }}</span>
              </div>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesPacientes > 0">
            <button @click="prevPage('pacientes')" :disabled="currentPagePacientes === 1">
              Anterior</button
            ><span>Página {{ currentPagePacientes }} de {{ totalPagesPacientes }}</span
            ><button
              @click="nextPage('pacientes')"
              :disabled="currentPagePacientes === totalPagesPacientes"
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
                <span class="item-title">{{ medicamento.nombreGenerico }}</span
                ><span class="item-subtitle"
                  >{{ medicamento.nombreComercial }} - {{ medicamento.laboratorio }}</span
                >
              </div>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesMedicamentos > 0">
            <button @click="prevPage('medicamentos')" :disabled="currentPageMedicamentos === 1">
              Anterior</button
            ><span>Página {{ currentPageMedicamentos }} de {{ totalPagesMedicamentos }}</span
            ><button
              @click="nextPage('medicamentos')"
              :disabled="currentPageMedicamentos === totalPagesMedicamentos"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'perfil'" class="tab-content">
          <div class="tab-header"><h2>Panel de Médico</h2></div>
          <div class="profile-grid">
            <div class="profile-left-column">
              <div class="card profile-card">
                <div class="profile-avatar">Dr.</div>
                <h3>{{ medicoInfo.nombreCompleto }}</h3>
                <p>{{ medicoInfo.nombreEspecialidad }}</p>
                <span class="chip">{{ medicoInfo.nombreCentroMedico }}</span>
              </div>
              <div class="card upcoming-card">
                <div class="upcoming-header">
                  <h4>Próximas Citas</h4>
                  <div class="pagination-compact" v-if="totalCitasPages > 1">
                    <button @click="prevCitasPage" :disabled="upcomingAppointmentsPage === 1">
                      Anterior
                    </button>
                    <span>{{ upcomingAppointmentsPage }} de {{ totalCitasPages }}</span>
                    <button
                      @click="nextCitasPage"
                      :disabled="upcomingAppointmentsPage === totalCitasPages"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
                <ul class="upcoming-list">
                  <li v-for="cita in paginatedUpcomingAppointments" :key="cita.id">
                    <span class="upcoming-time">{{ cita.time }}</span>
                    <span class="upcoming-patient">{{ cita.patient }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="card edit-profile-card">
              <h4>Actualizar Información Personal</h4>
              <form @submit.prevent="actualizarPerfil" class="profile-form">
                <div class="form-group">
                  <label>Cédula</label>
                  <p class="readonly-field">{{ medicoInfo.cedula }}</p>
                </div>
                <div class="form-group">
                  <label for="nombre">Nombre</label
                  ><input
                    type="text"
                    id="nombre"
                    v-model="medicoEditable.nombre"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="apellido">Apellido</label
                  ><input
                    type="text"
                    id="apellido"
                    v-model="medicoEditable.apellido"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="password">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    v-model="medicoEditable.password"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <div v-if="medicoEditable.password" class="password-strength-meter">
                    <div class="strength-bar" :class="passwordStrength.className"></div>
                  </div>
                  <p
                    v-if="medicoEditable.password"
                    class="strength-text"
                    :class="passwordStrength.className"
                  >
                    {{ passwordStrength.text }}
                  </p>
                </div>
                <button type="submit" class="btn-primary full-width">Guardar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Transition name="modal-fade">
      <div
        v-if="showModalNuevaConsulta"
        class="modal-overlay"
        @click.self="showModalNuevaConsulta = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Registrar Nueva Consulta</h3>
            <button @click="showModalNuevaConsulta = false" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="crearConsulta">
              <div class="form-group">
                <label for="paciente-search">Paciente</label>
                <div class="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8M8 8a4 4 0 1 0 8 0a4 4 0 0 0-8 0m-4.75 9.5c0-2.33 4.67-3.5 7-3.5s7 1.17 7 3.5V19H3.25zM20.75 19v-1.5c0-1.39-2.5-2.4-4.88-2.87c.56-.6.88-1.4.88-2.25c0-1.93-1.57-3.5-3.5-3.5S8.75 6.47 8.75 8.4c0 .86.32 1.65.88 2.25c-2.38.47-4.88 1.48-4.88 2.87V19z"
                    /></svg
                  ><input
                    type="text"
                    id="paciente-search"
                    v-model="pacienteSearchText"
                    placeholder="Buscar paciente por nombre o cédula..."
                    @focus="showPacienteOptions = true"
                  />
                </div>
                <ul v-if="showPacienteOptions" class="combobox-options">
                  <li
                    v-for="paciente in filteredPacientes"
                    :key="paciente.id"
                    @click="selectPaciente(paciente)"
                  >
                    {{ paciente.nombre }} {{ paciente.apellido }} ({{ paciente.cedula }})
                  </li>
                </ul>
              </div>
              <div class="form-group">
                <label for="motivo">Motivo de Consulta</label>
                <div class="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M21.04 12.13c.23.5.02 1.09-.49 1.32l-3.33 1.49c-.3.13-.5.37-.59.67l-1.5 5.02c-.2.66-.92 1.05-1.59.85s-1.05-.92-.85-1.59l1.5-5.02c.22-.73.73-1.36 1.39-1.74l3.33-1.49c.67-.3 1.39.09 1.59.75M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.86 0 1.68-.13 2.45-.35c.32-.1.55-.41.55-.75V20c0-4.41 3.59-8 8-8h.34c.34 0 .65-.22.75-.55C23.87 10.1 23.9 9 22 4.53C20.74 2.92 18.27 2 15.5 2H12m0 2h3.5c1.75 0 3.61.63 4.65 1.76c.74.8 1.12 2.19.85 4.24H20c-3.31 0-6 2.69-6 6v.44c-3.41-1.08-6-4.26-6-8.19c0-4.41 3.59-8 8-8"
                    /></svg
                  ><input
                    type="text"
                    id="motivo"
                    v-model="nuevaConsulta.motivo"
                    required
                    maxlength="50"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="fecha">Fecha y Hora</label>
                <div class="input-with-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z"
                    /></svg
                  ><input
                    type="datetime-local"
                    id="fecha"
                    v-model="nuevaConsulta.fechaHora"
                    required
                  />
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" @click="showModalNuevaConsulta = false" class="btn-secondary">
                  Cancelar</button
                ><button type="submit" class="btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="consultaSeleccionada"
        class="modal-overlay"
        @click.self="consultaSeleccionada = null"
      >
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>Finalizar Consulta</h3>
            <button @click="consultaSeleccionada = null" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-subtitle">
              <strong>Paciente:</strong> {{ consultaSeleccionada.nombrePaciente }} |
              <strong>Fecha:</strong>
              {{ new Date(consultaSeleccionada.fechaHora).toLocaleString() }}
            </p>
            <form @submit.prevent="guardarDiagnosticoYPrescripcion" class="form-grid">
              <div class="form-column">
                <div class="form-group">
                  <label for="enfermedad">Enfermedad *</label
                  ><input
                    type="text"
                    id="enfermedad"
                    v-model="nuevoDiagnostico.enfermedadNombre"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="observaciones">Observaciones</label
                  ><textarea
                    id="observaciones"
                    v-model="nuevoDiagnostico.observaciones"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div class="form-column">
                <div class="form-group">
                  <label for="medicamento-search">Medicamento *</label>
                  <div class="combobox">
                    <input
                      type="text"
                      id="medicamento-search"
                      v-model="medicamentoSearchText"
                      placeholder="Buscar medicamento..."
                      @focus="showMedicamentoOptions = true"
                      required
                    />
                    <ul v-if="showMedicamentoOptions" class="combobox-options">
                      <li
                        v-for="medicamento in filteredMedicamentos"
                        :key="medicamento.id"
                        @click="selectMedicamento(medicamento)"
                      >
                        {{ medicamento.nombreGenerico }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="form-group">
                  <label for="indicaciones">Indicaciones *</label
                  ><textarea
                    id="indicaciones"
                    v-model="nuevaPrescripcion.indicaciones"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div class="modal-actions full-width">
                <button type="button" @click="consultaSeleccionada = null" class="btn-secondary">
                  Cancelar</button
                ><button type="submit" class="btn-primary">Guardar Consulta</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="showModalNuevoPaciente"
        class="modal-overlay"
        @click.self="showModalNuevoPaciente = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Agregar Nuevo Paciente</h3>
            <button @click="showModalNuevoPaciente = false" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="crearPaciente">
              <div class="form-row">
                <div class="form-group">
                  <label for="cedula-nuevo">Cédula *</label
                  ><input
                    type="text"
                    id="cedula-nuevo"
                    v-model="nuevoPaciente.cedula"
                    required
                    maxlength="10"
                  />
                </div>
                <div class="form-group">
                  <label for="nombre-nuevo">Nombre *</label
                  ><input
                    type="text"
                    id="nombre-nuevo"
                    v-model="nuevoPaciente.nombre"
                    required
                    maxlength="40"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="apellido-nuevo">Apellido *</label
                  ><input
                    type="text"
                    id="apellido-nuevo"
                    v-model="nuevoPaciente.apellido"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="fecha-nacimiento-nuevo">Fecha de Nacimiento</label
                  ><input
                    type="date"
                    id="fecha-nacimiento-nuevo"
                    v-model="nuevoPaciente.fechaNacimiento"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="direccion-nuevo">Dirección</label
                ><input
                  type="text"
                  id="direccion-nuevo"
                  v-model="nuevoPaciente.direccion"
                  maxlength="60"
                />
              </div>
              <div class="modal-actions">
                <button type="button" @click="showModalNuevoPaciente = false" class="btn-secondary">
                  Cancelar</button
                ><button type="submit" class="btn-primary">Crear Paciente</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="pacienteSeleccionado"
        class="modal-overlay"
        @click.self="pacienteSeleccionado = null"
      >
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>Historial de Paciente</h3>
            <button @click="pacienteSeleccionado = null" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="historial-section">
              <h4>Consultas Anteriores</h4>
              <ul class="item-list historial-list">
                <li v-for="consulta in historialPaciente.consultas" :key="consulta.id">
                  <div class="item-main-info">
                    <span class="item-title">{{
                      new Date(consulta.fechaHora).toLocaleString()
                    }}</span
                    ><span class="item-subtitle">Motivo: {{ consulta.motivo }}</span>
                  </div>
                  <div v-if="getDiagnosticoForConsulta(consulta.id)" class="chip diagnostico-chip">
                    {{ getDiagnosticoForConsulta(consulta.id)?.enfermedadNombre }}
                  </div>
                </li>
                <li v-if="historialPaciente.consultas.length === 0">
                  No hay consultas registradas.
                </li>
              </ul>
            </div>
            <hr />
            <h4>Editar Información del Paciente</h4>
            <form @submit.prevent="actualizarPaciente">
              <div class="form-row">
                <div class="form-group">
                  <label for="cedula-edit">Cédula</label
                  ><input
                    type="text"
                    id="cedula-edit"
                    v-model="pacienteEditable.cedula"
                    required
                    maxlength="10"
                  />
                </div>
                <div class="form-group">
                  <label for="nombre-edit">Nombre</label
                  ><input
                    type="text"
                    id="nombre-edit"
                    v-model="pacienteEditable.nombre"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="apellido-edit">Apellido</label
                  ><input
                    type="text"
                    id="apellido-edit"
                    v-model="pacienteEditable.apellido"
                    required
                    maxlength="40"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="fecha-nacimiento-edit">Fecha de Nacimiento</label
                  ><input
                    type="date"
                    id="fecha-nacimiento-edit"
                    v-model="pacienteEditable.fechaNacimiento"
                  />
                </div>
                <div class="form-group">
                  <label for="direccion-edit">Dirección</label
                  ><input
                    type="text"
                    id="direccion-edit"
                    v-model="pacienteEditable.direccion"
                    maxlength="60"
                  />
                </div>
              </div>
              <div class="modal-actions">
                <button
                  type="button"
                  @click="eliminarPaciente(pacienteEditable.id)"
                  class="btn-danger"
                >
                  Eliminar Paciente</button
                ><button type="button" @click="pacienteSeleccionado = null" class="btn-secondary">
                  Cerrar</button
                ><button type="submit" class="btn-primary">Guardar Cambios</button>
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
            <button @click="cerrarModalMedicamento" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedicamento">
              <div class="form-group">
                <label for="nombre-generico">Nombre Genérico *</label
                ><input
                  type="text"
                  id="nombre-generico"
                  v-model="medicamentoEditable.nombreGenerico"
                  required
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="nombre-comercial">Nombre Comercial</label
                ><input
                  type="text"
                  id="nombre-comercial"
                  v-model="medicamentoEditable.nombreComercial"
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="laboratorio">Laboratorio</label
                ><input
                  type="text"
                  id="laboratorio"
                  v-model="medicamentoEditable.laboratorio"
                  maxlength="40"
                />
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionMedicamento"
                  type="button"
                  @click.stop="eliminarMedicamento(medicamentoEditable.id)"
                  class="btn-danger"
                >
                  Eliminar</button
                ><button type="button" @click="cerrarModalMedicamento" class="btn-secondary">
                  Cancelar</button
                ><button type="submit" class="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'

const router = useRouter()
const activeTab = ref('consultas')
const isDarkMode = ref(false)
const ITEMS_PER_PAGE = 6

interface Medico {
  empleadoId: number
  nombreCompleto: string
}
interface MedicoInfo {
  id: number
  empleadoId: number
  nombreCompleto: string
  nombreEspecialidad: string
  nombreCentroMedico: string
  cedula: string
}
interface MedicoEditable {
  nombre: string
  apellido: string
  password?: string
}
interface Consulta {
  id: number
  fechaHora: string
  pacienteId: number
  nombrePaciente: string
  cedulaPaciente?: string
  medicoId: number
  nombreMedico: string
  motivo: string
}
interface Paciente {
  id: number
  nombre: string
  apellido: string
  cedula: string
  fechaNacimiento?: string
  direccion?: string
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
  observaciones?: string
}
interface DecodedToken {
  sub: string
  given_name: string
}
interface HistorialPaciente {
  consultas: Consulta[]
  diagnosticos: Diagnostico[]
}

const medico = ref<Medico>({ empleadoId: 0, nombreCompleto: 'Cargando...' })
const medicoInfo = ref<Partial<MedicoInfo>>({ cedula: '' })
const medicoEditable = reactive<MedicoEditable>({ nombre: '', apellido: '', password: '' })
const consultas = ref<Consulta[]>([])
const pacientes = ref<Paciente[]>([])
const medicamentos = ref<Medicamento[]>([])
const consultaSeleccionada = ref<Consulta | null>(null)
const showModalNuevaConsulta = ref(false)
const showModalNuevoPaciente = ref(false)
const showModalMedicamento = ref(false)
const modoEdicionMedicamento = ref(false)
const pacienteSeleccionado = ref<Paciente | null>(null)
const historialPaciente = ref<HistorialPaciente>({ consultas: [], diagnosticos: [] })
const busquedaConsultaCedula = ref('')
const busquedaConsultaFecha = ref('')
const currentPageConsultas = ref(1)
const busquedaPacienteCedula = ref('')
const currentPagePacientes = ref(1)
const busquedaMedicamento = ref('')
const currentPageMedicamentos = ref(1)
const nuevoPaciente = reactive<Partial<Paciente>>({})
const pacienteEditable = ref<Partial<Paciente>>({})
const nuevaConsulta = reactive<{
  pacienteId: number | null
  medicoId: number
  motivo: string
  fechaHora: string
}>({ pacienteId: null, medicoId: 0, motivo: '', fechaHora: '' })
const nuevoDiagnostico = reactive<{
  consultaId: number
  enfermedadNombre: string
  observaciones: string
}>({ consultaId: 0, enfermedadNombre: '', observaciones: '' })
const nuevaPrescripcion = reactive<{
  diagnosticoId: number
  medicamentoId: number | null
  indicaciones: string
}>({ diagnosticoId: 0, medicamentoId: null, indicaciones: '' })
const medicamentoEditable = ref<Partial<Medicamento>>({})
const pacienteSearchText = ref('')
const showPacienteOptions = ref(false)
const medicamentoSearchText = ref('')
const showMedicamentoOptions = ref(false)

const CITAS_PER_PAGE = 4
const upcomingAppointmentsPage = ref(1)
const allUpcomingAppointments = ref([
  { id: 1, time: '09:00 AM', patient: 'Ana García' },
  { id: 2, time: '10:30 AM', patient: 'Luis Martínez' },
  { id: 3, time: '11:15 AM', patient: 'Carla Torres' },
  { id: 4, time: '12:00 PM', patient: 'Pedro Jiménez' },
  { id: 5, time: '02:00 PM', patient: 'Sofía Castro' },
  { id: 6, time: '03:15 PM', patient: 'Mario Vargas' },
  { id: 7, time: '04:00 PM', patient: 'Elena Mendoza' },
])
const totalCitasPages = computed(() =>
  Math.ceil(allUpcomingAppointments.value.length / CITAS_PER_PAGE),
)
const paginatedUpcomingAppointments = computed(() => {
  const start = (upcomingAppointmentsPage.value - 1) * CITAS_PER_PAGE
  const end = start + CITAS_PER_PAGE
  return allUpcomingAppointments.value.slice(start, end)
})
const nextCitasPage = () => {
  if (upcomingAppointmentsPage.value < totalCitasPages.value) upcomingAppointmentsPage.value++
}
const prevCitasPage = () => {
  if (upcomingAppointmentsPage.value > 1) upcomingAppointmentsPage.value--
}

const passwordStrength = computed(() => {
  const pass = medicoEditable.password || ''
  let score = 0
  if (pass.length >= 6) score++
  if (pass.length >= 8) score++
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
  if (/\d/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++

  if (score < 2) return { text: 'Muy Débil', className: 'strength-weak' }
  if (score === 2) return { text: 'Débil', className: 'strength-weak' }
  if (score === 3) return { text: 'Aceptable', className: 'strength-medium' }
  if (score === 4) return { text: 'Fuerte', className: 'strength-strong' }
  return { text: 'Muy Fuerte', className: 'strength-strong' }
})

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

const consultasFiltradas = computed(() => {
  return consultas.value.filter((consulta) => {
    const matchCedula =
      !busquedaConsultaCedula.value ||
      consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
    const matchFecha =
      !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)
    return matchCedula && matchFecha
  })
})
const totalPagesConsultas = computed(() =>
  Math.ceil(consultasFiltradas.value.length / ITEMS_PER_PAGE),
)
const paginatedConsultas = computed(() => {
  const start = (currentPageConsultas.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return consultasFiltradas.value.slice(start, end)
})

const pacientesFiltrados = computed(() => {
  return pacientes.value.filter(
    (paciente) =>
      !busquedaPacienteCedula.value || paciente.cedula.includes(busquedaPacienteCedula.value),
  )
})
const totalPagesPacientes = computed(() =>
  Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE),
)
const paginatedPacientes = computed(() => {
  const start = (currentPagePacientes.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return pacientesFiltrados.value.slice(start, end)
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
  Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE),
)
const paginatedMedicamentos = computed(() => {
  const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return medicamentosFiltrados.value.slice(start, end)
})

const filteredPacientes = computed(() => {
  if (!pacienteSearchText.value) return pacientes.value.slice(0, 5)
  const search = pacienteSearchText.value.toLowerCase()
  return pacientes.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search) ||
      p.apellido.toLowerCase().includes(search) ||
      p.cedula.includes(search),
  )
})
const filteredMedicamentos = computed(() => {
  if (!medicamentoSearchText.value) return medicamentos.value
  const search = medicamentoSearchText.value.toLowerCase()
  return medicamentos.value.filter((m) => m.nombreGenerico.toLowerCase().includes(search))
})

const nextPage = (tab: 'consultas' | 'pacientes' | 'medicamentos') => {
  if (tab === 'consultas' && currentPageConsultas.value < totalPagesConsultas.value)
    currentPageConsultas.value++
  if (tab === 'pacientes' && currentPagePacientes.value < totalPagesPacientes.value)
    currentPagePacientes.value++
  if (tab === 'medicamentos' && currentPageMedicamentos.value < totalPagesMedicamentos.value)
    currentPageMedicamentos.value++
}
const prevPage = (tab: 'consultas' | 'pacientes' | 'medicamentos') => {
  if (tab === 'consultas' && currentPageConsultas.value > 1) currentPageConsultas.value--
  if (tab === 'pacientes' && currentPagePacientes.value > 1) currentPagePacientes.value--
  if (tab === 'medicamentos' && currentPageMedicamentos.value > 1) currentPageMedicamentos.value--
}

const cargarDatosIniciales = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      logout()
      return
    }
    const decodedToken = jwtDecode<DecodedToken>(token)
    medico.value.empleadoId = Number(decodedToken.sub)
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const medicoDataFromApi = {
      cedula: '1712345678',
    }

    const [resMedicos, resConsultas, resPacientes, resMedicamentos] = await Promise.all([
      apiClient.get('/Medicos', config),
      apiClient.get('/ConsultasMedicas', config),
      apiClient.get('/Pacientes', config),
      apiClient.get('/Medicamentos', config),
    ])

    const info = resMedicos.data.find((m: MedicoInfo) => m.empleadoId === medico.value.empleadoId)
    if (info) {
      medicoInfo.value = { ...info, ...medicoDataFromApi }
      medico.value.nombreCompleto = info.nombreCompleto
      const [nombre, ...apellidoArray] = info.nombreCompleto.split(' ')
      medicoEditable.nombre = nombre
      medicoEditable.apellido = apellidoArray.join(' ')
      nuevaConsulta.medicoId = info.id
    }
    const pacientesMap = new Map(resPacientes.data.map((p: Paciente) => [p.id, p.cedula]))
    consultas.value = resConsultas.data.map((c: Consulta) => ({
      ...c,
      cedulaPaciente: pacientesMap.get(c.pacienteId) || '',
    }))
    pacientes.value = resPacientes.data
    medicamentos.value = resMedicamentos.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    if (isAxiosError(error) && error.response?.status === 401) logout()
  }
}

const guardarDiagnosticoYPrescripcion = async () => {
  const token = localStorage.getItem('authToken')
  if (
    !token ||
    !nuevoDiagnostico.enfermedadNombre ||
    !nuevaPrescripcion.medicamentoId ||
    !nuevaPrescripcion.indicaciones
  ) {
    alert('Los campos de Enfermedad, Medicamento e Indicaciones son obligatorios.')
    return
  }
  try {
    const responseDiag = await apiClient.post('/Diagnosticos', nuevoDiagnostico, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const diagnosticoId = responseDiag.data.id
    const prescripcionPayload = { ...nuevaPrescripcion, diagnosticoId }
    await apiClient.post('/Prescripciones', prescripcionPayload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Consulta guardada con éxito.')
    consultaSeleccionada.value = null
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al guardar consulta:', error)
    alert('No se pudo guardar la información.')
  }
}

const actualizarPerfil = async () => {
  if (medicoEditable.password && medicoEditable.password.length < 6) {
    alert('La nueva contraseña debe tener al menos 6 caracteres.')
    return
  }
  const token = localStorage.getItem('authToken')
  if (!medico.value.empleadoId || !token) return
  try {
    const { data: empleadoActual } = await apiClient.get(`/Empleados/${medico.value.empleadoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payload = {
      ...empleadoActual,
      nombre: medicoEditable.nombre,
      apellido: medicoEditable.apellido,
      password: medicoEditable.password || empleadoActual.password,
    }
    await apiClient.put(`/Empleados/${medico.value.empleadoId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Perfil actualizado con éxito')
    medicoEditable.password = ''
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al actualizar el perfil:', error)
    alert('No se pudo actualizar el perfil.')
  }
}

const abrirModalNuevoPaciente = () => {
  Object.assign(nuevoPaciente, {
    cedula: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    direccion: '',
  })
  showModalNuevoPaciente.value = true
}

const crearPaciente = async () => {
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.post('/Pacientes', nuevoPaciente, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Paciente creado con éxito')
    showModalNuevoPaciente.value = false
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al crear paciente:', error)
    alert('No se pudo crear el paciente.')
  }
}

const seleccionarPaciente = async (paciente: Paciente) => {
  pacienteSeleccionado.value = { ...paciente }
  pacienteEditable.value = {
    ...paciente,
    fechaNacimiento: paciente.fechaNacimiento
      ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
      : '',
  }
  await cargarHistorialPaciente(paciente.id)
}

const cargarHistorialPaciente = async (pacienteId: number) => {
  historialPaciente.value = { consultas: [], diagnosticos: [] }
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const [resConsultas, resDiagnosticos] = await Promise.all([
      apiClient.get('/ConsultasMedicas', config),
      apiClient.get('/Diagnosticos', config),
    ])
    historialPaciente.value.consultas = resConsultas.data.filter(
      (c: Consulta) => c.pacienteId === pacienteId,
    )
    const idsConsultas = historialPaciente.value.consultas.map((c) => c.id)
    historialPaciente.value.diagnosticos = resDiagnosticos.data.filter((d: Diagnostico) =>
      idsConsultas.includes(d.consultaId),
    )
  } catch (error) {
    console.error('Error al cargar el historial del paciente', error)
  }
}

const getDiagnosticoForConsulta = (consultaId: number) => {
  return historialPaciente.value.diagnosticos.find((d) => d.consultaId === consultaId)
}

const actualizarPaciente = async () => {
  if (!pacienteEditable.value?.id) return
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.put(`/Pacientes/${pacienteEditable.value.id}`, pacienteEditable.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Paciente actualizado con éxito')
    pacienteSeleccionado.value = null
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al actualizar paciente:', error)
    alert('No se pudo actualizar el paciente.')
  }
}

const eliminarPaciente = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar a este paciente?')) return
  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Pacientes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Paciente eliminado.')
    pacienteSeleccionado.value = null
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al eliminar paciente:', error)
    alert('No se pudo eliminar al paciente.')
  }
}

const abrirModalMedicamento = (medicamento: Medicamento | null) => {
  if (medicamento) {
    modoEdicionMedicamento.value = true
    medicamentoEditable.value = { ...medicamento }
  } else {
    modoEdicionMedicamento.value = false
    medicamentoEditable.value = { nombreGenerico: '', nombreComercial: '', laboratorio: '' }
  }
  showModalMedicamento.value = true
}

const cerrarModalMedicamento = () => {
  showModalMedicamento.value = false
  medicamentoEditable.value = {}
}

const guardarMedicamento = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    if (modoEdicionMedicamento.value) {
      await apiClient.put(
        `/Medicamentos/${medicamentoEditable.value.id}`,
        medicamentoEditable.value,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      alert('Medicamento actualizado.')
    } else {
      await apiClient.post('/Medicamentos', medicamentoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Medicamento creado.')
    }
    cerrarModalMedicamento()
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al guardar medicamento:', error)
    alert('No se pudo guardar el medicamento.')
  }
}

const eliminarMedicamento = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este medicamento?')) return
  const token = localStorage.getItem('authToken')
  if (!token) return
  try {
    await apiClient.delete(`/Medicamentos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Medicamento eliminado.')
    cerrarModalMedicamento()
    cargarDatosIniciales()
  } catch (error) {
    console.error('Error al eliminar medicamento:', error)
    alert('No se pudo eliminar el medicamento.')
  }
}

const seleccionarConsulta = (c: Consulta) => {
  consultaSeleccionada.value = c
  Object.assign(nuevoDiagnostico, { consultaId: c.id, enfermedadNombre: '', observaciones: '' })
  Object.assign(nuevaPrescripcion, { diagnosticoId: 0, medicamentoId: null, indicaciones: '' })
  medicamentoSearchText.value = ''
}

const abrirModalNuevaConsulta = () => {
  Object.assign(nuevaConsulta, {
    pacienteId: null,
    motivo: '',
    fechaHora: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16),
  })
  pacienteSearchText.value = ''
  showModalNuevaConsulta.value = true
}

const selectPaciente = (paciente: Paciente) => {
  nuevaConsulta.pacienteId = paciente.id
  pacienteSearchText.value = `${paciente.nombre} ${paciente.apellido} (${paciente.cedula})`
  showPacienteOptions.value = false
}

const selectMedicamento = (medicamento: Medicamento) => {
  nuevaPrescripcion.medicamentoId = medicamento.id
  medicamentoSearchText.value = medicamento.nombreGenerico
  showMedicamentoOptions.value = false
}

const crearConsulta = async () => {
  const token = localStorage.getItem('authToken')
  if (!nuevaConsulta.pacienteId) {
    alert('Debe seleccionar un paciente.')
    return
  }
  try {
    await apiClient.post('/ConsultasMedicas', nuevaConsulta, {
      headers: { Authorization: `Bearer ${token}` },
    })
    showModalNuevaConsulta.value = false
    cargarDatosIniciales()
    alert('Consulta creada con éxito')
  } catch (error) {
    console.error('Error al crear la consulta:', error)
    alert('No se pudo crear la consulta.')
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  aplicarTema()
  cargarDatosIniciales()
})
</script>

<style scoped>
.page-container {
  --bg-color: #f8f9fa;
  --surface-color: #ffffff;
  --border-color: #dee2e6;
  --text-color: #212529;
  --headline-color: #0f172a;
  --text-muted-color: #6c757d;
  --primary-color: #0891b2;
  --secondary-color: #e2e8f0;
  --danger-color: #ef4444;
  --danger-color-hover: #dc2626;
}
.page-container.dark-mode {
  --bg-color: #0f172a;
  --surface-color: #1e293b;
  --border-color: #334155;
  --text-color: #e2e8f0;
  --headline-color: #f1f5f9;
  --text-muted-color: #94a3b8;
  --primary-color: #22d3ee;
  --secondary-color: #334155;
  --danger-color: #f87171;
  --danger-color-hover: #ef4444;
}
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
  flex-shrink: 0;
}
.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--headline-color);
}
.welcome-message {
  font-size: 1rem;
  color: var(--text-muted-color);
}
.content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted-color);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-toggle:hover {
  color: var(--headline-color);
  background-color: var(--secondary-color);
}
.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: 2rem 1rem;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.nav button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-muted-color);
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition:
    background-color 0.2s,
    color 0.2s;
}
.nav button:hover {
  background-color: var(--surface-color);
  color: var(--headline-color);
}
.dark-mode .nav button:hover {
  background-color: #334155;
}
.nav button.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
}
.dark-mode .nav button.active {
  color: var(--bg-color);
}
.btn-logout-sidebar {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-muted-color);
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
.btn-logout-sidebar:hover {
  background-color: var(--secondary-color);
  color: var(--danger-color);
}
.main-panel {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.tab-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
  margin: 0;
}
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
  overflow-y: auto;
}
.item-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.item-list li:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.item-main-info {
  display: flex;
  flex-direction: column;
}
.item-title {
  font-weight: 500;
  color: var(--text-color);
}
.item-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted-color);
}
.chip {
  background-color: var(--bg-color);
  color: var(--text-muted-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filters {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}
.filters input {
  flex-grow: 1;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
}
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.dark-mode .btn-primary {
  color: var(--bg-color);
}
.btn-primary:hover {
  opacity: 0.9;
}
.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-muted-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: var(--border-color);
}
.btn-danger {
  background-color: var(--danger-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-danger:hover {
  background-color: var(--danger-color-hover);
}
.card {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.form-row {
  display: flex;
  gap: 1.5rem;
}
.form-row .form-group {
  flex: 1;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group:last-child {
  margin-bottom: 0;
}
.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted-color);
}
.form-group input,
.form-group textarea {
  width: 100%;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: var(--surface-color);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-content.modal-lg {
  max-width: 700px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  background-color: var(--bg-color);
}
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--headline-color);
}
.btn-close-modal {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-muted-color);
  border-radius: 50%;
}
.btn-close-modal:hover {
  color: var(--headline-color);
  background-color: var(--secondary-color);
}
.modal-body {
  padding: 1.5rem;
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
  gap: 1rem;
  margin-top: 1.5rem;
}
.modal-subtitle {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-muted-color);
}
hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.5rem 0;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-column {
  display: flex;
  flex-direction: column;
}
.modal-actions.full-width {
  grid-column: 1 / -1;
}
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-with-icon svg {
  position: absolute;
  left: 12px;
  color: var(--text-muted-color);
  pointer-events: none;
}
.input-with-icon input {
  padding-left: 40px;
  width: 100%;
}
.input-with-icon input[type='datetime-local'] {
  padding-left: 40px;
}
.historial-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}
.diagnostico-chip {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
.dark-mode .diagnostico-chip {
  color: var(--bg-color);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.75rem;
  flex-shrink: 0;
  padding: 0.5rem;
}
.pagination button {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.combobox {
  position: relative;
}
.combobox-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  list-style: none;
  padding: 0.5rem;
  margin: 0.25rem 0 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
}
.combobox-options li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 6px;
}
.combobox-options li:hover {
  background-color: var(--bg-color);
}
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: stretch;
}
.profile-left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.dark-mode .profile-avatar {
  color: var(--bg-color);
}
.profile-card h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--headline-color);
}
.profile-card p {
  color: var(--text-muted-color);
  margin-top: 0.25rem;
  margin-bottom: 1rem;
}
.p.readonly-field {
  background-color: var(--bg-color);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;
  text-align: left;
}
.btn-primary.full-width {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
}
.edit-profile-card {
  display: flex;
  flex-direction: column;
}
.edit-profile-card .profile-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.edit-profile-card .profile-form .btn-primary {
  margin-top: auto;
}
.edit-profile-card .form-group {
  margin-bottom: 1.25rem;
}
.password-strength-meter {
  width: 100%;
  height: 6px;
  background-color: var(--secondary-color);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}
.strength-bar {
  height: 100%;
  width: 0;
  border-radius: 3px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}
.strength-text {
  margin-top: 4px;
  font-size: 0.8rem;
  text-align: right;
  transition: color 0.3s ease;
}
.strength-weak {
  color: #ef4444;
}
.strength-weak.strength-bar {
  width: 25%;
  background-color: #ef4444;
}
.strength-medium {
  color: #f97316;
}
.strength-medium.strength-bar {
  width: 50%;
  background-color: #f97316;
}
.strength-strong {
  color: #22c55e;
}
.strength-strong.strength-bar {
  width: 100%;
  background-color: #22c55e;
}
.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.upcoming-header h4 {
  margin: 0;
}
.pagination-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.pagination-compact button {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
.pagination-compact button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination-compact span {
  font-size: 0.85rem;
  color: var(--text-muted-color);
}
.upcoming-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.upcoming-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}
.upcoming-list li:last-child {
  border: none;
}
.upcoming-time {
  font-weight: 600;
  color: var(--primary-color);
  flex-shrink: 0;
}
.upcoming-patient {
  color: var(--text-color);
}
.edit-profile-card form {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
