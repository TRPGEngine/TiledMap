import type { Vector2d } from 'konva/types/types';

export function buildVector2d(x: number, y: number): Vector2d {
  return { x, y };
}

/**
 * 计算相等
 */
export function vector2dEqual(a: Vector2d, b: Vector2d): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * 计算坐标间距
 */
export function vector2dDistance(a: Vector2d, b: Vector2d): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
