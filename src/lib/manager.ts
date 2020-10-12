import type { BaseNotifyAttrs } from './token/types';
import Konva from 'konva';
import type { BaseToken } from './token/BaseToken';
import { buildTiledMapStage } from './stage';
import { SNAPGRIDTOKEN, TRANSFORMABLE } from './token/names';
import { buildGridSnapBoundBox } from './utils/buildGridSnapBound';
import type { BaseTool } from './tools/baseTool';
import { FreeBrush } from './tools/freeBrush';
import _isNil from 'lodash/isNil';

type NotifyType = 'add' | 'update' | 'remove';

interface TiledMapManagerOptions {
  gridNum: number; // 网格数
  gridSize: number; // 底部网格大小
}

export class TiledMapManager {
  stage: Konva.Stage;
  defaultLayer = new Konva.Layer({
    name: 'defaultLayer',
  });
  tr: Konva.Transformer;
  currentLayer = this.defaultLayer;
  currentToolName = '';
  tools: {
    [name: string]: BaseTool;
  } = {};

  constructor(el: HTMLDivElement, public options: TiledMapManagerOptions) {
    const { gridNum, gridSize } = options;
    const stage = buildTiledMapStage(el, gridNum, gridSize);
    this.stage = stage;
    this.addLayer(this.defaultLayer);

    // 选择相关
    this.tr = new Konva.Transformer({
      enabledAnchors: ['middle-right', 'bottom-center', 'bottom-right'],
      rotationSnapTolerance: 5,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      boundBoxFunc: buildGridSnapBoundBox(gridSize),
    });
    this.defaultLayer.add(this.tr);

    this.initStageEvent();
    this.initTools();
  }

  initStageEvent() {
    const stage = this.stage;
    const tr = this.tr;
    const layer = this.defaultLayer;
    const gridSize = this.options.gridSize;

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

      if (e.target.hasName(SNAPGRIDTOKEN)) {
        tr.boundBoxFunc(buildGridSnapBoundBox(gridSize));
      } else {
        tr.boundBoxFunc((_, newBox) => newBox);
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

    // // 场景缩放
    // // 有点问题, 目前的拖动贴合算法会鬼畜。
    // const scaleBy = 1.1;
    // stage.on('wheel', (e) => {
    //   e.evt.preventDefault();
    //   const oldScale = stage.scaleX();

    //   const pointer = stage.getPointerPosition();

    //   if (pointer === null) {
    //     return;
    //   }

    //   const mousePointTo = {
    //     x: (pointer.x - stage.x()) / oldScale,
    //     y: (pointer.y - stage.y()) / oldScale,
    //   };

    //   const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    //   stage.scale({ x: newScale, y: newScale });

    //   const newPos = {
    //     x: pointer.x - mousePointTo.x * newScale,
    //     y: pointer.y - mousePointTo.y * newScale,
    //   };
    //   stage.position(newPos);
    //   stage.batchDraw();
    // });
  }

  initTools() {
    this.tools['freeBrush'] = new FreeBrush(this);
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

  addToken(token: BaseToken) {
    const node = token.node;
    this.defaultLayer.add(node);

    node.on;
  }

  /**
   * 增加层
   * @param layer Konva层
   */
  addLayer(layer: Konva.Layer) {
    this.stage.add(layer);
  }

  notify(type: NotifyType, attrs: BaseNotifyAttrs) {
    console.log(type, attrs);
  }

  draw() {
    this.defaultLayer.draw();
  }
}
