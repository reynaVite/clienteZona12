describe('Login Page', () => {
  it('should load the login page', () => {
    cy.visit('https://cliente-zona12.vercel.app/'); // Cambiar a la URL correcta de la página de login

    // Verifica que los elementos del formulario de login existan
    cy.contains('Ingresa a tu cuenta').should('be.visible');
    cy.get('input[name="curp"]').should('be.visible');
    cy.get('input[name="contrasena"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show error message on invalid login', () => {
    cy.visit('https://cliente-zona12.vercel.app/');

    // Llenar los campos de inicio de sesión con datos incorrectos
    cy.get('input[name="curp"]').type('INVALIDCURP12345678');
    cy.get('input[name="contrasena"]').type('wrongpassword');

    // Simula hacer clic en el botón de envío
    cy.get('button[type="submit"]').click();

    // Verifica que se muestra un mensaje de error
    cy.contains('Credenciales incorrectas').should('be.visible');
  });

  it('should log in successfully with valid credentials', () => {
    cy.visit('https://cliente-zona12.vercel.app/');

    // Llenar los campos de inicio de sesión con datos válidos
    cy.get('input[name="curp"]').type('VALIDCURP12345678'); // Cambia por una CURP válida
    cy.get('input[name="contrasena"]').type('validpassword'); // Cambia por una contraseña válida

    // Simula hacer clic en el botón de envío
    cy.get('button[type="submit"]').click();

    // Verifica que la URL cambia a la página de inicio (o la página esperada)
    cy.url().should('include', '/Inicio');
  });

  it('should block user after 3 failed login attempts', () => {
    cy.visit('https://cliente-zona12.vercel.app/');

    // Realizar 3 intentos fallidos
    for (let i = 0; i < 3; i++) {
      cy.get('input[name="curp"]').clear().type('INVALIDCURP12345678');
      cy.get('input[name="contrasena"]').clear().type('wrongpassword');
      cy.get('button[type="submit"]').click();
    }

    // Verificar que la cuenta ha sido bloqueada
    cy.contains('Su cuenta ha sido bloqueada').should('be.visible');
  });
});
