import Konva from 'konva';
import type { TiledMapManager } from '../manager';
import shortid from 'shortid';
import { buildGridSnapBound } from '../utils/buildGridSnapBound';
import { DRAGGABLE, SNAPGRIDTOKEN, TRANSFORMABLE } from './names';
import { fixNumber } from '../utils/fixNumber';
import type { BaseNotifyAttrs, TokenConfig } from './types';
import _isNil from 'lodash/isNil';
import { snapGrid } from '../utils/snapGrid';
import type { IRect } from 'konva/types/types';

export interface TokenOptions {
  id?: string;
  width?: number;
  height?: number;
  transformable?: boolean;
  draggable?: boolean;
}

declare module 'konva/types/Shape' {
  interface Shape {
    token?: BaseToken<Konva.Shape>;
  }
}

/**
 * Token 是一个包装后用于网络传输数据的最小节点
 */

export class BaseToken<T extends Konva.Node = Konva.Shape> {
  id: string;
  config: TokenConfig = {
    visible: 'all',
  };
  renderNodeGroup = new Konva.Group();

  constructor(
    public manager: TiledMapManager,
    protected node: T,
    options?: TokenOptions,
  ) {
    const gridSize = manager.options.gridSize;
    const {
      id,
      width = gridSize,
      height = gridSize,
      transformable = true,
      draggable = true,
    } = options ?? {};

    if (typeof id !== 'string') {
      this.id = shortid();
    } else {
      this.id = id;
    }

    if (this.node instanceof Konva.Shape) {
      this.node.token = this as any;
    }

    if (_isNil(this.node.width())) {
      this.node.width(width);
    }
    if (_isNil(this.node.height())) {
      this.node.height(height);
    }

    if (draggable === true) {
      this.node.addName(DRAGGABLE);
    }
    if (this.snapGrid === true) {
      // 贴合到网格
      this.node.dragBoundFunc(buildGridSnapBound(gridSize));
      this.node.addName(SNAPGRIDTOKEN); // 贴合网格的Token
    }

    if (transformable === true) {
      // 可变换
      this.node.addName(TRANSFORMABLE);
    }

    this.renderNodeGroup.add(this.node as any);

    this.initEvent();
  }

  get snapGrid() {
    return true;
  }

  initEvent() {
    // 初始化事件时先通知服务器该Token被添加
    this.manager.tokenNotify('add', this.getAttrs());

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
      this.manager.tokenNotify('update', this.getAttrs());
    });

    this.node.on('transformend', (e) => {
      this.manager.tokenNotify('update', this.getAttrs());
    });

    this.node.on('mouseenter', (e) => {
      if (this.node.draggable()) {
        this.manager.setCursor('move');
      }
    });
    this.node.on('mouseleave', (e) => {
      if (this.node.draggable()) {
        this.manager.setCursor('default');
      }
    });
  }

  /**
   * 移除节点
   */
  remove() {
    this.renderNodeGroup.remove();
    this.manager.tokenNotify('remove', this.getAttrs());
  }

  /**
   * 获取Token传输的信息
   */
  getAttrs(): BaseNotifyAttrs {
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
      node: this.node.getAttrs(),
      config: this.config,
    };
  }

  /**
   * 移动Token位置 使其贴合到网格
   */
  fitToGrid(): void {
    const gridSize = this.manager.options.gridSize;

    const { x, y } = this.node.getPosition();
    this.node.setPosition({
      x: snapGrid(x, gridSize),
      y: snapGrid(y, gridSize),
    });
  }

  /**
   * 获取节点实际渲染的矩形
   */
  getNodeDisplayRect(): IRect {
    const { x, y } = this.node.getPosition();
    const { width, height } = this.node.getSize();
    const { x: scaleX, y: scaleY } = this.node.getAbsoluteScale();

    return { x, y, width: width * scaleX, height: height * scaleY };
  }

  /**
   * 绘制函数
   */
  draw() {
    this.node.draw();
  }

  /**
   * 向上移动一级
   */
  moveUp = this.node.moveUp;
  /**
   * 移动到顶层
   */
  moveToTop = this.node.moveToTop;
  /**
   * 向下移动一级
   */
  moveDown = this.node.moveDown;
  /**
   * 移动到底部
   */
  moveToBottom = this.node.moveToBottom;
}
