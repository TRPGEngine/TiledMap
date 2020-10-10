import type Konva from 'konva';
import type { TiledMapManager } from '../manager';
import shortid from 'shortid';
import { buildGridSnapBound } from '../utils/buildGridSnapBound';
import { TRANSFORMABLE } from './names';
import { fixNumber } from '../utils/fixNumber';

interface TokenOptions {
  id: string;
  snapGrid: boolean; //是否贴合到网格
}

export class BaseToken {
  id: string;

  constructor(
    public manager: TiledMapManager,
    public node: Konva.Shape,
    options?: TokenOptions,
  ) {
    const { id, snapGrid = true } = options ?? {};

    if (typeof id !== 'string') {
      this.id = shortid();
    } else {
      this.id = id;
    }

    this.node.draggable(true);
    if (snapGrid === true) {
      // 贴合到网格
      this.node.dragBoundFunc(buildGridSnapBound(manager.options.gridSize));
    }

    this.node.addName(TRANSFORMABLE);

    manager.notify('add', this.getAttrs());
    this.initEvent();
  }

  initEvent() {
    let startPos: Konva.Vector2d | null = null;
    this.node.on('dragstart', (e) => {
      startPos = e.currentTarget.position();
    });
    this.node.on('dragend', (e) => {
      const endPos = e.currentTarget.position();
      if (
        startPos !== null &&
        startPos.x === endPos.x &&
        startPos.y === endPos.y
      ) {
        // 如果没有变化则直接抛出
        return;
      }
      this.manager.notify('update', this.getAttrs());
    });

    this.node.on('transformend', (e) => {
      this.manager.notify('update', this.getAttrs());
    });
  }

  /**
   * 获取Token传输的信息
   */
  getAttrs() {
    const id = this.id;
    const pos = this.node.position();
    const size = this.node.size();
    const scale = this.node.scale();
    const rotation = this.node.rotation();

    return {
      id,
      x: fixNumber(pos.x),
      y: fixNumber(pos.y),
      width: fixNumber(size.width),
      height: fixNumber(size.height),
      scaleX: fixNumber(scale.x),
      scaleY: fixNumber(scale.y),
      rotation,
    };
  }
}
