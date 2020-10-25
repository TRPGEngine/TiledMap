import { BaseTool } from './BaseTool';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseToken } from '../token/BaseToken';
import _isNil from 'lodash/isNil';
import _throttle from 'lodash/throttle';

export class PolygonTool extends BaseTool {
  static toolName = 'polygonTool';

  active(): void {
    const stage = this.mapManager.stage;

    this.setStageDraggable(false);

    stage.on('mousedown touchstart', this._mousedown);
    stage.on('mousemove touchmove', this._mousemove);
    stage.on('contextmenu', this._contextmenu); // 注意: 这里会导致移动版操作有问题
  }

  deactive(): void {
    const stage = this.mapManager.stage;

    this.setStageDraggable(true);
    stage.off('mousedown touchstart', this._mousedown);
    stage.off('mousemove touchmove', this._mousemove);
    stage.off('contextmenu', this._contextmenu);
  }

  currentLine: Konva.Line | null = null;
  private _mousedown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (_isNil(this.currentLine)) {
      // 开始绘制
      const pos = this.getPointerPosFromStage();
      if (pos === null) {
        return;
      }
      this.currentLine = new Konva.Line({
        stroke: '#df4b26',
        strokeWidth: 5,
        globalCompositeOperation: 'source-over',
        points: [pos.x, pos.y, pos.x, pos.y],
      });

      this.mapManager.getCurrentLayer().getRenderLayer().add(this.currentLine);
    } else {
      // 正在绘制
      const pos = this.getPointerPosFromStage();
      if (pos === null) {
        return;
      }

      const oldPoints = this.currentLine.points();
      const length = oldPoints.length;
      const newPoints = [...oldPoints];
      newPoints[length - 2] = pos.x;
      newPoints[length - 1] = pos.y;
      newPoints.push(pos.x, pos.y);

      this.currentLine.points(newPoints);
    }
  };

  private _mousemove = _throttle(() => {
    const currentLine = this.currentLine;

    if (currentLine === null) {
      return;
    }

    const pos = this.getPointerPosFromStage();
    if (pos === null) {
      return;
    }

    const oldPoints = currentLine.points();
    const length = oldPoints.length;
    const newPoints = [...oldPoints];
    newPoints[length - 2] = pos.x;
    newPoints[length - 1] = pos.y;

    currentLine.points(newPoints);
    this.mapManager.getCurrentLayer().getRenderLayer().batchDraw();
  }, 50);

  private _contextmenu = (e: KonvaEventObject<MouseEvent>) => {
    // 闭合多边形 取消操作
    e.evt.preventDefault();

    if (_isNil(this.currentLine) || this.currentLine.points().length < 6) {
      // 小于三段不可闭合
      return;
    }

    this.currentLine.closed(true);
    const token = new BaseToken(this.mapManager, this.currentLine);
    this.mapManager.addToken(token);

    this.currentLine.draw();
    this.currentLine = null;
  };
}
