import type { BaseNotifyAttrs } from './token/types';
import Konva from 'konva';
import type { BaseToken } from './token/BaseToken';
import { buildTiledMapStage } from './stage';

type NotifyType = 'add' | 'update' | 'remove';

interface TiledMapManagerOptions {
  gridNum: number; // 网格数
  gridSize: number; // 底部网格大小
}

export class TiledMapManager {
  stage: Konva.Stage;
  defaultLayer = new Konva.Layer();

  constructor(el: HTMLDivElement, public options: TiledMapManagerOptions) {
    const { gridNum, gridSize } = options;
    const stage = buildTiledMapStage(el, gridNum, gridSize);
    stage.add(this.defaultLayer);

    this.stage = stage;
  }

  addToken(token: BaseToken) {
    this.defaultLayer.add(token.node);
  }

  notify(type: NotifyType, attrs: BaseNotifyAttrs) {
    console.log(type, attrs);
  }

  draw() {
    this.defaultLayer.draw();
  }
}
