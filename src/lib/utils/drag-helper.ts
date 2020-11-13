export type DragDataType =
  | {
      type: 'imageToken';
      data: {
        name: string;
        url: string;
      };
    }
  | {
      type: 'actorToken';
      data: {
        uuid: string;
        name: string;
        url: string;
      };
    };

let _currentDragData: DragDataType;
/**
 * 设置当前拖动的数据
 */
export function setCurrentDragData(data: DragDataType) {
  _currentDragData = data;
}

/**
 * 获取当前拖动的数据
 */
export function getCurrentDragData(): DragDataType {
  return _currentDragData;
}
