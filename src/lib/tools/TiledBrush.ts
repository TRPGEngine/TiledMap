import { BaseTool } from './BaseTool';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { BRICK } from '../token/names';
import Konva from 'konva';
import { clipToGrid } from '../utils/snapGrid';

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
  _mousedown = () => {
    this.drawing = true;
    this.drawedNode.clear();
  };
  _mouseup = () => {
    this.drawing = false;
    // TODO: 创建group token
    console.log(Array.from(this.drawedNode));
  };
  _mousemove = _throttle(() => {
    if (this.drawing === false) {
      return;
    }

    const currentLayer = this.mapManager.getCurrentLayer();
    const pos = this.getPointerPosFromStage();
    if (_isNil(pos)) {
      return;
    }
    const node = currentLayer.getIntersection(pos);
    if (!_isNil(node) && node.hasName(BRICK)) {
      // 销毁
      this.drawedNode.delete(node);
      node.destroy();
    }

    const gridSize = this.mapManager.options.gridSize;
    const rect = new Konva.Rect({
      x: clipToGrid(pos.x, gridSize),
      y: clipToGrid(pos.y, gridSize),
      width: gridSize,
      height: gridSize,
      fill: 'red',
    });
    rect.addName(BRICK);
    currentLayer.add(rect); // TODO: 应该是token
    this.drawedNode.add(rect);
    rect.draw();
  }, 50);
}
