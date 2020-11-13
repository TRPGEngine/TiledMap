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
import { EventBus, EventCb } from './event';
import { DragDataType, getCurrentDragData } from './utils/drag-helper';
import { ImageToken } from './token/ImageToken';

type NotifyType = 'add' | 'update' | 'remove' | 'visible';

export interface TiledMapManagerOptions {
  width: number;
  height: number;
  gridNum: number; // 网格数
  gridSize: number; // 底部网格大小
}

export class TiledMapManager {
  stage: Konva.Stage;
  tr: Konva.Transformer;

  eventBus = new EventBus(); // 事件中心
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
    this.layerManager.defaultLayer.add(this.tr);

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

    // 拖入Token
    container.addEventListener('dragover', (e) => {
      e.preventDefault(); // !important
    });
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      // now we need to find pointer position
      // we can't use stage.getPointerPosition() here, because that event
      // is not registered by Konva.Stage
      // we can register it manually:
      stage.setPointersPositions(e);

      this.handleDrop(getCurrentDragData());
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

  /**
   * token 变更
   */
  tokenNotify(type: NotifyType, attrs: BaseNotifyAttrs) {
    this.eventBus.fire('tokenChange', { type, attrs });
  }

  /**
   * 层变更
   */
  layerNotify(type: NotifyType, attrs: any) {
    this.eventBus.fire('layerChange', { type, attrs });
  }

  setCurrentLayer(layer: BaseLayer) {
    this.layerManager.currentLayer = layer;
    this.eventBus.fire('layerSelected', { layerId: layer.layerId });
  }

  setCurrentLayerId(layerId: string) {
    const layer = this.layerManager.findLayerById(layerId);
    if (!layer) {
      return;
    }

    this.setCurrentLayer(layer);
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

  /**
   * 设置场景内容是否可拖动
   * @param draggable 是否可拖动
   */
  setStageDraggable(shouldDraggable: boolean): void {
    const stage = this.stage;

    if (shouldDraggable === true) {
      this.layerManager.defaultLayer.add(this.tr);
    } else {
      this.tr.remove();
    }

    stage.draggable(shouldDraggable);
    stage.find(`.${DRAGGABLE}`).each((node) => {
      node.draggable(shouldDraggable);
    });
  }

  /**
   * 监听事件
   */
  on(eventName: string, cb: EventCb): void {
    eventName.split(' ').forEach((name) => {
      this.eventBus.on(name, cb);
    });
  }

  off(eventName: string, cb: EventCb): void {
    eventName.split(' ').forEach((name) => {
      this.eventBus.off(name, cb);
    });
  }

  /**
   * 处理drop数据
   */
  private handleDrop(dragData: DragDataType) {
    if (dragData.type === 'imageToken') {
      const { name, url } = dragData.data;
      const pos = this.stage.getPointerPosition();
      if (pos === null) {
        return;
      }

      const token = ImageToken.createByUrl(this, url, pos.x, pos.y);
      token.name = name;
      token.fitToGrid();
      this.getCurrentLayer().addToken(token);
    }
  }
}
