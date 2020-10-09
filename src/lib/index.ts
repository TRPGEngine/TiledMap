import Konva from 'konva';
import { buildTiledMapStage } from './stage';
import { buildGridSnapBound } from './utils/buildGridSnapBound';

const defaultOptions = {
  gridNum: 20, // 网格数
  gridSize: 40, // 底部网格大小
};

/**
 * 初始化地图
 */
export function initTiledMap(el: HTMLDivElement, options = defaultOptions) {
  const { gridNum, gridSize } = options;
  const stage = buildTiledMapStage(el, gridNum, gridSize);

  const layer = new Konva.Layer();
  const circle = new Konva.Rect({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true,
    dragBoundFunc: buildGridSnapBound(gridSize),
  });

  circle.on('dragend', (e) => {
    const currentPos = e.currentTarget.position();
    console.log(currentPos);
  });

  layer.add(circle);
  stage.add(layer);

  layer.draw();
}
