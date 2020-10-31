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
    const tiledMapManager = this.tiledMapManager;

    tiledMapManager.stage.add(layer);
    tiledMapManager.layerNotify('add', layer.getAttrs());
  }

  /**
   * 移除层
   * @param layerId 层ID
   */
  removeLayer(layerId: string) {
    const layer = this.findLayerById(layerId);
    if (!layer) {
      return;
    }

    const tiledMapManager = this.tiledMapManager;

    const attrs = layer.getAttrs();
    layer.remove();
    tiledMapManager.layerNotify('remove', attrs);
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

  /**
   * 查找层ID
   * @param layerId 层ID
   */
  findLayerById(layerId: string): BaseLayer | null {
    return this.getLayers().find((b) => b.layerId === layerId) ?? null;
  }
}
