import Konva from 'konva';
import type { LayerConfig } from 'konva/types/Layer';
import type { LayerManager } from '.';
import type { BaseToken } from '../token/BaseToken';
import { BrickLayerToken } from '../token/BrickLayerToken';

interface LayerOptions extends LayerConfig {}

export class BaseLayer {
  private render: Konva.Layer;
  brickGroup: BrickLayerToken; // 每层都有一个底部砖块组 该组不能被移动 只能被砖块工具编辑

  constructor(manager: LayerManager, options?: LayerOptions) {
    this.render = new Konva.Layer(options);
    this.brickGroup = new BrickLayerToken(manager.tiledMapManager);

    this.render.add(this.brickGroup.groupNode);
  }

  addToken(token: BaseToken) {
    this.render.add(token.node);
  }

  draw() {
    this.getRenderLayer().draw();
  }

  getRenderLayer(): Konva.Layer {
    return this.render;
  }
}
