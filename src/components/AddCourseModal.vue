<template>
  <b-modal
    id="add-course-modal"
    :model-value="show"
    title="Agregar Nuevo Curso"
    @update:modelValue="updateShow"
    hide-footer
  >
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        label="Código"
        label-for="course-code"
        description="Código único del curso"
      >
        <b-form-input id="course-code" v-model="form.codigo" required />
      </b-form-group>

      <b-form-group
        label="Nombre"
        label-for="course-name"
        description="Nombre del curso"
      >
        <b-form-input id="course-name" v-model="form.nombre" required />
      </b-form-group>

      <b-form-group label="Descripción" label-for="course-desc">
        <b-form-textarea
          id="course-desc"
          v-model="form.descripcion"
          rows="2"
          required
        />
      </b-form-group>

      <b-form-group
        label="Duración"
        label-for="course-duration"
        description="Ejemplo: 1 mes, 2 meses"
      >
        <b-form-input id="course-duration" v-model="form.duracion" required />
      </b-form-group>

      <b-form-group
        label="Precio"
        label-for="course-price"
        description="Valor numérico en pesos chilenos"
      >
        <b-form-input
          id="course-price"
          v-model.number="form.precio"
          type="number"
          min="0"
          required
        />
      </b-form-group>

      <b-form-group label="Cupos" label-for="course-cupos">
        <b-form-input
          id="course-cupos"
          v-model.number="form.cupos"
          type="number"
          min="0"
          required
        />
      </b-form-group>

      <b-form-group label="URL de la imagen (opcional)" label-for="course-img">
        <b-form-input
          id="course-img"
          v-model="form.img"
          type="text"
          placeholder="https://ejemplo.com/imagen.png"
        />
      </b-form-group>

      <b-form-group label="Estado" label-for="course-state">
        <b-form-select
          id="course-state"
          v-model="form.estado"
          :options="stateOptions"
        />
      </b-form-group>

      <div class="d-flex justify-content-end">
        <b-button
          type="button"
          variant="secondary"
          class="me-2"
          @click="cancel"
        >
          Cancelar
        </b-button>
        <b-button type="submit" variant="primary"> Agregar curso </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import { auth } from "../firebase/firebase";

export default {
  name: "AddCourseModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        codigo: "",
        nombre: "",
        descripcion: "",
        duracion: "",
        precio: 0,
        cupos: 1,
        inscritos: 0,
        img: "",
        estado: true,
      },
      stateOptions: [
        { value: true, text: "Activo" },
        { value: false, text: "Inactivo" },
      ],
    };
  },
  methods: {
    updateShow(value) {
      this.$emit("update:show", value);
    },
    cancel() {
      this.resetForm();
      this.updateShow(false);
    },
    async onSubmit() {
      if (!auth.currentUser) {
        alert("No estás autenticado. Por favor inicia sesión nuevamente.");
        return;
      }

      if (!this.form.img || this.form.img.trim() === '') {
        this.form.img = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      }

      try {
        await this.$store.dispatch("addCourse", { ...this.form });
        this.$emit("saved");
        this.resetForm();
        this.updateShow(false);
      } catch (err) {
        console.error("Error al agregar curso:", err);
        alert("Error al agregar el curso: " + err.message);
      }
    },
    resetForm() {
      this.form = {
        codigo: "",
        nombre: "",
        descripcion: "",
        duracion: "",
        precio: 0,
        cupos: 1,
        inscritos: 0,
        img: "",
        estado: true,
      };
    },
  },
};
</script>
