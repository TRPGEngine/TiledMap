import { BaseTool } from './BaseTool';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { BRICK } from '../token/names';
import Konva from 'konva';
import { clipToGrid } from '../utils/snapGrid';
import type { Vector2d } from 'konva/types/types';
import { vector2dEqual } from '../utils/vector2d';
import { UrlImage } from '../shape/UrlImage';

export class TiledBrush extends BaseTool {
  static toolName = 'tiledBrush';

  active() {
    const stage = this.mapManager.stage;

    stage.draggable(false);
    stage.on('mousedown touchstart', this._mousedown);
    stage.on('mouseup touchend', this._mouseup);
    stage.on('mousemove touchmove', this._mousemove);
  }

  deactive() {
    const stage = this.mapManager.stage;

    stage.draggable(true);
    stage.off('mousedown touchstart', this._mousedown);
    stage.off('mouseup touchend', this._mouseup);
    stage.off('mousemove touchmove', this._mousemove);
  }

  drawing = false;
  drawedNode = new Set<Konva.Shape>();
  lastDrawPos: Vector2d | null = null; // 上一次绘制的坐标
  _mousedown = () => {
    this.drawing = true;
    this.drawedNode.clear();
    this.lastDrawPos = null;
  };
  _mouseup = () => {
    this.drawing = false;
    this.lastDrawPos = null;
    // TODO: 创建group token 并加入

    const nodes = Array.from(this.drawedNode);
    this.mapManager.getCurrentLayer().brickGroup.addShape(...nodes);
  };
  _mousemove = () => {
    if (this.drawing === false) {
      return;
    }

    const currentLayer = this.mapManager.getCurrentLayer();
    const gridSize = this.mapManager.options.gridSize;
    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }

    const drawPos = {
      x: clipToGrid(pos.x, gridSize),
      y: clipToGrid(pos.y, gridSize),
    };

    if (!_isNil(this.lastDrawPos) && vector2dEqual(drawPos, this.lastDrawPos)) {
      // 如果还在上次的点上
      // 则跳过
      return;
    }

    const node = currentLayer
      .getRenderLayer()
      .getIntersection(pos, `.${BRICK}`);
    if (!_isNil(node) && node instanceof Konva.Shape && node.hasName(BRICK)) {
      // 销毁之前的
      this.drawedNode.delete(node);
      node.destroy();
    }

    const texture = this.getToolConfig('texture');
    if (_isNil(texture)) {
      // 如果没有设置绘制的东西则跳过创建逻辑
      // 此时的行为是会删除
      this.mapManager.getCurrentLayer().draw();
      return;
    }

    const image = new UrlImage(String(texture), {
      x: drawPos.x,
      y: drawPos.y,
      width: gridSize,
      height: gridSize,
    });
    image.addName(BRICK);
    this.mapManager.getCurrentLayer().getRenderLayer().add(image);
    this.drawedNode.add(image);
    this.lastDrawPos = drawPos;
    image.draw();
  };
}
