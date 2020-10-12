/**
 * 输入一个数
 * 返回这个数靠近网格单位大小的值
 */
export function snapGrid(num: number, gridSize: number): number {
  return Math.round(num / gridSize) * gridSize;
}

/**
 * 修建到网格
 */
export function clipToGrid(num: number, gridSize: number): number {
  return Math.floor(num / gridSize) * gridSize;
}
