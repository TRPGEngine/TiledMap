import { BaseTool } from './BaseTool';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseToken } from '../token/BaseToken';
import _isNil from 'lodash/isNil';
import _throttle from 'lodash/throttle';

export class LineTool extends BaseTool {
  static toolName = 'lineTool';

  active(): void {
    const stage = this.mapManager.stage;

    this.setStageDraggable(false);

    stage.on('mousedown touchstart', this._mousedown);
    stage.on('mouseup touchend', this._mouseup);
    stage.on('mousemove touchmove', this._mousemove);
  }

  deactive(): void {
    const stage = this.mapManager.stage;

    this.setStageDraggable(true);
    stage.off('mousedown touchstart', this._mousedown);
    stage.off('mouseup touchend', this._mouseup);
    stage.off('mousemove touchmove', this._mousemove);
  }

  isPaint = false;
  currentLine: Konva.Line | null = null;
  private _mousedown = (e: KonvaEventObject<any>) => {
    this.isPaint = true;
    const pos = this.getPointerPosFromStage();
    if (pos === null) {
      return;
    }
    this.currentLine = new Konva.Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y],
    });

    this.mapManager.getCurrentLayer().add(this.currentLine);
  };

  private _mouseup = () => {
    this.isPaint = false;

    if (_isNil(this.currentLine)) {
      return;
    }
    const token = new BaseToken(this.mapManager, this.currentLine);
    this.mapManager.addToken(token);
  };

  private _mousemove = _throttle(() => {
    const currentLine = this.currentLine;

    if (!this.isPaint) {
      return;
    }

    if (currentLine === null) {
      return;
    }

    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }

    const newPoints = currentLine.points();
    newPoints[2] = pos.x;
    newPoints[3] = pos.y;
    currentLine.points(newPoints);
    this.mapManager.getCurrentLayer().batchDraw();
  }, 50);
}
