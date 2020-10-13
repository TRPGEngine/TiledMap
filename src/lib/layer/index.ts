import Konva from 'konva';
import type { TiledMapManager } from '../manager';

export class LayerManager {
  defaultLayer = new Konva.Layer({
    name: 'defaultLayer',
  });
  currentLayer = this.defaultLayer;

  constructor(public tiledMapManager: TiledMapManager) {
    tiledMapManager.stage.add(this.defaultLayer);
  }

  /**
   * 增加层
   * @param layer Konva层
   */
  addLayer(layer: Konva.Layer) {
    this.tiledMapManager.stage.add(layer);
  }
}
