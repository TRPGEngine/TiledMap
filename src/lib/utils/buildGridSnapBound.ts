import type Konva from 'konva';
import { snapGrid } from './snapGrid';

/**
 * 构建一个只在网格内移动, 并且坐标贴合网格的移动拖拽操作
 * 用于Node的dragBoundFunc方法
 *
 * 因为传入的pos是绝对坐标。但是计算snap的时候应当使用相对坐标，因此在处理的时候将两者相减得出相对坐标的差值
 * 然后处理的时候减掉差值 处理完再加回来
 */
export function buildGridSnapBound(gridSize: number) {
  function dragBoundFunc(this: Konva.Node, pos: Konva.Vector2d) {
    const absolutePosition = this.absolutePosition();
    const relativePos = this.position();
    const deltaX = absolutePosition.x - relativePos.x;
    const deltaY = absolutePosition.y - relativePos.y;

    const targetX = snapGrid(pos.x - deltaX, gridSize) + deltaX;
    const targetY = snapGrid(pos.y - deltaY, gridSize) + deltaY;

    return {
      x: targetX,
      y: targetY,
    };
  }

  return dragBoundFunc;
}

/**
 * 用于Transformer的bound
 */
export function buildGridSnapBoundBox(gridSize: number) {
  function boundBoxFunc(oldBox: Konva.Box, newBox: Konva.Box): Konva.Box {
    const targetBox = { ...newBox };
    targetBox.width = snapGrid(newBox.width, gridSize);
    targetBox.height = snapGrid(newBox.height, gridSize);

    return targetBox;
  }

  return boundBoxFunc;
}
