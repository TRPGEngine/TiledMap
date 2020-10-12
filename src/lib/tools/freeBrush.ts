import Konva from 'konva';
import type { KonvaEventObject } from 'konva/types/Node';
import { BaseTool } from './baseTool';

export class FreeBrush extends BaseTool {
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
  _mousedown = (e: KonvaEventObject<any>) => {
    const stage = this.manager.stage;
    const gridSize = this.manager.options.gridSize;

    this.isPaint = true;
    const pos = stage.getPointerPosition();
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

  _mouseup = () => {
    this.isPaint = false;
  };

  _mousemove = () => {
    const stage = this.manager.stage;
    const lastLine = this.lastLine;

    if (!this.isPaint) {
      return;
    }

    if (lastLine === null) {
      return;
    }

    const pos = stage.getPointerPosition();
    if (pos === null) {
      return;
    }
    var newPoints = lastLine.points().concat([pos.x, pos.y]);
    lastLine.points(newPoints);
    // this.manager.currentLayer.batchDraw();
    lastLine.draw();
  };
}
