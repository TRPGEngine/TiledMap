import Konva from 'konva';
import type { Group } from 'konva/types/Group';
import { Layer, LayerConfig } from 'konva/types/Layer';
import type { Shape } from 'konva/types/Shape';
import type { LayerManager } from '.';
import type { BaseToken } from '../token/BaseToken';
import { BrickLayerToken } from '../token/BrickLayerToken';

interface LayerOptions extends LayerConfig {}

type LayerChildren = Group | Shape;

export class BaseLayer extends Layer {
  brickGroup: BrickLayerToken; // 每层都有一个底部砖块组 该组不能被移动 只能被砖块工具编辑

  constructor(manager: LayerManager, options?: LayerOptions) {
    super();
    this.brickGroup = new BrickLayerToken(manager.tiledMapManager);

    this.add(this.brickGroup.groupNode);
  }

  addToken(token: BaseToken) {
    this.add(token.node);

    this.clear();
  }

  add(...children: LayerChildren[]): this {
    console.log('add children');
    super.add(...children);

    return this;
  }
}
