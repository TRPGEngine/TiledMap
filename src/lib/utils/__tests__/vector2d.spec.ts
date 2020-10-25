import { vector2dEqual, buildVector2d, vector2dDistance } from '../vector2d';

describe('vector2d', () => {
  test('buildVector2d', () => {
    expect(buildVector2d(1, 2)).toMatchObject({ x: 1, y: 2 });
  });

  describe('vector2dEqual', () => {
    test.each([
      [buildVector2d(1, 1), buildVector2d(1, 1), true],
      [buildVector2d(1, 1), buildVector2d(2, 1), false],
      [buildVector2d(1, 1), buildVector2d(1, 2), false],
    ])('%o,%o => %d', (a, b, r) => {
      expect(vector2dEqual(a, b)).toBe(r);
    });
  });

  describe('vector2dDistance', () => {
    test.each([
      [buildVector2d(0, 0), buildVector2d(0, 1), 1],
      [buildVector2d(0, 0), buildVector2d(1, 0), 1],
      [buildVector2d(0, 0), buildVector2d(3, 4), 5],

      [buildVector2d(0, 1), buildVector2d(0, 0), 1],
      [buildVector2d(1, 0), buildVector2d(0, 0), 1],
      [buildVector2d(3, 4), buildVector2d(0, 0), 5],
    ])('%o,%o => %d', (a, b, r) => {
      expect(vector2dDistance(a, b)).toBe(r);
    });
  });
});
