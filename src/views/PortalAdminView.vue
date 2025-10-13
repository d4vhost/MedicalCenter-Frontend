<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Portal del Administrador</h1>
        <p class="welcome-message">Gestión Integral del Sistema Médico</p>
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
          <button @click="activeTab = 'empleados'" :class="{ active: activeTab === 'empleados' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"
              />
            </svg>
            <span>Empleados</span>
          </button>
          <button @click="activeTab = 'medicos'" :class="{ active: activeTab === 'medicos' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M14.84 16.26C17.86 16.83 20 18.29 20 20v2h2v-2c0-2.21-3.52-3.63-7.16-3.74M11 16c2.67 0 8 1.34 8 4v2H3v-2c0-2.66 5.33-4 8-4m0-2c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
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
        <div v-if="activeTab === 'empleados'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Empleados</h2>
            <button @click="abrirModalEmpleado(null)" class="btn-primary">Nuevo Empleado</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaEmpleado"
              placeholder="Buscar por nombre o cédula..."
            />
          </div>
          <ul class="item-list">
            <li
              v-for="empleado in paginatedEmpleados"
              :key="empleado.id"
              @click="abrirModalEmpleado(empleado)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ empleado.nombre }} {{ empleado.apellido }}</span>
                <span class="item-subtitle"
                  >C.I: {{ empleado.cedula }} | Rol: {{ empleado.nombreRol }}</span
                >
              </div>
              <span class="chip">{{ empleado.nombreCentroMedico }}</span>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesEmpleados > 0">
            <button @click="prevPage('empleados')" :disabled="currentPageEmpleados === 1">
              Anterior
            </button>
            <span>Página {{ currentPageEmpleados }} de {{ totalPagesEmpleados }}</span>
            <button
              @click="nextPage('empleados')"
              :disabled="currentPageEmpleados === totalPagesEmpleados"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'medicos'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Médicos</h2>
            <button @click="abrirModalMedico(null)" class="btn-primary">Nuevo Médico</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaMedico"
              placeholder="Buscar por nombre o especialidad..."
            />
          </div>
          <ul class="item-list">
            <li
              v-for="medico in paginatedMedicos"
              :key="medico.id"
              @click="abrirModalMedico(medico)"
            >
              <div class="item-main-info">
                <span class="item-title">Dr. {{ medico.nombreCompleto }}</span>
                <span class="item-subtitle">{{ medico.nombreEspecialidad }}</span>
              </div>
              <span class="chip">{{ medico.nombreCentroMedico }}</span>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesMedicos > 0">
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

        <div v-if="activeTab === 'pacientes'" class="tab-content">
          <div class="tab-header">
            <h2>Gestión de Pacientes</h2>
            <button @click="abrirModalPaciente(null)" class="btn-primary">Nuevo Paciente</button>
          </div>
          <div class="filters">
            <input
              type="text"
              v-model="busquedaPaciente"
              placeholder="Buscar por nombre o cédula..."
            />
          </div>
          <ul class="item-list">
            <li
              v-for="paciente in paginatedPacientes"
              :key="paciente.id"
              @click="abrirModalPaciente(paciente)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ paciente.nombre }} {{ paciente.apellido }}</span>
                <span class="item-subtitle">C.I: {{ paciente.cedula }}</span>
              </div>
            </li>
          </ul>
          <div class="pagination" v-if="totalPagesPacientes > 0">
            <button @click="prevPage('pacientes')" :disabled="currentPagePacientes === 1">
              Anterior
            </button>
            <span>Página {{ currentPagePacientes }} de {{ totalPagesPacientes }}</span>
            <button
              @click="nextPage('pacientes')"
              :disabled="currentPagePacientes === totalPagesPacientes"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'centros'" class="tab-content">
          <div class="tab-header">
            <h2>Centros Médicos</h2>
            <button @click="abrirModalCentro(null)" class="btn-primary">Nuevo Centro</button>
          </div>
          <ul class="item-list">
            <li v-for="centro in centrosMedicos" :key="centro.id" @click="abrirModalCentro(centro)">
              <div class="item-main-info">
                <span class="item-title">{{ centro.nombre }}</span>
                <span class="item-subtitle">{{ centro.direccion }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'especialidades'" class="tab-content">
          <div class="tab-header">
            <h2>Especialidades Médicas</h2>
            <button @click="abrirModalEspecialidad(null)" class="btn-primary">
              Nueva Especialidad
            </button>
          </div>
          <ul class="item-list">
            <li
              v-for="especialidad in especialidades"
              :key="especialidad.id"
              @click="abrirModalEspecialidad(especialidad)"
            >
              <div class="item-main-info">
                <span class="item-title">{{ especialidad.nombre }}</span>
              </div>
            </li>
          </ul>
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
          </ul>
          <div class="pagination" v-if="totalPagesMedicamentos > 0">
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
      </div>
    </main>

    <Transition name="modal-fade">
      <div v-if="showModalEmpleado" class="modal-overlay" @click.self="cerrarModalEmpleado">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEdicion ? 'Editar Empleado' : 'Nuevo Empleado' }}</h3>
            <button @click="cerrarModalEmpleado" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEmpleado">
              <div class="form-row">
                <div class="form-group">
                  <label for="emp-cedula">Cédula *</label>
                  <input
                    type="text"
                    id="emp-cedula"
                    v-model="empleadoEditable.cedula"
                    required
                    maxlength="10"
                  />
                </div>
                <div class="form-group">
                  <label for="emp-nombre">Nombre *</label>
                  <input
                    type="text"
                    id="emp-nombre"
                    v-model="empleadoEditable.nombre"
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
                    v-model="empleadoEditable.apellido"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="emp-password">{{
                    modoEdicion ? 'Nueva Contraseña' : 'Contraseña *'
                  }}</label>
                  <input
                    type="password"
                    id="emp-password"
                    v-model="empleadoEditable.password"
                    :required="!modoEdicion"
                    minlength="6"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="emp-rol">Rol *</label>
                  <select id="emp-rol" v-model="empleadoEditable.rolId" required>
                    <option value="">Seleccione un rol</option>
                    <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                      {{ rol.nombre }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="emp-centro">Centro Médico *</label>
                  <select id="emp-centro" v-model="empleadoEditable.centroMedicoId" required>
                    <option value="">Seleccione un centro</option>
                    <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                      {{ centro.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicion && !esAdministradorPropio(empleadoEditable)"
                  type="button"
                  @click="eliminarEmpleado(empleadoEditable.id)"
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
      <div v-if="showModalMedico" class="modal-overlay" @click.self="cerrarModalMedico">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEdicionMedico ? 'Editar Médico' : 'Nuevo Médico' }}</h3>
            <button @click="cerrarModalMedico" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMedico">
              <div class="form-group">
                <label for="med-empleado">Empleado *</label>
                <select
                  id="med-empleado"
                  v-model="medicoEditable.empleadoId"
                  required
                  :disabled="modoEdicionMedico"
                >
                  <option value="">Seleccione un empleado</option>
                  <option v-for="emp in empleadosMedicos" :key="emp.id" :value="emp.id">
                    {{ emp.nombre }} {{ emp.apellido }} ({{ emp.cedula }})
                  </option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="med-especialidad">Especialidad *</label>
                  <select id="med-especialidad" v-model="medicoEditable.especialidadId" required>
                    <option value="">Seleccione una especialidad</option>
                    <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
                      {{ esp.nombre }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="med-centro">Centro Médico *</label>
                  <select id="med-centro" v-model="medicoEditable.centroMedicoId" required>
                    <option value="">Seleccione un centro</option>
                    <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                      {{ centro.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionMedico"
                  type="button"
                  @click="eliminarMedico(medicoEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalMedico" class="btn-secondary">
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
      <div v-if="showModalPaciente" class="modal-overlay" @click.self="cerrarModalPaciente">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modoEdicionPaciente ? 'Editar Paciente' : 'Nuevo Paciente' }}</h3>
            <button @click="cerrarModalPaciente" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarPaciente">
              <div class="form-row">
                <div class="form-group">
                  <label for="pac-cedula">Cédula *</label>
                  <input
                    type="text"
                    id="pac-cedula"
                    v-model="pacienteEditable.cedula"
                    required
                    maxlength="10"
                  />
                </div>
                <div class="form-group">
                  <label for="pac-nombre">Nombre *</label>
                  <input
                    type="text"
                    id="pac-nombre"
                    v-model="pacienteEditable.nombre"
                    required
                    maxlength="40"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="pac-apellido">Apellido *</label>
                  <input
                    type="text"
                    id="pac-apellido"
                    v-model="pacienteEditable.apellido"
                    required
                    maxlength="40"
                  />
                </div>
                <div class="form-group">
                  <label for="pac-fecha">Fecha de Nacimiento</label>
                  <input type="date" id="pac-fecha" v-model="pacienteEditable.fechaNacimiento" />
                </div>
              </div>
              <div class="form-group">
                <label for="pac-direccion">Dirección</label>
                <input
                  type="text"
                  id="pac-direccion"
                  v-model="pacienteEditable.direccion"
                  maxlength="60"
                />
              </div>
              <div class="modal-actions">
                <button
                  v-if="modoEdicionPaciente"
                  type="button"
                  @click="eliminarPaciente(pacienteEditable.id)"
                  class="btn-danger"
                >
                  Eliminar
                </button>
                <button type="button" @click="cerrarModalPaciente" class="btn-secondary">
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
            <button @click="cerrarModalCentro" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
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
                <label for="centro-direccion">Dirección *</label>
                <input
                  type="text"
                  id="centro-direccion"
                  v-model="centroEditable.direccion"
                  required
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
            <button @click="cerrarModalEspecialidad" class="btn-close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                />
              </svg>
            </button>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'

const router = useRouter()
const activeTab = ref('empleados')
const isDarkMode = ref(false)
const ITEMS_PER_PAGE = 8

// Interfaces
interface Empleado {
  id: number
  cedula: string
  nombre: string
  apellido: string
  password?: string
  rolId: number
  nombreRol: string
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

interface Rol {
  id: number
  nombre: string
}

interface DecodedToken {
  sub: string
  role: string
}

// Estado
const empleados = ref<Empleado[]>([])
const medicos = ref<Medico[]>([])
const pacientes = ref<Paciente[]>([])
const centrosMedicos = ref<CentroMedico[]>([])
const especialidades = ref<Especialidad[]>([])
const medicamentos = ref<Medicamento[]>([])
const roles = ref<Rol[]>([])

const adminEmpleadoId = ref<number>(0)

// Búsquedas y paginación
const busquedaEmpleado = ref('')
const currentPageEmpleados = ref(1)
const busquedaMedico = ref('')
const currentPageMedicos = ref(1)
const busquedaPaciente = ref('')
const currentPagePacientes = ref(1)
const busquedaMedicamento = ref('')
const currentPageMedicamentos = ref(1)

// Modales
const showModalEmpleado = ref(false)
const modoEdicion = ref(false)
const empleadoEditable = ref<Partial<Empleado>>({})

const showModalMedico = ref(false)
const modoEdicionMedico = ref(false)
const medicoEditable = ref<Partial<Medico>>({})

const showModalPaciente = ref(false)
const modoEdicionPaciente = ref(false)
const pacienteEditable = ref<Partial<Paciente>>({})

const showModalCentro = ref(false)
const modoEdicionCentro = ref(false)
const centroEditable = ref<Partial<CentroMedico>>({})

const showModalEspecialidad = ref(false)
const modoEdicionEspecialidad = ref(false)
const especialidadEditable = ref<Partial<Especialidad>>({})

const showModalMedicamento = ref(false)
const modoEdicionMedicamento = ref(false)
const medicamentoEditable = ref<Partial<Medicamento>>({})

// Computed
const empleadosFiltrados = computed(() => {
  const busqueda = busquedaEmpleado.value.toLowerCase()
  return empleados.value.filter(
    (emp) =>
      !busqueda ||
      emp.nombre.toLowerCase().includes(busqueda) ||
      emp.apellido.toLowerCase().includes(busqueda) ||
      emp.cedula.includes(busqueda),
  )
})

const totalPagesEmpleados = computed(() =>
  Math.ceil(empleadosFiltrados.value.length / ITEMS_PER_PAGE),
)
const paginatedEmpleados = computed(() => {
  const start = (currentPageEmpleados.value - 1) * ITEMS_PER_PAGE
  return empleadosFiltrados.value.slice(start, start + ITEMS_PER_PAGE)
})

const medicosFiltrados = computed(() => {
  const busqueda = busquedaMedico.value.toLowerCase()
  return medicos.value.filter(
    (med) =>
      !busqueda ||
      med.nombreCompleto.toLowerCase().includes(busqueda) ||
      med.nombreEspecialidad.toLowerCase().includes(busqueda),
  )
})

const totalPagesMedicos = computed(() => Math.ceil(medicosFiltrados.value.length / ITEMS_PER_PAGE))
const paginatedMedicos = computed(() => {
  const start = (currentPageMedicos.value - 1) * ITEMS_PER_PAGE
  return medicosFiltrados.value.slice(start, start + ITEMS_PER_PAGE)
})

const pacientesFiltrados = computed(() => {
  const busqueda = busquedaPaciente.value.toLowerCase()
  return pacientes.value.filter(
    (pac) =>
      !busqueda ||
      pac.nombre.toLowerCase().includes(busqueda) ||
      pac.apellido.toLowerCase().includes(busqueda) ||
      pac.cedula.includes(busqueda),
  )
})

const totalPagesPacientes = computed(() =>
  Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE),
)
const paginatedPacientes = computed(() => {
  const start = (currentPagePacientes.value - 1) * ITEMS_PER_PAGE
  return pacientesFiltrados.value.slice(start, start + ITEMS_PER_PAGE)
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
  return medicamentosFiltrados.value.slice(start, start + ITEMS_PER_PAGE)
})

const empleadosMedicos = computed(() => {
  const rolMedico = roles.value.find((r) => r.nombre === 'Medico')
  if (!rolMedico) return []
  return empleados.value.filter((emp) => emp.rolId === rolMedico.id)
})

// Métodos
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
  if (tab === 'empleados' && currentPageEmpleados.value < totalPagesEmpleados.value)
    currentPageEmpleados.value++
  if (tab === 'medicos' && currentPageMedicos.value < totalPagesMedicos.value)
    currentPageMedicos.value++
  if (tab === 'pacientes' && currentPagePacientes.value < totalPagesPacientes.value)
    currentPagePacientes.value++
  if (tab === 'medicamentos' && currentPageMedicamentos.value < totalPagesMedicamentos.value)
    currentPageMedicamentos.value++
}

const prevPage = (tab: string) => {
  if (tab === 'empleados' && currentPageEmpleados.value > 1) currentPageEmpleados.value--
  if (tab === 'medicos' && currentPageMedicos.value > 1) currentPageMedicos.value--
  if (tab === 'pacientes' && currentPagePacientes.value > 1) currentPagePacientes.value--
  if (tab === 'medicamentos' && currentPageMedicamentos.value > 1) currentPageMedicamentos.value--
}

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
      resRoles,
    ] = await Promise.all([
      apiClient.get('/Empleados', config),
      apiClient.get('/Medicos', config),
      apiClient.get('/Pacientes', config),
      apiClient.get('/CentrosMedicos', config),
      apiClient.get('/Especialidades', config),
      apiClient.get('/Medicamentos', config),
      apiClient.get('/Roles', config),
    ])

    empleados.value = resEmpleados.data
    medicos.value = resMedicos.data
    pacientes.value = resPacientes.data
    centrosMedicos.value = resCentros.data
    especialidades.value = resEspecialidades.data
    medicamentos.value = resMedicamentos.data
    roles.value = resRoles.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    if (isAxiosError(error) && error.response?.status === 401) logout()
  }
}

