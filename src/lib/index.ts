import Konva from 'konva';
import { TiledMapManager } from './manager';
import { buildTiledMapStage } from './stage';
import { BaseToken } from './token/BaseToken';

const defaultOptions = {
  gridNum: 20, // 网格数
  gridSize: 40, // 底部网格大小
};

/**
 * 初始化地图
 */
export function initTiledMap(el: HTMLDivElement, options = defaultOptions) {
  const tiledMapManager = new TiledMapManager(el, options);

  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
  });

  const token = new BaseToken(tiledMapManager, rect);

  tiledMapManager.addToken(token);
  tiledMapManager.draw();
}
