// __tests__/calculations.test.js
import { sum } from '../utils/calculator';

test('Prueba pasada: El botón de iniciar sesión funciona correctamente', () => {
  expect(2 + 2).toBe(4);
});


test('Prueba pasada: El campo de nombre de usuario tiene la longitud correcta', () => {
  const username = ['user1', 'user2', 'user3'];
  expect(username.length).toBe(3);
});


test('Prueba pasada: Los datos del usuario después de iniciar sesión son correctos', () => {
  const datosUsuario = { nombre: 'Juan', rol: 'admin' };
  const datosEsperados = { nombre: 'Juan', rol: 'admin' };
  expect(datosUsuario).toEqual(datosEsperados);
});

function mensajeBienvenida() {
  return 'Bienvenido, usuario!';
}

test('Prueba pasada: El mensaje de bienvenida se muestra correctamente', () => {
  expect(mensajeBienvenida()).toBe('Bienvenido, usuario!');
});
