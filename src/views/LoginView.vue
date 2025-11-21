<template>
  <div class="container py-5" aria-labelledby="login-title">
    <h1 id="login-title" class="mb-4">Iniciar sesión</h1>
    <b-alert
      v-if="error"
      variant="danger"
      dismissible
      @dismissed="error = ''"
    >{{ error }}</b-alert>
    <b-form @submit.prevent="onSubmit" aria-describedby="login-help">
      <b-form-group
        label="Correo electrónico"
        label-for="login-email"
        description="Ingrese su correo electrónico registrado"
      >
        <b-form-input
          id="login-email"
          v-model="email"
          type="email"
          required
          placeholder="nombre@dominio.com"
          aria-required="true"
        />
      </b-form-group>
      <b-form-group
        label="Contraseña"
        label-for="login-password"
        description="Ingrese su contraseña"
      >
        <b-form-input
          id="login-password"
          v-model="password"
          type="password"
          required
          placeholder="********"
          aria-required="true"
        />
      </b-form-group>
      <b-button type="submit" variant="primary" class="mt-3">Acceder</b-button>
    </b-form>
    <p class="mt-3">
      ¿No tienes una cuenta?
      <router-link to="/register">Regístrate aquí</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async onSubmit() {
      this.error = '';
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });
        this.$router.push('/');
      } catch (err) {
        this.error = 'Correo o contraseña incorrectos';
      }
    }
  }
};
</script>