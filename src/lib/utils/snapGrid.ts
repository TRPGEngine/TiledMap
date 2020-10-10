/**
 * 输入一个数
 * 返回这个数靠近网格单位大小的值
 */
export function snapGrid(num: number, gridSize: number): number {
  return Math.round(num / gridSize) * gridSize;
}
