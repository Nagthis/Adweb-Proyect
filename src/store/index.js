import { createStore } from 'vuex';
import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  getDocs
} from 'firebase/firestore';

/**
 * Vuex Store para manejar el estado global de la aplicación. Aquí se
 * centralizan datos como el usuario actualmente autenticado y el listado de cursos.
 * Las acciones encapsulan la lógica asincrónica para interactuar con
 * Firebase Authentication y Firestore. Las mutaciones son las únicas
 * responsables de modificar directamente el estado.
 */
const store = createStore({
  state() {
    return {
      user: null,
      courses: [],
      enrolledCourseIds: [] // Lista de IDs de cursos inscritos
    };
  },
  getters: {
    /**
     * Devuelve el correo electrónico del usuario autenticado o null si no
     * existe sesión. Este getter facilita mostrar el correo en la barra de navegación.
     */
    userEmail(state) {
      return state.user ? state.user.email : null;
    },
    /**
     * Devuelve el listado de cursos ordenados por nombre. Es útil tanto
     * para la vista de inicio como para el panel de administración.
     */
    orderedCourses(state) {
      return [...state.courses].sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    /**
     * Devuelve una función que obtiene un curso por su id. De esta forma
     * se puede acceder de forma rápida a un curso para editarlo.
     */
    getCourseById(state) {
      return (id) => state.courses.find(course => course.id === id);
    },
    /**
     * Devuelve true si el usuario autenticado es el administrador.
     */
    isAdmin(state) {
      return state.user && state.user.email === 'admin@adweb.com';
    },
  },
  mutations: {
    /**
     * Actualiza el usuario autenticado en el estado. Se llama cuando
     * Firebase notifica un cambio en la sesión.
     */
    setUser(state, user) {
      state.user = user;
    },
    /**
     * Reemplaza el listado completo de cursos. Generalmente es ejecutada
     * cuando onSnapshot devuelve nuevos datos desde Firestore.
     */
    setCourses(state, courses) {
      state.courses = courses;
    },
    setEnrolledCourseIds(state, ids) {
      state.enrolledCourseIds = ids;
    }
  },
  actions: {
    /**
     * Crea un nuevo usuario en Firebase Authentication utilizando
     * correo y contraseña. Si tiene éxito, muta el estado con el
     * usuario recién autenticado.
     */
    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      commit('setUser', userCredential.user);
    },
    /**
     * Inicia sesión con correo y contraseña. Al completar la sesión se
     * actualiza el estado con el usuario devuelto.
     */
    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      commit('setUser', userCredential.user);
    },
    /**
     * Cierra la sesión del usuario actual. También limpia el usuario en el estado.
     */
    async logout({ commit }) {
      await signOut(auth);
      commit('setUser', null);
    },
    /**
     * Agrega un nuevo curso a la colección "courses" en Firestore. Los
     * cursos deben incluir, al menos: codigo, nombre, estado, precio,
     * duracion, descripcion, cupos e inscritos. La URL de la imagen (img)
     * es opcional. Firestore generará automáticamente un id para cada curso.
     * Se agrega el ID del usuario creador (ownerId) para control de permisos.
     */
    async addCourse(context, course) {
      // Agregar el ID del usuario actual como dueño del curso
      const courseWithUser = {
        ...course,
        ownerId: auth.currentUser ? auth.currentUser.uid : null
      };
      await addDoc(collection(db, 'courses'), courseWithUser);
    },
    /**
     * Inscribe al usuario en un curso, decrementando cupos y aumentando inscritos.
     * También registra la inscripción en la subcolección del usuario.
     */
    async enrollInCourse({ dispatch, state }, course) {
      const user = auth.currentUser;
      if (!user) throw new Error("Debes iniciar sesión para inscribirte");

      // Verificar si ya está inscrito
      if (state.enrolledCourseIds.includes(course.id)) {
        throw new Error("Ya estás inscrito en este curso.");
      }

      if (course.cupos > 0) {
        // 1. Registrar inscripción en el usuario
        // Usamos el ID del curso como ID del documento para evitar duplicados
        await setDoc(doc(db, 'users', user.uid, 'enrollments', course.id), {
          courseId: course.id,
          enrolledAt: new Date()
        });

        // 2. Actualizar contadores del curso
        const docRef = doc(db, 'courses', course.id);
        await updateDoc(docRef, {
          cupos: course.cupos - 1,
          inscritos: (course.inscritos || 0) + 1
        });

        // 3. Actualizar lista local
        dispatch('fetchUserEnrollments');
      } else {
        throw new Error("No hay cupos disponibles");
      }
    },
    /**
     * Obtiene los IDs de los cursos en los que el usuario está inscrito.
     */
    async fetchUserEnrollments({ commit }) {
      const user = auth.currentUser;
      if (!user) {
        commit('setEnrolledCourseIds', []);
        return;
      }
      
      try {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'enrollments'));
        const ids = [];
        querySnapshot.forEach((doc) => {
          ids.push(doc.id);
        });
        commit('setEnrolledCourseIds', ids);
      } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        // Si falla por permisos (ej. colección no existe aún), simplemente dejamos la lista vacía
        commit('setEnrolledCourseIds', []);
      }
    },
    /**
     * Elimina un curso de Firestore a partir de su id. Tras la
     * eliminación Firestore notificará automáticamente a través de
     * onSnapshot y la interfaz se actualizará.
     */
    async deleteCourse(context, id) {
      const docRef = doc(db, 'courses', id);
      await deleteDoc(docRef);
    },
    /**
     * Actualiza un curso existente en Firestore. Recibe un objeto con
     * propiedades a actualizar. Solo los campos incluidos se
     * modificarán; los demás se mantendrán sin cambios.
     */
    async updateCourse(context, { id, updatedCourse }) {
      const docRef = doc(db, 'courses', id);
      await updateDoc(docRef, updatedCourse);
    },
    /**
     * Escucha en tiempo real la colección de cursos. Al establecer
     * este observador, Firestore envía notificaciones cada vez que
     * los datos cambian (agregar, editar o eliminar). El resultado
     * obtenido se almacena en el estado a través de la mutación
     * setCourses.
     */
    listenCourses({ commit }) {
      const coursesCollection = collection(db, 'courses');
      onSnapshot(coursesCollection, snapshot => {
        const courses = [];
        snapshot.forEach(docSnap => {
          courses.push({ id: docSnap.id, ...docSnap.data() });
        });
        commit('setCourses', courses);
      });
    },
    /**
     * Actualiza el estado con el usuario entregado. Esta acción se
     * ejecuta desde main.js cuando el listener de onAuthStateChanged
     * detecta un cambio en la sesión.
     */
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    /**
     * Actualiza la contraseña del usuario actual.
     */
    async updateUserPassword(context, newPassword) {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
      } else {
        throw new Error("Usuario no autenticado");
      }
    },
  },
  modules: {}
});

export default store;