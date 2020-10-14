import Konva from 'konva';
import type { TiledMapManager } from '../manager';
import { BaseLayer } from './BaseLayer';

export class LayerManager {
  defaultLayer = new BaseLayer(this, {
    name: 'defaultLayer',
  });
  currentLayer = this.defaultLayer;

  constructor(public tiledMapManager: TiledMapManager) {
    tiledMapManager.addLayer(this.defaultLayer);
  }
}