const esAdministradorPropio = (empleado: Partial<Empleado>) => {
  return empleado.id === adminEmpleadoId.value
}

// EMPLEADOS
const abrirModalEmpleado = (empleado: Empleado | null) => {
  if (empleado) {
    modoEdicion.value = true
    empleadoEditable.value = { ...empleado }
    delete empleadoEditable.value.password
  } else {
    modoEdicion.value = false
    empleadoEditable.value = {}
  }
  showModalEmpleado.value = true
}

const cerrarModalEmpleado = () => {
  showModalEmpleado.value = false
  empleadoEditable.value = {}
}

const guardarEmpleado = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    if (modoEdicion.value) {
      await apiClient.put(`/Empleados/${empleadoEditable.value.id}`, empleadoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Empleado actualizado con éxito')
    } else {
      await apiClient.post('/Empleados', empleadoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Empleado creado con éxito')
    }
    cerrarModalEmpleado()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar empleado:', error)
    alert('No se pudo guardar el empleado')
  }
}

const eliminarEmpleado = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este empleado?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Empleados/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Empleado eliminado')
    cerrarModalEmpleado()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar empleado:', error)
    alert('No se pudo eliminar el empleado')
  }
}

// MÉDICOS
const abrirModalMedico = (medico: Medico | null) => {
  if (medico) {
    modoEdicionMedico.value = true
    medicoEditable.value = { ...medico }
  } else {
    modoEdicionMedico.value = false
    medicoEditable.value = {}
  }
  showModalMedico.value = true
}

