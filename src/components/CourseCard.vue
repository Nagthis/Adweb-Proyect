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
      
      <div class="mt-3 d-flex flex-column" v-if="isEnrolled">
        <b-button variant="success" disabled class="w-100 mb-2">Inscrito</b-button>
        <b-button variant="danger" class="w-100" @click="unenroll">Anular inscripción</b-button>
      </div>
      <div class="mt-3" v-else-if="canEnroll">
        <b-button variant="primary" class="w-100" @click="enroll">Inscribirse</b-button>
      </div>
      <div class="mt-3" v-else-if="!course.estado">
        <b-button variant="secondary" disabled class="w-100">Curso Inactivo</b-button>
      </div>
      <div class="mt-3" v-else>
        <b-button variant="secondary" disabled class="w-100">Sin Cupos</b-button>
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
      return (this.course.img && this.course.img.trim() !== '')
        ? this.course.img
        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    },
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
    },
    async unenroll() {
      if (!confirm('¿Estás seguro de que deseas anular tu inscripción a este curso?')) return;
      try {
        await this.$store.dispatch('unenrollFromCourse', this.course);
        alert('Inscripción anulada correctamente.');
      } catch (error) {
        console.error(error);
        alert('Error al anular inscripción: ' + error.message);
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

:deep(.card-img-top) {
  height: 200px;
  object-fit: contain;
  padding: 0.5rem;
}
</style>