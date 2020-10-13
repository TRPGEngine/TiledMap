import type { TiledMapManager } from '../manager';
import type { BaseTool } from './baseTool';
import { FreeBrush } from './freeBrush';
import { TiledBrush } from './tiledBrush';
import _isNil from 'lodash/isNil';

export class ToolManager {
  currentToolName = '';
  tools: {
    [name: string]: BaseTool;
  } = {};

  constructor(public tiledMapManager: TiledMapManager) {
    this.initTools();
  }

  initTools() {
    this.tools[FreeBrush.toolName] = new FreeBrush(this.tiledMapManager);
    this.tools[TiledBrush.toolName] = new TiledBrush(this.tiledMapManager);
  }

  /**
   * 切换工具
   * @param toolName 工具名
   */
  switchTool(toolName: string): boolean {
    // 取消上一个工具
    const prevTool = this.tools[this.currentToolName];
    if (!_isNil(prevTool)) {
      prevTool.deactive();
    }

    if (toolName === this.currentToolName) {
      // 取消选择
      this.currentToolName = '';
      return true;
    }

    // 切换到当前工具
    const tool = this.tools[toolName];
    if (!_isNil(tool)) {
      this.currentToolName = toolName;
      tool.active();
      return true;
    } else {
      return false;
    }
  }
}
