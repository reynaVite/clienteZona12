describe('Login Screen', () => {
    beforeEach(() => {
        // Asegúrate de que Cypress esté apuntando a la URL correcta
        cy.visit('/loginnn'); // Asume que tu pantalla de login está en '/login'
    });

    it('should successfully log in with valid credentials', () => {
        // Ingresar un correo y contraseña correctos
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('password123');

        // Hacer click en el botón de iniciar sesión
        cy.get('button[type="submit"]').click();

        // Verificar que aparezca el mensaje de éxito (en este caso, una alerta)
        cy.on('window:alert', (txt) => {
            expect(txt).to.contains('Login successful');
        });
    });

    it('should show an error message with invalid credentials', () => {
        // Ingresar un correo y contraseña incorrectos
        cy.get('input[type="email"]').type('wrong@example.com');
        cy.get('input[type="password"]').type('wrongpassword');

        // Hacer click en el botón de iniciar sesión
        cy.get('button[type="submit"]').click();

        // Verificar que aparezca un mensaje de error
        cy.get('p').should('contain', 'Invalid credentials');
    });
});
