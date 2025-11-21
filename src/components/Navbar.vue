<template>
  <b-navbar toggleable="lg" type="dark" class="navbar-custom mb-0">
    <b-navbar-brand to="/" class="brand-logo">
      <span class="fw-bold text-white">Adweb</span><span class="fw-light text-accent">Cursos</span>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/" exact>Inicio</b-nav-item>
        <b-nav-item v-if="isAuthenticated" to="/admin">Administrar Cursos</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ms-auto align-items-center">
        <li class="nav-item me-3">
          <button class="btn btn-sm btn-theme-toggle" @click="$emit('toggle-theme')" title="Cambiar tema">
            {{ theme === 'light' ? '🌙 Oscuro' : '☀️ Claro' }}
          </button>
        </li>

        <template v-if="isAuthenticated">
          <b-nav-item to="/profile" class="me-2">{{ userEmail }}</b-nav-item>
          <li class="nav-item d-flex align-items-center">
            <b-button variant="outline-light" size="sm" @click="logout">Cerrar sesión</b-button>
          </li>
        </template>
        <template v-else>
          <b-nav-item to="/login">Iniciar sesión</b-nav-item>
          <b-nav-item to="/register">Registrarse</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  props: ['theme'],
  emits: ['toggle-theme'],
  computed: {
    ...mapGetters(['userEmail']),
    isAuthenticated() {
      return !!this.$store.state.user;
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  }
};
</script>

<style scoped>
.navbar-custom {
  background-color: #1e1b4b !important;
  padding: 1rem 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
}

.text-accent {
  color: #818cf8 !important;
}

.brand-logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  
  padding: 5px 15px;
  border: 2px solid transparent;
  border-radius: 50px;
  background: linear-gradient(#1e1b4b, #1e1b4b) padding-box,
              linear-gradient(to right, rgba(99, 102, 241, 0.5), rgba(16, 185, 129, 0.5)) border-box;
}

.btn-theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

:deep(.nav-link) {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: rgba(255,255,255,0.8) !important;
  transition: color 0.3s ease;
}

:deep(.nav-link:hover), :deep(.nav-link.active) {
  color: #fff !important;
  font-weight: 600;
}

:deep(.navbar-toggler) {
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  padding: 0.5rem;
}

:deep(.navbar-toggler:focus) {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

:deep(.navbar-toggler-icon) {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>