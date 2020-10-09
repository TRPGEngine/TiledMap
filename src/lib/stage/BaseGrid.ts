import Konva from 'konva';

/**
 * 创建一个基础网格
 * @param width 画布宽
 * @param height 画布高
 * @param gridSize 网格大小
 */
export function buildBaseGridLayer(
  gridNum: number,
  gridSize: number,
): Konva.Layer {
  const layer = new Konva.Layer();
  const stroke = '#ccc';
  const strokeWidth = 0.5;

  const width = gridNum * gridSize;
  const height = width;

  for (let x = 0; x <= width; x += gridSize) {
    // 绘制横向线
    const line = new Konva.Line({
      points: [x, 0, x, height],
      stroke,
      strokeWidth,
    });

    layer.add(line);
  }

  for (let y = 0; y <= height; y += gridSize) {
    // 绘制纵向线
    const line = new Konva.Line({
      points: [0, y, width, y],
      stroke,
      strokeWidth,
    });

    layer.add(line);
  }

  return layer;
}
