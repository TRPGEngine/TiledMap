/**
 * 保留两位小数。简化传输数据
 */
export function fixNumber(input: number): number {
  return Number(Number(input).toFixed(2));
}
