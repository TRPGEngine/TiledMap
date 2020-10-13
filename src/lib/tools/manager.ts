import type { TiledMapManager } from '../manager';
import type { BaseTool } from './BaseTool';
import { FreeBrush } from './FreeBrush';
import { TiledBrush } from './TiledBrush';
import _isNil from 'lodash/isNil';

export interface ToolConfig {
  [key: string]: string | number;
}

export class ToolManager {
  currentToolName = '';
  currentToolConfig: ToolConfig = {};

  private tools: {
    [name: string]: BaseTool;
  } = {};

  constructor(public tiledMapManager: TiledMapManager) {
    this.initTools();
  }

  initTools() {
    this.tools[FreeBrush.toolName] = new FreeBrush(this);
    this.tools[TiledBrush.toolName] = new TiledBrush(this);
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
      this.currentToolConfig = {}; // 配置项置空
      tool.active();
      return true;
    } else {
      return false;
    }
  }

  /**
   * 设置当前工具的配置项
   * @param config 配置项
   */
  setToolConfig(config: ToolConfig): void {
    this.currentToolConfig = config;
  }
}
