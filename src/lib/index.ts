import Konva from 'konva';
import { TiledMapManager, TiledMapManagerOptions } from './manager';
import { BaseToken } from './token/BaseToken';
import { ImageToken } from './token/ImageToken';

const defaultOptions: TiledMapManagerOptions = {
  width: 500, // 画布宽度
  height: 500, // 画布高度
  gridNum: 20, // 网格数
  gridSize: 40, // 底部网格大小
};

/**
 * 初始化地图
 */
export function initTiledMap(
  el: HTMLDivElement,
  options?: Partial<TiledMapManagerOptions>,
): TiledMapManager {
  const tiledMapManager = new TiledMapManager(el, {
    ...defaultOptions,
    ...options,
  });

  // const rect = new Konva.Rect({
  //   x: 80,
  //   y: 80,
  //   width: 120,
  //   height: 120,
  //   fill: 'red',
  // });
  // const token = new BaseToken(tiledMapManager, rect);

  // const imageToken = ImageToken.createByUrl(
  //   tiledMapManager,
  //   'https://www.makeamap.cn/s/ranking/info/map?map_id=7d6a9282-631b-4156-94ae-ddaee876ac62&hd=1&wm=1',
  //   40,
  //   40,
  // );

  // tiledMapManager.addToken(token);
  // tiledMapManager.addToken(imageToken);
  tiledMapManager.draw();

  return tiledMapManager;
}
