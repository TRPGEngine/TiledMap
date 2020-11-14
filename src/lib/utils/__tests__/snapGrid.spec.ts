import { snapGrid } from '../snapGrid';

describe('snapGrid', () => {
  const gridSize = 40;

  test.each([
    [NaN, 0],
    [10, 0],
    [30, 40],
    [50, 40],
    [-10, -0],
    [-30, -40],
  ])('%d => %d', (i, o) => {
    expect(snapGrid(i, gridSize)).toBe(o);
  });
});
