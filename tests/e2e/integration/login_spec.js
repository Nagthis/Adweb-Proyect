/// <reference types="cypress" />

/**
 * Prueba end‑to‑end para el flujo de inicio de sesión. Verifica que la
 * aplicación permita ingresar con un correo y contraseña válidos,
 * redirigiendo al usuario a la página principal y mostrando su
 * dirección de correo en la barra de navegación. Para que esta prueba
 * funcione correctamente debe existir un usuario de prueba en
 * Firebase Authentication con las credenciales suministradas en el
 * archivo public/mifirebaseapp.txt.
 */
describe('Flujo de inicio de sesión', () => {
  it('permite iniciar sesión con un usuario registrado', () => {
    // Reemplazar por las credenciales de prueba definidas en public/mifirebaseapp.txt
    const email = Cypress.env('TEST_EMAIL') || 'alumno@example.com';
    const password = Cypress.env('TEST_PASSWORD') || '123456';

    // Visitar la página de login
    cy.visit('/login');

    // Completar el formulario
    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.contains('Acceder').click();

    // Esperar a que redirija a la página principal
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Verificar que la barra de navegación contenga el correo del usuario
    cy.get('nav').contains(email);
  });
});