const cerrarModalMedico = () => {
  showModalMedico.value = false
  medicoEditable.value = {}
}

const guardarMedico = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    if (modoEdicionMedico.value) {
      await apiClient.put(`/Medicos/${medicoEditable.value.id}`, medicoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Médico actualizado con éxito')
    } else {
      await apiClient.post('/Medicos', medicoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Médico creado con éxito')
    }
    cerrarModalMedico()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar médico:', error)
    alert('No se pudo guardar el médico')
  }
}

const eliminarMedico = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este médico?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Medicos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Médico eliminado')
    cerrarModalMedico()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar médico:', error)
    alert('No se pudo eliminar el médico')
  }
}

// PACIENTES
const abrirModalPaciente = (paciente: Paciente | null) => {
  if (paciente) {
    modoEdicionPaciente.value = true
    pacienteEditable.value = {
      ...paciente,
      fechaNacimiento: paciente.fechaNacimiento
        ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
        : '',
    }
  } else {
    modoEdicionPaciente.value = false
    pacienteEditable.value = {}
  }
  showModalPaciente.value = true
}

const cerrarModalPaciente = () => {
  showModalPaciente.value = false
  pacienteEditable.value = {}
}

const guardarPaciente = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    if (modoEdicionPaciente.value) {
      await apiClient.put(`/Pacientes/${pacienteEditable.value.id}`, pacienteEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Paciente actualizado con éxito')
    } else {
      await apiClient.post('/Pacientes', pacienteEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Paciente creado con éxito')
    }
    cerrarModalPaciente()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar paciente:', error)
    alert('No se pudo guardar el paciente')
  }
}

