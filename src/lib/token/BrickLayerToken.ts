import type { TiledMapManager } from '../manager';
import type { TokenOptions } from './BaseToken';
import { GroupToken } from './GroupToken';

export class BrickLayerToken extends GroupToken {
  constructor(manager: TiledMapManager, options?: TokenOptions) {
    super(manager, { ...options, transformable: false });
  }

  initEvent() {
    // 重写。无操作事件
  }
}
