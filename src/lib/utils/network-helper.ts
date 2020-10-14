import Konva from 'konva';
import { UrlImage } from '../shape/UrlImage';

interface NodeAttr {
  [key: string]: any;
}

/**
 * 获取方便网络传输的节点
 * @param node
 */
export function getAttrs(
  node: Konva.Shape | Konva.Group,
): NodeAttr | NodeAttr[] {
  if (node instanceof Konva.Group) {
    return node.children.toArray().map((item) => {
      return getAttrs(item);
    });
  }

  if (node instanceof UrlImage) {
    return {
      name: node.getAttr('name'),
      url: node.url,
    };
  }

  return node.getAttrs();
}
