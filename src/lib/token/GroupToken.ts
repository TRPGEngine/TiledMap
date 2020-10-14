import Konva from 'konva';
import type { Group } from 'konva/types/Group';
import type { TiledMapManager } from '../manager';
import { getAttrs } from '../utils/network-helper';
import { BaseToken, TokenOptions } from './BaseToken';
import type { BaseNotifyAttrs } from './types';

/**
 * 用于分组的Token
 */
export class GroupToken extends BaseToken<Konva.Group> {
  constructor(manager: TiledMapManager, options?: TokenOptions) {
    const groupNode = new Konva.Group();
    super(manager, groupNode, options);
  }

  get groupNode(): Konva.Group {
    return this.node;
  }

  addShape(...shapes: Konva.Shape[]) {
    if (shapes.length > 0) {
      this.groupNode.add(...shapes);
    }
    this.groupNode.draw();

    this.manager.notify('update', this.getAttrs());
  }

  getAttrs(): BaseNotifyAttrs {
    return {
      ...super.getAttrs(),
      items: getAttrs(this.groupNode),
    };
  }
}
