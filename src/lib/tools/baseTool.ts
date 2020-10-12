import type { TiledMapManager } from '../manager';

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
}
