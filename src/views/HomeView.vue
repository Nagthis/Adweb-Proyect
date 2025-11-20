<template>
  <div>
    <!-- Hero Section -->
    <div class="hero-section text-center text-white mb-5">
      <div class="hero-overlay d-flex flex-column justify-content-center align-items-center">
        <h1 class="display-3 fw-bold mb-3 animate-fade-in">Impulsa tu Futuro Digital</h1>
        <p class="lead mb-4 animate-fade-in-delay">Descubre los mejores cursos de programación y diseño web.</p>
        <b-button variant="primary" size="lg" class="hero-btn animate-fade-in-delay-2" @click="scrollToCourses">
          Explorar Cursos
        </b-button>
      </div>
    </div>

    <div class="container py-4" id="courses-list" aria-labelledby="home-title">
      <h2 id="home-title" class="mb-4 text-center fw-bold section-title">Cursos Disponibles</h2>
      <p class="text-muted text-center mb-5">Explora nuestra selección de cursos y comienza a aprender hoy mismo.</p>
      
      <div v-if="courses && courses.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="course in courses" :key="course.id" class="col d-flex">
          <CourseCard :course="course" class="flex-fill" />
        </div>
      </div>
      <div v-else class="alert alert-info text-center" role="alert">
        No hay cursos disponibles en este momento.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CourseCard from '../components/CourseCard.vue';

export default {
  name: 'HomeView',
  components: { CourseCard },
  computed: {
    ...mapGetters(['orderedCourses']),
    courses() {
      return this.orderedCourses;
    }
  },
  methods: {
    scrollToCourses() {
      const element = document.getElementById('courses-list');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  },
  created() {
    // Al crear la vista iniciamos la escucha de los cursos en Firestore
    this.$store.dispatch('listenCourses');
  }
};
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 500px;
  background-image: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Efecto Parallax */
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Oscurecer imagen para leer texto */
  padding: 20px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background: var(--primary-color);
  margin: 10px auto 0;
  border-radius: 2px;
}

.hero-btn {
  padding: 10px 30px;
  font-weight: 600;
  border-radius: 30px;
  transition: transform 0.2s;
}

.hero-btn:hover {
  transform: scale(1.05);
}

/* Animaciones simples */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.5s backwards;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 1s ease-out 1s backwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>