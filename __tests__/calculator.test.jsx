// __tests__/calculations.test.js
import { sum } from '../utils/calculator';

test('sum adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
