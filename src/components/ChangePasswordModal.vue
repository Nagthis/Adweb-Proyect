<template>
  <b-modal
    :model-value="show"
    title="Cambiar Contraseña"
    @update:modelValue="$emit('update:show', $event)"
    hide-footer
  >
    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-alert v-if="success" show variant="success">{{ success }}</b-alert>

    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Nueva Contraseña" label-for="new-password">
        <b-form-input
          id="new-password"
          v-model="newPassword"
          type="password"
          required
          minlength="6"
          placeholder="Mínimo 6 caracteres"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Confirmar Nueva Contraseña" label-for="confirm-password" class="mt-2">
        <b-form-input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          required
          minlength="6"
          placeholder="Repita la nueva contraseña"
        ></b-form-input>
      </b-form-group>

      <div class="d-flex justify-content-end mt-3">
        <b-button variant="secondary" class="me-2" @click="$emit('update:show', false)">Cancelar</b-button>
        <b-button type="submit" variant="primary">Actualizar</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: 'ChangePasswordModal',
  props: {
    show: Boolean
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      error: '',
      success: ''
    }
  },
  methods: {
    async onSubmit() {
      this.error = '';
      this.success = '';

      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      try {
        await this.$store.dispatch('updateUserPassword', this.newPassword);
        this.success = 'Contraseña actualizada correctamente.';
        this.newPassword = '';
        this.confirmPassword = '';
        // Cerrar modal después de un momento
        setTimeout(() => {
            this.$emit('update:show', false);
            this.success = '';
        }, 2000);
      } catch (err) {
        if (err.code === 'auth/requires-recent-login') {
            this.error = 'Por seguridad, esta operación requiere que hayas iniciado sesión recientemente. Por favor cierra sesión y vuelve a entrar.';
        } else {
            this.error = 'Error al actualizar: ' + err.message;
        }
      }
    }
  }
}
</script>
