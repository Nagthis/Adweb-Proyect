<template>
  <div class="container py-4" aria-labelledby="admin-title">
    <h1 id="admin-title" class="mb-4">Administración de Cursos</h1>
    <p class="text-muted">Desde aquí puedes agregar, editar o eliminar cursos. Los cambios se reflejarán en tiempo real para todos los usuarios.</p>
    <b-button variant="success" class="mb-3" @click="showAddModal = true">Agregar nuevo curso</b-button>
    <!-- Tabla de cursos -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead class="table-light">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Cupos</th>
            <th>Inscritos</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.codigo }}</td>
            <td>{{ course.nombre }}</td>
            <td>${{ course.precio }}</td>
            <td>{{ course.duracion }}</td>
            <td>{{ course.cupos }}</td>
            <td>{{ course.inscritos }}</td>
            <td>
              <span :class="course.estado ? 'text-success' : 'text-danger'">
                {{ course.estado ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <!-- Solo mostrar botones si es el dueño del curso -->
              <div v-if="isOwner(course)">
                <b-button size="sm" variant="primary" class="me-2" @click="editCourse(course.id)">
                  Editar
                </b-button>
                <b-button size="sm" variant="danger" @click="confirmDelete(course)">
                  Eliminar
                </b-button>
              </div>
              <div v-else>
                <span class="text-muted small">Solo lectura</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal para agregar un curso -->
    <AddCourseModal v-model:show="showAddModal" @saved="onCourseSaved" />
    <!-- Modal de confirmación de eliminación -->
    <b-modal
      id="confirm-delete-modal"
      v-model="showDeleteModal"
      title="Eliminar curso"
      hide-footer
    >
      <p>¿Está seguro de que desea eliminar el curso <strong>{{ courseToDelete?.nombre }}</strong>?</p>
      <div class="d-flex justify-content-end">
        <b-button variant="secondary" class="me-2" @click="showDeleteModal = false">Cancelar</b-button>
        <b-button variant="danger" @click="deleteCourse">Sí, borrar</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { auth } from '../firebase/firebase'; // Importar auth para obtener usuario actual
import AddCourseModal from '../components/AddCourseModal.vue';

export default {
  name: 'AdminView',
  components: { AddCourseModal },
  data() {
    return {
      showAddModal: false,
      showDeleteModal: false,
      courseToDelete: null,
      currentUserId: null // Para almacenar el ID del usuario actual
    };
  },
  computed: {
    ...mapGetters(['orderedCourses', 'isAdmin']),
    courses() {
      return this.orderedCourses;
    }
  },
  methods: {
    onCourseSaved() {
      // Cierra el modal de agregar después de guardar
      this.showAddModal = false;
    },
    editCourse(id) {
      this.$router.push({ name: 'EditCourse', params: { id } });
    },
    confirmDelete(course) {
      this.courseToDelete = course;
      this.showDeleteModal = true;
    },
    async deleteCourse() {
      try {
        await this.$store.dispatch('deleteCourse', this.courseToDelete.id);
        this.showDeleteModal = false;
      } catch (err) {
        console.error('Error eliminando curso:', err);
        alert("Error al eliminar: " + err.message);
      }
    },
    // Verifica si el usuario actual es el dueño del curso o es admin
    isOwner(course) {
      // Si es admin, tiene permiso total
      if (this.isAdmin) return true;
      
      // Si el curso no tiene ownerId (cursos antiguos), asumimos que no se puede borrar/editar
      // o podrías permitirlo si eres admin global, pero por seguridad restringimos.
      return course.ownerId && course.ownerId === this.currentUserId;
    }
  },
  created() {
    // Suscribirse a los cursos al entrar en la vista
    this.$store.dispatch('listenCourses');
    // Obtener usuario actual
    if (auth.currentUser) {
      this.currentUserId = auth.currentUser.uid;
    }
  }
};
</script>