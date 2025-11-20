import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Importación de Bootstrap y BootstrapVue3
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';

// Importar configuración de Firebase para inicializar la conexión
import { auth } from './firebase/firebase';

/**
 * El archivo main.js sirve como punto de entrada de la aplicación. Aquí
 * se instancia Vue, se cargan las dependencias globales (router, store,
 * bootstrap) y se montan los componentes en el DOM. También se
 * establece un observador del estado de autenticación para actualizar
 * automáticamente el usuario en Vuex.
 */

const app = createApp(App);

// Habilitar Vuex para el manejo del estado global y Vue Router para la navegación
app.use(store);
app.use(router);
app.use(BootstrapVue3);

// Establecer un observador sobre el estado de autenticación. Cada vez que
// cambie el usuario autenticado, se actualiza el estado en Vuex. Esto
// permite proteger rutas y mostrar información sensible sólo a usuarios
// validados.
auth.onAuthStateChanged((user) => {
  store.dispatch('setUser', user);
});

// Montar la aplicación en el contenedor con id "app" en el archivo index.html
app.mount('#app');