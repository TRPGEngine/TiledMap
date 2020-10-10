import type { BaseNotifyAttrs } from './token/types';
import Konva from 'konva';
import type { BaseToken } from './token/BaseToken';
import { buildTiledMapStage } from './stage';
import { TRANSFORMABLE } from './token/names';
import { buildGridSnapBoundBox } from './utils/buildGridSnapBound';

type NotifyType = 'add' | 'update' | 'remove';

interface TiledMapManagerOptions {
  gridNum: number; // 网格数
  gridSize: number; // 底部网格大小
}

export class TiledMapManager {
  stage: Konva.Stage;
  defaultLayer = new Konva.Layer();
  tr: Konva.Transformer;

  constructor(el: HTMLDivElement, public options: TiledMapManagerOptions) {
    const { gridNum, gridSize } = options;
    const stage = buildTiledMapStage(el, gridNum, gridSize);
    stage.add(this.defaultLayer);

    // 选择相关
    this.tr = new Konva.Transformer({
      enabledAnchors: ['middle-right', 'bottom-center', 'bottom-right'],
      rotationSnapTolerance: 5,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      boundBoxFunc: buildGridSnapBoundBox(gridSize),
    });
    this.defaultLayer.add(this.tr);

    this.stage = stage;
    this.initStageEvent();
  }

  initStageEvent() {
    const stage = this.stage;
    const tr = this.tr;
    const layer = this.defaultLayer;

    // clicks should select/deselect shapes
    stage.on('click tap', function (e) {
      // if click on empty area - remove all selections
      if (e.target === stage) {
        tr.nodes([]);
        layer.draw();
        return;
      }

      if (!e.target.hasName(TRANSFORMABLE)) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        tr.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target]);
        tr.nodes(nodes);
      }
      layer.draw();
    });
  }

  addToken(token: BaseToken) {
    const node = token.node;
    this.defaultLayer.add(node);

    node.on;
  }

  notify(type: NotifyType, attrs: BaseNotifyAttrs) {
    console.log(type, attrs);
  }

  draw() {
    this.defaultLayer.draw();
  }
}
