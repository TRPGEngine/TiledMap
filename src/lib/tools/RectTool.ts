import { BaseTool } from './BaseTool';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseToken } from '../token/BaseToken';
import _isNil from 'lodash/isNil';
import _throttle from 'lodash/throttle';

export class RectTool extends BaseTool {
  static toolName = 'rectTool';

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
  currentRect: Konva.Rect | null = null;
  private _mousedown = (e: KonvaEventObject<any>) => {
    this.isPaint = true;
    const pos = this.getPointerPosFromStage();
    if (pos === null) {
      return;
    }
    this.currentRect = new Konva.Rect({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation: 'source-over',
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });

    this.mapManager.getCurrentLayer().add(this.currentRect);
  };

  private _mouseup = () => {
    this.isPaint = false;

    if (_isNil(this.currentRect)) {
      return;
    }
    const token = new BaseToken(this.mapManager, this.currentRect);
    this.mapManager.addToken(token);
  };

  private _mousemove = _throttle(() => {
    const currentRect = this.currentRect;

    if (!this.isPaint) {
      return;
    }

    if (currentRect === null) {
      return;
    }

    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }

    currentRect.width(pos.x - currentRect.x());
    currentRect.height(pos.y - currentRect.y());
    this.mapManager.getCurrentLayer().batchDraw();
  }, 50);
}
