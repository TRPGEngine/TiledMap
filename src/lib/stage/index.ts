import Konva from 'konva';
import { buildBaseGridLayer } from './BaseGrid';

/**
 * 构建一个
 */
export function buildTiledMapStage(
  el: HTMLDivElement,
  width: number,
  height: number,
  gridNum: number,
  gridSize: number,
): Konva.Stage {
  const stage = new Konva.Stage({
    container: el,
    width,
    height,
    draggable: true,
  });

  // const maxSize = gridNum * gridSize;
  // stage.position({
  //   x: -maxSize / 2,
  //   y: -maxSize / 2,
  // });

  const baseGridLayer = buildBaseGridLayer(gridNum, gridSize);
  stage.add(baseGridLayer);

  return stage;
}
