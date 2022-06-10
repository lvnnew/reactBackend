import 'jest-extended';
import summator from './summator';

// yarn jest --testPathPattern summator

describe('summator', () => {
  it('Суммирует положительные числа', () => {
    expect(summator(4, 5)).toBe(9);
  });

  it('Суммирует отрицительное число с положительным', () => {
    expect(summator(-4, 5)).toBe(1);
  });
});
