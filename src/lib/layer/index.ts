import type Konva from 'konva';
import type { TiledMapManager } from '../manager';
import { BaseLayer } from './BaseLayer';

export class LayerManager {
  defaultLayer = new BaseLayer(this, {
    layerName: 'defaultLayer',
  });
  currentLayer = this.defaultLayer;

  constructor(public tiledMapManager: TiledMapManager) {
    this.addLayer(this.defaultLayer);
  }

  /**
   * 添加层
   * @param layer 层
   */
  addLayer(layer: BaseLayer) {
    this.tiledMapManager.stage.add(layer);
  }

  /**
   * 获取所有的层
   */
  getLayers(): BaseLayer[] {
    const renderLayers = this.tiledMapManager.stage
      .getLayers()
      .toArray() as Konva.Layer[];

    return renderLayers.filter(
      (layer) => layer instanceof BaseLayer,
    ) as BaseLayer[];
  }
}
