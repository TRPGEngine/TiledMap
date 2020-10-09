import type Konva from 'konva';
import type { TiledMapManager } from '../manager';
import shortid from 'shortid';
import { buildGridSnapBound } from '../utils/buildGridSnapBound';

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
  }

  getAttrs() {
    const pos = this.node.position();
    const id = this.id;

    return {
      id,
      x: pos.x,
      y: pos.y,
    };
  }
}
