const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Aquí defines las opciones para las pruebas e2e
    setupNodeEvents(on, config) {
      // Implementa eventos Node si es necesario
    },
    baseUrl: 'http://localhost:5173', // Cambia esto por la URL de tu aplicación si es necesario
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Patrón para encontrar los archivos de pruebas E2E
  },
});
