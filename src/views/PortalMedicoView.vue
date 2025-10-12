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
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
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
            <div class="filter-toggle">
              <input type="checkbox" id="mostrar-pendientes" v-model="mostrarSoloPendientes" />
              <label for="mostrar-pendientes">Mostrar solo pendientes</label>
            </div>
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
            <li v-if="paginatedConsultas.length === 0">No se encontraron consultas.</li>
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
                  <h4>Consultas Pendientes de Diagnóstico</h4>
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
                    <span class="upcoming-time">{{
                      new Date(cita.fechaHora).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }}</span>
                    <span class="upcoming-patient">{{ cita.nombrePaciente }}</span>
                  </li>
                  <li v-if="!paginatedUpcomingAppointments.length">No hay consultas pendientes.</li>
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
                <label for="paciente-search">Buscar Paciente por Cédula</label>
                <div class="search-group">
                  <input
                    type="text"
                    v-model="busquedaCedulaPacienteModal"
                    placeholder="Ingrese la cédula del paciente..."
                    :disabled="!!nuevaConsulta.pacienteId"
                  />
                  <button
                    type="button"
                    class="btn-secondary"
                    @click="buscarPacientePorCedula"
                    :disabled="!!nuevaConsulta.pacienteId"
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <div v-if="pacienteNoEncontrado" class="search-result-message error">
                Paciente no encontrado en la base de datos.
              </div>

              <div v-if="pacienteEncontrado" class="search-result">
                <span>{{ pacienteEncontrado.nombre }} {{ pacienteEncontrado.apellido }}</span>
                <button
                  type="button"
                  class="btn-primary"
                  @click="seleccionarPacienteParaConsulta(pacienteEncontrado)"
                >
                  Seleccionar
                </button>
              </div>

              <div v-if="nuevaConsulta.pacienteId" class="selected-patient-info">
                <strong>Paciente:</strong> {{ pacienteSearchText }}
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
                    :disabled="!nuevaConsulta.pacienteId"
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
                    :disabled="!nuevaConsulta.pacienteId"
                  />
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" @click="showModalNuevaConsulta = false" class="btn-secondary">
                  Cancelar</button
                ><button type="submit" class="btn-primary" :disabled="!nuevaConsulta.pacienteId">
                  Crear
                </button>
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
              <div class="upcoming-header">
                <h4>Consultas Anteriores</h4>
                <div class="pagination-compact" v-if="totalPagesHistorial > 0">
                  <button @click="prevPageHistorial" :disabled="currentPageHistorial === 1">
                    Anterior
                  </button>
                  <span>{{ currentPageHistorial }} de {{ totalPagesHistorial }}</span>
                  <button
                    @click="nextPageHistorial"
                    :disabled="currentPageHistorial === totalPagesHistorial"
                  >
                    Siguiente
                  </button>
                </div>
              </div>

              <div class="filters">
                <input type="date" v-model="historialBusquedaFecha" />
                <input
                  type="text"
                  v-model="historialBusquedaEnfermedad"
                  placeholder="Buscar por enfermedad o motivo..."
                />
              </div>

              <ul class="item-list historial-list">
                <li v-for="item in paginatedHistorial" :key="item.id">
                  <div class="item-main-info">
                    <span class="item-title">{{ new Date(item.fechaHora).toLocaleString() }}</span
                    ><span class="item-subtitle">Motivo: {{ item.motivo }}</span>
                  </div>
                  <div class="chip diagnostico-chip">
                    {{ item.enfermedadNombre }}
                  </div>
                </li>
                <li v-if="paginatedHistorial.length === 0">
                  No se encontraron consultas con los filtros actuales.
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
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'

const router = useRouter()
const activeTab = ref('consultas')
const isDarkMode = ref(false)
const ITEMS_PER_PAGE = 5
const HISTORIAL_ITEMS_PER_PAGE = 1
const CITAS_PER_PAGE = 4

// --- INTERFACES ---
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
interface HistorialItem {
  id: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
  fechaHora: string
  motivo: string
}

// --- REFS Y REACTIVES ---
const medico = ref<Medico>({ empleadoId: 0, nombreCompleto: 'Cargando...' })
const medicoInfo = ref<Partial<MedicoInfo>>({})
const medicoEditable = reactive<MedicoEditable>({ nombre: '', apellido: '', password: '' })
const consultas = ref<Consulta[]>([])
const pacientes = ref<Paciente[]>([])
const medicamentos = ref<Medicamento[]>([])
const diagnosticos = ref<Diagnostico[]>([])
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
const medicamentoSearchText = ref('')
const showMedicamentoOptions = ref(false)
const historialBusquedaFecha = ref('')
const historialBusquedaEnfermedad = ref('')
const currentPageHistorial = ref(1)
const upcomingAppointmentsPage = ref(1)
const busquedaCedulaPacienteModal = ref('')
const pacienteEncontrado = ref<Paciente | null>(null)
const pacienteNoEncontrado = ref(false)
const mostrarSoloPendientes = ref(false)

