import type { Vector2d } from 'konva/types/types';
import _isNil from 'lodash/isNil';
import type { ToolManager, ToolConfig } from './manager';
import { DRAGGABLE } from '../token/names';

export abstract class BaseTool {
  static toolName: string;

  constructor(public toolManager: ToolManager) {}

  /**
   * 激活工具
   */
  abstract active(): void;

  /**
   * 取消激活工具
   */
  abstract deactive(): void;

  get mapManager() {
    return this.toolManager.tiledMapManager;
  }

  getToolConfig(key: string): ToolConfig[string] | undefined {
    return this.toolManager.currentToolConfig[key];
  }

  /**
   * 根据stage的信息计算相对stage的指针位置
   */
  protected getPointerPosFromStage(): Vector2d | null {
    const stage = this.mapManager.stage;
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

  /**
   * 设置场景内容是否可拖动
   * @param draggable 是否可拖动
   */
  protected setStageDraggable(shouldDraggable: boolean) {
    this.mapManager.setStageDraggable(shouldDraggable);
  }
}
