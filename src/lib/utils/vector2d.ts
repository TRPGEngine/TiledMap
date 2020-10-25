import type { Vector2d } from 'konva/types/types';

/**
 * 计算相等
 */
export function vector2dEqual(a: Vector2d, b: Vector2d) {
  return a.x === b.x && a.y === b.y;
}

/**
 * 计算坐标间距
 */
export function vector2dDistance(a: Vector2d, b: Vector2d): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
