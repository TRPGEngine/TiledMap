import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseTool } from './baseTool';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { FreeToken } from '../token/FreeToken';

export class FreeBrush extends BaseTool {
  static toolName = 'freeBrush';

  active() {
    const stage = this.manager.stage;

    stage.draggable(false);
    stage.on('mousedown touchstart', this._mousedown);
    stage.on('mouseup touchend', this._mouseup);
    stage.on('mousemove touchmove', this._mousemove);
  }

  deactive() {
    const stage = this.manager.stage;

    stage.draggable(true);
    stage.off('mousedown touchstart', this._mousedown);
    stage.off('mouseup touchend', this._mouseup);
    stage.off('mousemove touchmove', this._mousemove);
  }

  isPaint = false;
  lastLine: Konva.Line | null = null;
  private _mousedown = (e: KonvaEventObject<any>) => {
    const stage = this.manager.stage;

    this.isPaint = true;
    const pos = this.getPointerPosFromStage();
    if (pos === null) {
      return;
    }
    this.lastLine = new Konva.Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y],
    });

    this.manager.currentLayer.add(this.lastLine);
  };

  private _mouseup = () => {
    this.isPaint = false;

    if (_isNil(this.lastLine)) {
      return;
    }
    const token = new FreeToken(this.manager, this.lastLine);
    this.manager.addToken(token);
  };

  private _mousemove = _throttle(() => {
    const lastLine = this.lastLine;

    if (!this.isPaint) {
      return;
    }

    if (lastLine === null) {
      return;
    }

    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }

    const newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    // this.manager.currentLayer.batchDraw();
    lastLine.draw();
  }, 50);
}
