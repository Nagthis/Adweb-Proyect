/// <reference types="cypress" />

/**
 * Prueba end‑to‑end que valida la eliminación de un curso. La prueba
 * ingresa con un usuario autenticado, navega a la sección de
 * administración, elimina el primer curso de la tabla y verifica que
 * éste ya no exista en la lista. Para que la prueba sea repetible,
 * recomendamos agregar un curso de prueba y luego eliminarlo durante
 * la ejecución.
 */
describe('Eliminar curso', () => {
  before(() => {
    // Credenciales de usuario con permisos para eliminar cursos
    const email = Cypress.env('TEST_EMAIL') || 'alumno@example.com';
    const password = Cypress.env('TEST_PASSWORD') || '123456';
    cy.visit('/login');
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.contains('Acceder').click();
  });

  it('puede eliminar un curso existente', () => {
    cy.visit('/admin');
    // Tomar el primer curso de la tabla
    cy.get('tbody tr').first().as('primerCurso');
    cy.get('@primerCurso').find('td').eq(1).invoke('text').as('nombreCurso');
    // Hacer clic en el botón eliminar
    cy.get('@primerCurso').find('button').contains('Eliminar').click();
    // Confirmar la eliminación
    cy.get('.modal').within(() => {
      cy.contains('Sí, borrar').click();
    });
    // Verificar que el curso ya no se encuentre en la tabla
    cy.get('@nombreCurso').then((nombre) => {
      cy.get('tbody').should('not.contain', nombre.trim());
    });
  });
});