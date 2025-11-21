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

const store = createStore({
  state() {
    return {
      user: null,
      courses: [],
      enrolledCourseIds: []
    };
  },
  getters: {
    userEmail(state) {
      return state.user ? state.user.email : null;
    },
    orderedCourses(state) {
      return [...state.courses].sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
    getCourseById(state) {
      return (id) => state.courses.find(course => course.id === id);
    },
    isAdmin(state) {
      return state.user && state.user.email === 'admin@adweb.com';
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setCourses(state, courses) {
      state.courses = courses;
    },
    setEnrolledCourseIds(state, ids) {
      state.enrolledCourseIds = ids;
    }
  },
  actions: {
    async register({ commit }, { email, password }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      commit('setUser', userCredential.user);
    },
    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      commit('setUser', userCredential.user);
    },
    async logout({ commit }) {
      await signOut(auth);
      commit('setUser', null);
    },
    async addCourse(context, course) {
      const courseWithUser = {
        ...course,
        ownerId: auth.currentUser ? auth.currentUser.uid : null
      };
      await addDoc(collection(db, 'courses'), courseWithUser);
    },
    async enrollInCourse({ dispatch, state }, course) {
      const user = auth.currentUser;
      if (!user) throw new Error("Debes iniciar sesión para inscribirte");

      if (state.enrolledCourseIds.includes(course.id)) {
        throw new Error("Ya estás inscrito en este curso.");
      }

      if (course.cupos > 0) {
        await setDoc(doc(db, 'users', user.uid, 'enrollments', course.id), {
          courseId: course.id,
          enrolledAt: new Date()
        });

        const docRef = doc(db, 'courses', course.id);
        await updateDoc(docRef, {
          cupos: course.cupos - 1,
          inscritos: (course.inscritos || 0) + 1
        });

        dispatch('fetchUserEnrollments');
      } else {
        throw new Error("No hay cupos disponibles");
      }
    },
    async unenrollFromCourse({ dispatch }, course) {
      const user = auth.currentUser;
      if (!user) throw new Error("Debes iniciar sesión.");

      // 1. Eliminar inscripción del usuario
      await deleteDoc(doc(db, 'users', user.uid, 'enrollments', course.id));

      // 2. Actualizar contadores del curso
      const docRef = doc(db, 'courses', course.id);
      const newInscritos = (course.inscritos || 0) > 0 ? (course.inscritos - 1) : 0;
      
      await updateDoc(docRef, {
        cupos: course.cupos + 1,
        inscritos: newInscritos
      });

      // 3. Actualizar lista local
      dispatch('fetchUserEnrollments');
    },
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
        commit('setEnrolledCourseIds', []);
      }
    },
    async deleteCourse(context, id) {
      const docRef = doc(db, 'courses', id);
      await deleteDoc(docRef);
    },
    async updateCourse(context, { id, updatedCourse }) {
      const docRef = doc(db, 'courses', id);
      await updateDoc(docRef, updatedCourse);
    },
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
    setUser({ commit }, user) {
      commit('setUser', user);
    },
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