import type { BaseNotifyAttrs } from './token/types';
import Konva from 'konva';
import type { BaseToken } from './token/BaseToken';
import { buildTiledMapStage } from './stage';
import { SNAPGRIDTOKEN, TRANSFORMABLE, DRAGGABLE } from './token/names';
import { buildGridSnapBoundBox } from './utils/buildGridSnapBound';
import _isNil from 'lodash/isNil';
import { ToolManager } from './tools/manager';
import { LayerManager } from './layer';
import type { BaseLayer } from './layer/BaseLayer';

type NotifyType = 'add' | 'update' | 'remove';

export interface TiledMapManagerOptions {
  width: number;
  height: number;
  gridNum: number; // 网格数
  gridSize: number; // 底部网格大小
}

export class TiledMapManager {
  stage: Konva.Stage;
  tr: Konva.Transformer;

  toolManager = new ToolManager(this);
  layerManager: LayerManager;

  constructor(el: HTMLDivElement, public options: TiledMapManagerOptions) {
    const { width, height, gridNum, gridSize } = options;
    const stage = buildTiledMapStage(el, width, height, gridNum, gridSize);
    this.stage = stage;

    this.layerManager = new LayerManager(this);

    // 选择相关
    this.tr = new Konva.Transformer({
      enabledAnchors: ['middle-right', 'bottom-center', 'bottom-right'],
      rotationSnapTolerance: 5,
      rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
      boundBoxFunc: buildGridSnapBoundBox(gridSize),
    });
    this.layerManager.defaultLayer.getRenderLayer().add(this.tr);

    this.initStageEvent();
  }

  initStageEvent() {
    const stage = this.stage;
    const container = stage.container();
    const tr = this.tr;
    const gridSize = this.options.gridSize;

    // clicks should select/deselect shapes
    stage.on('click tap', function (e) {
      // 处理旧节点
      const oldNodes = tr.nodes();
      oldNodes.forEach((node) => {
        if (node.hasName(DRAGGABLE)) {
          // 把旧节点全置为不可拖动
          node.draggable(false);
        }
      });

      // if click on empty area - remove all selections
      if (e.target === stage) {
        tr.nodes([]);
        tr.getLayer()?.draw();
        return;
      }

      if (!e.target.hasName(TRANSFORMABLE)) {
        return;
      }

      // 缩放策略
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

      // 处理新节点
      const newNodes = tr.nodes();
      newNodes.forEach((node) => {
        if (node.hasName(DRAGGABLE)) {
          // 把旧节点全置为不可拖动
          node.draggable(true);
        }
      });
      tr.getLayer()?.draw();
    });

    container.focus();
    container.tabIndex = 1;
    container.style.outline = 'none';
    container.addEventListener('keydown', (e) => {
      let isHandled = true;
      if (e.code === 'Backspace' || e.code === 'Delete') {
        if (tr.nodes().length > 0) {
          // TODO: 查找相应的Token
        }
      } else {
        isHandled = false;
      }

      if (isHandled) {
        e.preventDefault();
        e.stopPropagation();
      }
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

  switchTool = this.toolManager.switchTool.bind(this.toolManager);
  setToolConfig = this.toolManager.setToolConfig.bind(this.toolManager);

  addToken(token: BaseToken) {
    this.getCurrentLayer().addToken(token);
  }

  /**
   * 增加层
   * @param layer 层
   */
  addLayer(layer: BaseLayer) {
    this.layerManager.addLayer(layer);
  }

  /**
   * 获取当前激活的层
   */
  getCurrentLayer(): BaseLayer {
    return this.layerManager.currentLayer;
  }

  /**
   * 获取当前使用的工具名
   */
  getCurrentToolName(): string {
    return this.toolManager.currentToolName;
  }

  notify(type: NotifyType, attrs: BaseNotifyAttrs) {
    console.log(type, attrs);
  }

  draw() {
    this.stage.draw();
  }

  /**
   * 设置当前指针
   * @param cursor 指针样式
   */
  setCursor(cursor: string) {
    this.stage.container().style.cursor = cursor;
  }
}
