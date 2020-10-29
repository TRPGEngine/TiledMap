import { BaseTool } from './BaseTool';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseToken } from '../token/BaseToken';
import _isNil from 'lodash/isNil';
import _throttle from 'lodash/throttle';
import { vector2dDistance } from '../utils/vector2d';

export class CircleTool extends BaseTool {
  static toolName = 'circleTool';

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
  currentCircle: Konva.Circle | null = null;
  private _mousedown = (e: KonvaEventObject<any>) => {
    this.isPaint = true;
    const pos = this.getPointerPosFromStage();
    if (pos === null) {
      return;
    }
    this.currentCircle = new Konva.Circle({
      stroke: '#df4b26',
      strokeWidth: 5,
      globalCompositeOperation: 'source-over',
      x: pos.x,
      y: pos.y,
      radius: 1,
    });

    this.mapManager.getCurrentLayer().add(this.currentCircle);
  };

  private _mouseup = () => {
    this.isPaint = false;

    if (_isNil(this.currentCircle)) {
      return;
    }
    const token = new BaseToken(this.mapManager, this.currentCircle);
    this.mapManager.addToken(token);
  };

  private _mousemove = _throttle(() => {
    const currentCircle = this.currentCircle;

    if (!this.isPaint) {
      return;
    }

    if (currentCircle === null) {
      return;
    }

    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }

    const radius = vector2dDistance(pos, currentCircle.position());

    currentCircle.radius(radius);
    this.mapManager.getCurrentLayer().batchDraw();
  }, 50);
}
