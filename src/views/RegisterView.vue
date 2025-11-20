<template>
  <div class="container py-5" aria-labelledby="register-title">
    <h1 id="register-title" class="mb-4">Registro de usuario</h1>
    <b-alert
      v-if="error"
      variant="danger"
      dismissible
      @dismissed="error = ''"
    >{{ error }}</b-alert>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        label="Correo electrónico"
        label-for="register-email"
        description="Ingrese un correo válido"
      >
        <b-form-input
          id="register-email"
          v-model="email"
          type="email"
          required
          placeholder="nombre@dominio.com"
        />
      </b-form-group>
      <b-form-group
        label="Contraseña"
        label-for="register-password"
        description="Debe contener al menos 6 caracteres"
      >
        <b-form-input
          id="register-password"
          v-model="password"
          type="password"
          required
          minlength="6"
          placeholder="********"
        />
      </b-form-group>
      <b-form-group
        label="Confirmar contraseña"
        label-for="register-confirm"
      >
        <b-form-input
          id="register-confirm"
          v-model="confirm"
          type="password"
          required
          placeholder="Repita su contraseña"
        />
      </b-form-group>
      <b-button type="submit" variant="primary" class="mt-3">
        Crear cuenta
      </b-button>
    </b-form>
    <p class="mt-3">
      ¿Ya tienes una cuenta?
      <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirm: '',
      error: ''
    };
  },
  computed: {
    passwordMismatch() {
      return this.password && this.confirm && this.password !== this.confirm;
    }
  },
  methods: {
    async onSubmit() {
      this.error = '';
      
      if (this.password !== this.confirm) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      try {
        await this.$store.dispatch('register', {
          email: this.email,
          password: this.password
        });
        // Tras registro exitoso, redirige al home
        this.$router.push('/');
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'El correo electrónico ya está en uso.';
        } else if (err.code === 'auth/weak-password') {
          this.error = 'La contraseña es muy débil (mínimo 6 caracteres).';
        } else {
          this.error = 'No se pudo registrar el usuario: ' + err.message;
        }
      }
    }
  }
};
</script>