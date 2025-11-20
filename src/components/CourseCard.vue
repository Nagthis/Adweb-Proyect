<template>
  <b-card
    :title="course.nombre"
    class="w-100 h-100 course-card"
    :img-src="courseImage"
    :img-alt="`Imagen del curso ${course.nombre}`"
    img-top
  >
    <b-card-text>
      <p><strong>Código:</strong> {{ course.codigo }}</p>
      <p><strong>Descripción:</strong> {{ course.descripcion }}</p>
      <p><strong>Duración:</strong> {{ course.duracion }}</p>
      <p><strong>Precio:</strong> ${{ course.precio }}</p>
      <p><strong>Cupos:</strong> {{ course.cupos }}</p>
      <p><strong>Inscritos:</strong> {{ course.inscritos }}</p>
      <p><strong>Estado:</strong> <span :class="stateClass">{{ course.estado ? 'Activo' : 'Inactivo' }}</span></p>
      
      <!-- Botón de inscripción -->
      <div class="mt-3" v-if="isEnrolled">
        <b-button variant="success" disabled block>Inscrito</b-button>
      </div>
      <div class="mt-3" v-else-if="canEnroll">
        <b-button variant="primary" block @click="enroll">Inscribirse</b-button>
      </div>
      <div class="mt-3" v-else-if="!course.estado">
        <b-button variant="secondary" disabled block>Curso Inactivo</b-button>
      </div>
      <div class="mt-3" v-else>
        <b-button variant="secondary" disabled block>Sin Cupos</b-button>
      </div>

    </b-card-text>
  </b-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CourseCard',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['enrolledCourseIds']),
    courseImage() {
      // Si la imagen existe y no está vacía, úsala. Si no, usa la imagen por defecto.
      return (this.course.img && this.course.img.trim() !== '')
        ? this.course.img
        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    },
    /**
     * Determina el color del estado del curso. Utiliza clases de Bootstrap
     * para marcar cursos activos e inactivos.
     */
    stateClass() {
      return this.course.estado ? 'text-success' : 'text-danger';
    },
    isEnrolled() {
      return this.enrolledCourseIds.includes(this.course.id);
    },
    canEnroll() {
      return this.course.estado && this.course.cupos > 0 && !this.isEnrolled;
    }
  },
  methods: {
    async enroll() {
      try {
        await this.$store.dispatch('enrollInCourse', this.course);
        alert('¡Inscripción exitosa!');
      } catch (error) {
        console.error(error);
        alert('Error al inscribirse: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.course-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

/* Ajuste de imágenes para que sean uniformes */
:deep(.card-img-top) {
  height: 200px;
  object-fit: contain;
  padding: 0.5rem;
}
</style>