<template>
  <div id="app" :class="theme" class="d-flex flex-column min-vh-100 app-container">
    <!-- Encabezado y barra de navegación -->
    <header>
      <Navbar :theme="theme" @toggle-theme="toggleTheme" />
    </header>

    <!-- Contenido principal -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Pie de página -->
    <footer class="footer py-3 text-center mt-auto">
      <small>&copy; {{ new Date().getFullYear() }} Adweb Online. Todos los derechos reservados.</small>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: { Navbar },
  data() {
    return {
      theme: 'light'
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      // Guardar preferencia en localStorage
      localStorage.setItem('user-theme', this.theme);
      this.updateBodyClass();
    },
    updateBodyClass() {
      document.body.className = this.theme === 'dark' ? 'bg-dark-body' : 'bg-light-body';
    }
  },
  mounted() {
    // Cargar preferencia guardada o usar preferencia del sistema
    const savedTheme = localStorage.getItem('user-theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    }
    this.updateBodyClass();
  }
};
</script>

<style>
:root {
  /* Paleta de colores moderna (Light) */
  --primary-color: #6366f1; /* Indigo */
  --secondary-color: #10b981; /* Emerald */
  --bg-color: #f3f4f6;
  --surface-color: #ffffff;
  --text-color: #1f2937;
  --text-muted: #6b7280;
  --footer-bg: #e5e7eb;
  --card-border: rgba(0,0,0,0.125);
}

/* Paleta Dark */
.dark {
  --primary-color: #818cf8;
  --secondary-color: #34d399;
  --bg-color: #111827;
  --surface-color: #1f2937;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --footer-bg: #1f2937;
  --card-border: #374151;
}

/* Aplicación de variables */
body {
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.bg-light-body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.bg-dark-body {
  background-color: #111827; /* Hardcoded for body to ensure full coverage */
  color: #f9fafb;
}

.app-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Sobrescribir estilos de Bootstrap para modo oscuro */
.dark .card {
  background-color: var(--surface-color);
  color: var(--text-color);
  border-color: var(--card-border);
}

.dark .modal-content {
  background-color: var(--surface-color);
  color: var(--text-color);
  border-color: var(--card-border);
}

.dark .form-control, .dark .form-select {
  background-color: #374151;
  border-color: #4b5563;
  color: var(--text-color);
}

.dark .form-control:focus {
  background-color: #374151;
  color: var(--text-color);
}

.footer {
  background-color: var(--footer-bg);
  color: var(--text-muted);
  transition: background-color 0.3s ease;
}

/* Botones primarios con el nuevo color */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #4f46e5; /* Un poco más oscuro */
  border-color: #4f46e5;
}

/* Estilos para tablas en modo oscuro */
.dark .table {
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark .table-striped > tbody > tr:nth-of-type(odd) > * {
  color: var(--text-color);
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .table-light {
  background-color: #374151;
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark .table-light th {
  background-color: #374151;
  color: var(--text-color);
  border-color: var(--border-color);
}

/* Override text-muted for dark mode */
.dark .text-muted {
  color: var(--text-muted) !important;
}
</style>