<template>
  <div class="container py-4" aria-labelledby="edit-title">
    <h1 id="edit-title" class="mb-4">Editar curso</h1>
    <div v-if="course">
      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Código" label-for="edit-code">
          <b-form-input id="edit-code" v-model="form.codigo" required />
        </b-form-group>
        <b-form-group label="Nombre" label-for="edit-name">
          <b-form-input id="edit-name" v-model="form.nombre" required />
        </b-form-group>
        <b-form-group label="Descripción" label-for="edit-desc">
          <b-form-textarea id="edit-desc" v-model="form.descripcion" rows="2" required />
        </b-form-group>
        <b-form-group label="Duración" label-for="edit-duration">
          <b-form-input id="edit-duration" v-model="form.duracion" required />
        </b-form-group>
        <b-form-group label="Precio" label-for="edit-price">
          <b-form-input id="edit-price" v-model.number="form.precio" type="number" min="0" required />
        </b-form-group>
        <b-form-group label="Cupos" label-for="edit-cupos">
          <b-form-input id="edit-cupos" v-model.number="form.cupos" type="number" min="1" required />
        </b-form-group>
        <b-form-group label="Inscritos" label-for="edit-inscritos">
          <b-form-input id="edit-inscritos" v-model.number="form.inscritos" type="number" min="0" required />
        </b-form-group>
        <b-form-group label="URL de la imagen" label-for="edit-img">
          <b-form-input id="edit-img" v-model="form.img" type="url" />
        </b-form-group>
        <b-form-group label="Estado" label-for="edit-state">
          <b-form-select id="edit-state" v-model="form.estado" :options="stateOptions" />
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button type="button" variant="secondary" class="me-2" @click="cancel">Cancelar</b-button>
          <b-button type="submit" variant="primary">Guardar cambios</b-button>
        </div>
      </b-form>
    </div>
    <div v-else class="alert alert-warning" role="alert">
      No se encontró el curso solicitado.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'EditCourseView',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: null,
      stateOptions: [
        { value: true, text: 'Activo' },
        { value: false, text: 'Inactivo' }
      ]
    };
  },
  computed: {
    ...mapGetters(['getCourseById']),
    course() {
      return this.getCourseById(this.$route.params.id);
    }
  },
  watch: {
    course: {
      immediate: true,
      handler(course) {
        if (course) {
          this.form = { ...course };
        }
      }
    }
  },
  methods: {
    cancel() {
      this.$router.push('/admin');
    },
    async onSubmit() {
      const user = this.$store.state.user;
      const isAdmin = user && user.email === 'admin@adweb.com';
      const isOwner = this.form.ownerId && user && this.form.ownerId === user.uid;

      if (!isAdmin && !isOwner) {
        alert(`No tienes permisos para editar este curso.\nTu usuario: ${user ? user.email : 'Desconocido'}\nDueño del curso: ${this.form.ownerId || 'Sin dueño'}`);
        return;
      }

      try {
        const id = this.$route.params.id;
        const updatedCourse = { ...this.form };
        delete updatedCourse.id;
        await this.$store.dispatch('updateCourse', { id, updatedCourse });
        alert('Curso actualizado correctamente');
        this.$router.push('/admin');
      } catch (err) {
        console.error('Error actualizando curso:', err);
        const user = this.$store.state.user;
        const email = user ? user.email : 'Desconocido';
        alert(`Error al actualizar: ${err.message}\nUsuario actual: ${email}`);
      }
    }
  },
  created() {
    this.$store.dispatch('listenCourses');
  }
};
</script>