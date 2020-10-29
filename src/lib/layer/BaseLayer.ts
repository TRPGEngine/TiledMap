import Konva from 'konva';
import type { Group } from 'konva/types/Group';
import type { LayerConfig } from 'konva/types/Layer';
import type { Shape } from 'konva/types/Shape';
import shortid from 'shortid';
import type { LayerManager } from '.';
import type { BaseToken } from '../token/BaseToken';
import { BrickLayerToken } from '../token/BrickLayerToken';

interface LayerOptions extends LayerConfig {
  layerName: string;
}

type LayerChildren = Group | Shape;

export class BaseLayer extends Konva.Layer {
  brickGroup: BrickLayerToken; // 每层都有一个底部砖块组 该组不能被移动 只能被砖块工具编辑
  layerId = shortid();
  layerName: string = 'Layer';

  constructor(manager: LayerManager, options?: LayerOptions) {
    super(options);

    if (typeof options?.layerName === 'string') {
      this.layerName = options.layerName;
    }
    this.brickGroup = new BrickLayerToken(manager.tiledMapManager);

    this.add(this.brickGroup.groupNode);
  }

  addToken(token: BaseToken) {
    this.add(token.node);

    this.draw();
  }

  add(...children: LayerChildren[]): this {
    console.log('add children');
    super.add(...children);

    return this;
  }
}
