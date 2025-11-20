<template>
  <div class="container py-4">
    <h1 class="mb-4">Mi Perfil</h1>

    <b-tabs content-class="mt-3">
      <!-- Pestaña 1: Mis Cursos (Publicados) -->
      <b-tab title="Mis Cursos Publicados" active>
        <div v-if="myPublishedCourses.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="course in myPublishedCourses" :key="course.id" class="col d-flex">
            <CourseCard :course="course" class="flex-fill" />
          </div>
        </div>
        <b-alert v-else show variant="info">No has publicado ningún curso todavía.</b-alert>
      </b-tab>

      <!-- Pestaña 2: Mis Inscripciones -->
      <b-tab title="Mis Inscripciones">
        <div v-if="myEnrolledCourses.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="course in myEnrolledCourses" :key="course.id" class="col d-flex">
            <CourseCard :course="course" class="flex-fill" />
          </div>
        </div>
        <b-alert v-else show variant="info">No estás inscrito en ningún curso.</b-alert>
      </b-tab>

      <!-- Pestaña 3: Seguridad (Cambio de contraseña) -->
      <b-tab title="Seguridad">
        <div class="row">
          <div class="col-md-6">
            <b-card title="Cambiar Contraseña">
              <b-form @submit.prevent="onPasswordSubmit">
                <b-alert v-if="passError" show variant="danger">{{ passError }}</b-alert>
                <b-alert v-if="passSuccess" show variant="success">{{ passSuccess }}</b-alert>

                <b-form-group label="Nueva Contraseña" label-for="new-pass">
                  <b-form-input id="new-pass" v-model="newPassword" type="password" required minlength="6" />
                </b-form-group>

                <b-form-group label="Confirmar Contraseña" label-for="confirm-pass" class="mt-2">
                  <b-form-input id="confirm-pass" v-model="confirmPassword" type="password" required />
                </b-form-group>

                <b-button type="submit" variant="primary" class="mt-3">Actualizar Contraseña</b-button>
              </b-form>
            </b-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CourseCard from '../components/CourseCard.vue';
import { auth } from '../firebase/firebase';

export default {
  name: 'ProfileView',
  components: { CourseCard },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      passError: '',
      passSuccess: ''
    };
  },
  computed: {
    ...mapGetters(['orderedCourses']),
    ...mapState(['enrolledCourseIds']),
    myPublishedCourses() {
      const uid = auth.currentUser ? auth.currentUser.uid : null;
      return this.orderedCourses.filter(c => c.ownerId === uid);
    },
    myEnrolledCourses() {
      // Filtra los cursos cuyos IDs están en la lista de inscripciones del usuario
      return this.orderedCourses.filter(c => this.enrolledCourseIds.includes(c.id));
    }
  },
  methods: {
    async onPasswordSubmit() {
      this.passError = '';
      this.passSuccess = '';
      if (this.newPassword !== this.confirmPassword) {
        this.passError = 'Las contraseñas no coinciden.';
        return;
      }
      try {
        await this.$store.dispatch('updateUserPassword', this.newPassword);
        this.passSuccess = 'Contraseña actualizada correctamente.';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (err) {
        if (err.code === 'auth/requires-recent-login') {
            this.passError = 'Por seguridad, debes haber iniciado sesión recientemente. Cierra sesión y vuelve a entrar.';
        } else {
            this.passError = err.message;
        }
      }
    }
  },
  created() {
    this.$store.dispatch('listenCourses');
    this.$store.dispatch('fetchUserEnrollments');
  }
};
</script>
