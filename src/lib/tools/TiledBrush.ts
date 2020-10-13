import { BaseTool } from './BaseTool';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { BRICK } from '../token/names';
import Konva from 'konva';
import { clipToGrid } from '../utils/snapGrid';
import { ImageToken } from '../token/ImageToken';
import type { Vector2d } from 'konva/types/types';
import { vector2dEqual } from '../utils/vector2d';

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
  drawedNode = new Set<Konva.Node>();
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
    console.log(Array.from(this.drawedNode));
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

    const node = currentLayer.getRenderLayer().getIntersection(pos);
    if (!_isNil(node) && node.hasName(BRICK)) {
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

    const imageObj = new Image();
    const image = new Konva.Image({
      image: imageObj,
      x: drawPos.x,
      y: drawPos.y,
      width: gridSize,
      height: gridSize,
    });
    // 先用base64 一像素图片让其快速渲染占位, 然后再换成正常的图片
    imageObj.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素白色图片
    image.addName(BRICK);
    this.mapManager.getCurrentLayer().getRenderLayer().add(image);
    this.drawedNode.add(image);
    this.lastDrawPos = drawPos;
    image.draw();

    imageObj.src = String(texture);
    imageObj.onload = () => {
      image.draw();
    };
  };
}