const eliminarPaciente = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este paciente?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Pacientes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Paciente eliminado')
    cerrarModalPaciente()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar paciente:', error)
    alert('No se pudo eliminar el paciente')
  }
}

// CENTROS MÉDICOS
const abrirModalCentro = (centro: CentroMedico | null) => {
  if (centro) {
    modoEdicionCentro.value = true
    centroEditable.value = { ...centro }
  } else {
    modoEdicionCentro.value = false
    centroEditable.value = {}
  }
  showModalCentro.value = true
}

const cerrarModalCentro = () => {
  showModalCentro.value = false
  centroEditable.value = {}
}

const guardarCentro = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    if (modoEdicionCentro.value) {
      await apiClient.put(`/CentrosMedicos/${centroEditable.value.id}`, centroEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Centro médico actualizado con éxito')
    } else {
      await apiClient.post('/CentrosMedicos', centroEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Centro médico creado con éxito')
    }
    cerrarModalCentro()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar centro:', error)
    alert('No se pudo guardar el centro médico')
  }
}

const eliminarCentro = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este centro médico?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/CentrosMedicos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Centro médico eliminado')
    cerrarModalCentro()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar centro:', error)
    alert('No se pudo eliminar el centro médico')
  }
}

// ESPECIALIDADES
const abrirModalEspecialidad = (especialidad: Especialidad | null) => {
  if (especialidad) {
    modoEdicionEspecialidad.value = true
    especialidadEditable.value = { ...especialidad }
  } else {
    modoEdicionEspecialidad.value = false
    especialidadEditable.value = {}
  }
  showModalEspecialidad.value = true
}

