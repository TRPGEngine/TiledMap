import type { Vector2d } from 'konva/types/types';
import type { TiledMapManager } from '../manager';
import _isNil from 'lodash/isNil';

export abstract class BaseTool {
  constructor(public manager: TiledMapManager) {}

  /**
   * 激活工具
   */
  abstract active(): void;

  /**
   * 取消激活工具
   */
  abstract deactive(): void;

  /**
   * 根据stage的信息计算相对stage的指针位置
   */
  protected getPointerPosFromStage(): Vector2d | null {
    const stage = this.manager.stage;
    const pointerPos = stage.getPointerPosition();
    const stagePos = stage.position();
    if (_isNil(pointerPos) || _isNil(stagePos)) {
      return null;
    }

    return {
      x: pointerPos.x - stagePos.x,
      y: pointerPos.y - stagePos.y,
    };
  }
}
