import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

// Importación de vistas. Las vistas representan páginas completas y se
// cargan dinámicamente mediante lazy loading para optimizar el tamaño del bundle.
const HomeView = () => import('../views/HomeView.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const AdminView = () => import('../views/AdminView.vue');
const EditCourseView = () => import('../views/EditCourseView.vue');
const ProfileView = () => import('../views/ProfileView.vue');

/**
 * Definición de las rutas de la aplicación. Cada ruta puede incluir
 * metadatos (meta) que permiten proteger el acceso a ciertas vistas.
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'EditCourse',
    component: EditCourseView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    // Redirecciona cualquier ruta no reconocida a la página principal
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

/**
 * Guard global de navegación. Antes de entrar en una ruta se revisa si
 * ésta requiere estar autenticado. En caso afirmativo, se verifica si
 * hay un usuario en el store; si no existe, redirige al login.
 */
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!store.state.user;
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    // Si ya está autenticado y quiere ir a login o registro, redirige al home
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;