const cerrarModalEspecialidad = () => {
  showModalEspecialidad.value = false
  especialidadEditable.value = {}
}

const guardarEspecialidad = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return

  try {
    if (modoEdicionEspecialidad.value) {
      await apiClient.put(
        `/Especialidades/${especialidadEditable.value.id}`,
        especialidadEditable.value,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert('Especialidad actualizada con éxito')
    } else {
      await apiClient.post('/Especialidades', especialidadEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Especialidad creada con éxito')
    }
    cerrarModalEspecialidad()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar especialidad:', error)
    alert('No se pudo guardar la especialidad')
  }
}

const eliminarEspecialidad = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar esta especialidad?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Especialidades/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Especialidad eliminada')
    cerrarModalEspecialidad()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar especialidad:', error)
    alert('No se pudo eliminar la especialidad')
  }
}

// MEDICAMENTOS
const abrirModalMedicamento = (medicamento: Medicamento | null) => {
  if (medicamento) {
    modoEdicionMedicamento.value = true
    medicamentoEditable.value = { ...medicamento }
  } else {
    modoEdicionMedicamento.value = false
    medicamentoEditable.value = {}
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
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert('Medicamento actualizado con éxito')
    } else {
      await apiClient.post('/Medicamentos', medicamentoEditable.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Medicamento creado con éxito')
    }
    cerrarModalMedicamento()
    cargarDatos()
  } catch (error) {
    console.error('Error al guardar medicamento:', error)
    alert('No se pudo guardar el medicamento')
  }
}

const eliminarMedicamento = async (id: number | undefined) => {
  if (!id || !confirm('¿Está seguro de eliminar este medicamento?')) return

  const token = localStorage.getItem('authToken')
  try {
    await apiClient.delete(`/Medicamentos/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Medicamento eliminado')
    cerrarModalMedicamento()
    cargarDatos()
  } catch (error) {
    console.error('Error al eliminar medicamento:', error)
    alert('No se pudo eliminar el medicamento')
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
</script>

<style scoped src="@/assets/admin-portal-styles.css"></style>