// --- COMPUTED PROPERTIES ---

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

const consultasFiltradas = computed(() => {
  const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))

  return consultas.value.filter((consulta) => {
    const matchCedula =
      !busquedaConsultaCedula.value ||
      consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
    const matchFecha =
      !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)

    if (mostrarSoloPendientes.value) {
      return matchCedula && matchFecha && !diagnosticosConsultaIds.has(consulta.id)
    }

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

const filteredMedicamentos = computed(() => {
  if (!medicamentoSearchText.value) return medicamentos.value
  const search = medicamentoSearchText.value.toLowerCase()
  return medicamentos.value.filter((m) => m.nombreGenerico.toLowerCase().includes(search))
})

const consultasPendientes = computed(() => {
  const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
  return consultas.value
    .filter((c) => !diagnosticosConsultaIds.has(c.id) && c.medicoId === medicoInfo.value.id)
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
})

const totalCitasPages = computed(() => Math.ceil(consultasPendientes.value.length / CITAS_PER_PAGE))

const paginatedUpcomingAppointments = computed(() => {
  const start = (upcomingAppointmentsPage.value - 1) * CITAS_PER_PAGE
  const end = start + CITAS_PER_PAGE
  return consultasPendientes.value.slice(start, end)
})

const historialCombinado = computed((): HistorialItem[] => {
  if (!pacienteSeleccionado.value) return []
  const consultasMap = new Map(historialPaciente.value.consultas.map((c) => [c.id, c]))
  return historialPaciente.value.diagnosticos
    .map((diagnostico) => {
      const consulta = consultasMap.get(diagnostico.consultaId)
      return {
        ...diagnostico,
        fechaHora: consulta?.fechaHora || '',
        motivo: consulta?.motivo || 'N/A',
      }
    })
    .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
})

const historialFiltrado = computed(() => {
  return historialCombinado.value.filter((item) => {
    const matchFecha =
      !historialBusquedaFecha.value || item.fechaHora.startsWith(historialBusquedaFecha.value)
    const busqueda = historialBusquedaEnfermedad.value.toLowerCase()
    const matchTexto =
      !busqueda ||
      item.enfermedadNombre.toLowerCase().includes(busqueda) ||
      (item.motivo && item.motivo.toLowerCase().includes(busqueda))
    return matchFecha && matchTexto
  })
})

const totalPagesHistorial = computed(() =>
  Math.ceil(historialFiltrado.value.length / HISTORIAL_ITEMS_PER_PAGE),
)

const paginatedHistorial = computed(() => {
  const start = (currentPageHistorial.value - 1) * HISTORIAL_ITEMS_PER_PAGE
  const end = start + HISTORIAL_ITEMS_PER_PAGE
  return historialFiltrado.value.slice(start, end)
})

// --- WATCHERS ---
watch([historialBusquedaFecha, historialBusquedaEnfermedad], () => {
  currentPageHistorial.value = 1
})
watch(busquedaConsultaCedula, () => {
  currentPageConsultas.value = 1
})
watch(busquedaConsultaFecha, () => {
  currentPageConsultas.value = 1
})
watch(mostrarSoloPendientes, () => {
  currentPageConsultas.value = 1
})

// --- MÉTODOS ---

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
const nextPageHistorial = () => {
  if (currentPageHistorial.value < totalPagesHistorial.value) {
    currentPageHistorial.value++
  }
}
const prevPageHistorial = () => {
  if (currentPageHistorial.value > 1) {
    currentPageHistorial.value--
  }
}
const nextCitasPage = () => {
  if (upcomingAppointmentsPage.value < totalCitasPages.value) upcomingAppointmentsPage.value++
}
const prevCitasPage = () => {
  if (upcomingAppointmentsPage.value > 1) upcomingAppointmentsPage.value--
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

    const [resMedicos, resConsultas, resPacientes, resMedicamentos, resDiagnosticos] =
      await Promise.all([
        apiClient.get('/Medicos', config),
        apiClient.get('/ConsultasMedicas', config),
        apiClient.get('/Pacientes', config),
        apiClient.get('/Medicamentos', config),
        apiClient.get('/Diagnosticos', config),
      ])

    const info = resMedicos.data.find((m: MedicoInfo) => m.empleadoId === medico.value.empleadoId)
    if (info) {
      medicoInfo.value = info
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
    diagnosticos.value = resDiagnosticos.data
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
  historialBusquedaFecha.value = ''
  historialBusquedaEnfermedad.value = ''
  currentPageHistorial.value = 1
  await cargarHistorialPaciente(paciente.id)
}

const cargarHistorialPaciente = async (pacienteId: number) => {
  historialPaciente.value = { consultas: [], diagnosticos: [] }
  const idsConsultasDelPaciente = consultas.value
    .filter((c) => c.pacienteId === pacienteId)
    .map((c) => c.id)

  historialPaciente.value.consultas = consultas.value.filter((c) => c.pacienteId === pacienteId)
  historialPaciente.value.diagnosticos = diagnosticos.value.filter((d) =>
    idsConsultasDelPaciente.includes(d.consultaId),
  )
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
  busquedaCedulaPacienteModal.value = ''
  pacienteEncontrado.value = null
  pacienteNoEncontrado.value = false
  showModalNuevaConsulta.value = true
}

const buscarPacientePorCedula = () => {
  pacienteNoEncontrado.value = false
  pacienteEncontrado.value = null
  if (!busquedaCedulaPacienteModal.value.trim()) return

  const encontrado = pacientes.value.find(
    (p) => p.cedula === busquedaCedulaPacienteModal.value.trim(),
  )

  if (encontrado) {
    pacienteEncontrado.value = encontrado
  } else {
    pacienteNoEncontrado.value = true
  }
}

const seleccionarPacienteParaConsulta = (paciente: Paciente) => {
  nuevaConsulta.pacienteId = paciente.id
  pacienteSearchText.value = `${paciente.nombre} ${paciente.apellido} (C.I: ${paciente.cedula})`
  pacienteEncontrado.value = null
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

/* ===== LAYOUT PRINCIPAL ===== */
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

/* ===== HEADER ===== */
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

/* ===== CONTENT LAYOUT ===== */
.content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
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

/* ===== MAIN PANEL ===== */
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
  margin-bottom: 2rem;
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

/* ===== ITEMS Y LISTAS ===== */
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

.item-list li:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.item-list li:active {
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

/* ===== FILTROS ===== */
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

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  background-color: var(--surface-color);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.filter-toggle input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.filter-toggle label {
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 400;
}

/* ===== PAGINACIÓN ===== */
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
  background-color: var(--secondary-color);
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

/* ===== BOTONES ===== */
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

/* ===== CARDS ===== */
.card {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

/* ===== FORMULARIOS ===== */
.form-row {
  display: flex;
  gap: 1rem;
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

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.dark-mode .form-group input:focus,
.dark-mode .form-group textarea:focus {
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.2);
}

/* ===== MODALES ===== */
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
  max-width: 500px;
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

.modal-subtitle {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-muted-color);
  font-size: 0.9375rem;
}

hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
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
  left: 14px;
  color: var(--text-muted-color);
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 44px;
  width: 100%;
}

.input-with-icon input[type='datetime-local'] {
  padding-left: 44px;
}

/* ===== HISTORIAL ===== */
.historial-section .upcoming-header {
  margin-bottom: 1.5rem;
}

.historial-list {
  max-height: 140px;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 1.5rem;
}

.diagnostico-chip {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* ===== COMBOBOX ===== */
.combobox {
  position: relative;
}

.combobox-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  list-style: none;
  padding: 0.5rem;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: var(--shadow-lg);
}

.combobox-options li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  font-size: 0.9375rem;
}

.combobox-options li:hover {
  background-color: var(--secondary-color);
}

/* ===== BÚSQUEDA DE PACIENTE ===== */
.search-group {
  display: flex;
  gap: 0.75rem;
}

.search-group input {
  flex-grow: 1;
}

.search-group .btn-secondary {
  padding: 0.875rem 1.25rem;
}

.search-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-top: 1rem;
  border: 1px solid var(--success-color);
  box-shadow: var(--shadow-sm);
}

.search-result .btn-primary {
  padding: 0.625rem 1.25rem;
}

.search-result-message.error {
  color: var(--danger-color);
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.selected-patient-info {
  background-color: rgba(8, 145, 178, 0.08);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.25rem;
  border-left: 3px solid var(--primary-color);
  font-size: 0.9375rem;
}

.dark-mode .selected-patient-info {
  background-color: rgba(34, 211, 238, 0.15);
}

/* ===== PERFIL ===== */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  align-items: start;
}

.profile-left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5rem 2rem;
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
  box-shadow: 0 4px 20px rgba(34, 211, 238, 0.3);
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

.readonly-field {
  background-color: var(--secondary-color);
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.9375rem;
  width: 100%;
  text-align: left;
}

.btn-primary.full-width {
  width: 100%;
  padding: 1rem;
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
  margin-top: 1rem;
}

.edit-profile-card .form-group {
  margin-bottom: 1.25rem;
}

/* ===== PASSWORD STRENGTH ===== */
.password-strength-meter {
  width: 100%;
  height: 4px;
  background-color: var(--secondary-color);
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0;
  border-radius: 2px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.strength-text {
  margin-top: 6px;
  font-size: 0.75rem;
  text-align: right;
  transition: color 0.3s ease;
  font-weight: 500;
}

.strength-weak {
  color: #ff3b30;
}

.strength-weak.strength-bar {
  width: 25%;
  background-color: #ff3b30;
}

.strength-medium {
  color: #ff9500;
}

.strength-medium.strength-bar {
  width: 50%;
  background-color: #ff9500;
}

.strength-strong {
  color: #34c759;
}

.strength-strong.strength-bar {
  width: 100%;
  background-color: #34c759;
}

/* ===== UPCOMING APPOINTMENTS ===== */
.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.upcoming-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.01em;
}

.pagination-compact {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pagination-compact button {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.pagination-compact button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.pagination-compact button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-compact span {
  font-size: 0.8125rem;
  color: var(--text-muted-color);
  font-weight: 500;
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
  border-bottom: 1px solid var(--border-light);
}

.upcoming-list li:last-child {
  border: none;
  padding-bottom: 0;
}

.upcoming-time {
  font-weight: 600;
  color: var(--primary-color);
  flex-shrink: 0;
  font-size: 0.875rem;
  letter-spacing: -0.01em;
}

.upcoming-patient {
  color: var(--text-color);
  font-size: 0.9375rem;
}

.edit-profile-card form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ===== SCROLLBAR PERSONALIZADO ===== */
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

/* ===== ANIMACIONES SUTILES ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-list li {
  animation: fadeIn 0.3s ease-out;
}

/* ===== ESTADOS DE CARGA ===== */
.item-list li:empty::after {
  content: 'Cargando...';
  color: var(--text-muted-color);
  font-style: italic;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 1rem 1.5rem;
  }

  .title {
    font-size: 1.25rem;
  }

  .main-panel {
    padding: 1.5rem;
  }

  .tab-content h2 {
    font-size: 1.5rem;
  }

  .modal-content {
    width: 95%;
    max-width: none;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .sidebar {
    width: 200px;
    padding: 1.5rem 1rem;
  }
}

/* ===== MEJORAS DE ACCESIBILIDAD ===== */
.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.btn-danger:focus-visible,
.nav button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.form-group input:focus-visible,
.form-group textarea:focus-visible {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.dark-mode .form-group input:focus-visible,
.dark-mode .form-group textarea:focus-visible {
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.2);
}

/* ===== ESTADOS ADICIONALES ===== */
.btn-primary:active:not(:disabled),
.btn-secondary:active:not(:disabled),
.btn-danger:active:not(:disabled) {
  transform: scale(0.98);
}

.upcoming-card {
  transition: all var(--transition-normal);
}

.upcoming-card:hover {
  box-shadow: var(--shadow-md);
}

/* ===== GLASS MORPHISM PARA MODALES (OPCIONAL) ===== */
.dark-mode .modal-content {
  background-color: rgba(28, 28, 30, 0.95);
  backdrop-filter: blur(40px);
}

/* ===== EFECTOS DE PROFUNDIDAD ===== */
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.profile-avatar {
  transition: all var(--transition-normal);
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(8, 145, 178, 0.4);
}

.dark-mode .profile-avatar:hover {
  box-shadow: 0 6px 30px rgba(34, 211, 238, 0.4);
}

/* ===== MEJORAS EN INPUTS ===== */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted-color);
  opacity: 0.6;
}

.form-group input:hover:not(:focus),
.form-group textarea:hover:not(:focus) {
  border-color: var(--text-muted-color);
}

/* ===== CHIP VARIATIONS ===== */
.chip.success {
  background-color: rgba(52, 199, 89, 0.15);
  color: var(--success-color);
  font-weight: 600;
}

.chip.warning {
  background-color: rgba(255, 149, 0, 0.15);
  color: #ff9500;
  font-weight: 600;
}

/* ===== EMPTY STATES ===== */
.item-list li:only-child {
  text-align: center;
  color: var(--text-muted-color);
  cursor: default;
  border-style: dashed;
}

.item-list li:only-child:hover {
  border-color: var(--border-color);
  transform: none;
  box-shadow: var(--shadow-sm);
}

/* ===== TRANSICIONES SUAVES GLOBALES ===== */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: var(--transition-fast);
  transition-timing-function: ease;
}

button,
a,
input,
textarea {
  transition-property: background-color, border-color, color, transform, box-shadow;
  transition-duration: var(--transition-fast);
}
</style>
