import type { Vector2d } from 'konva/types/types';

/**
 * 计算相等
 */
export function vector2dEqual(a: Vector2d, b: Vector2d) {
  return a.x === b.x && a.y === b.y;
}
