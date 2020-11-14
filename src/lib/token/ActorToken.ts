import Konva from 'konva';
import type { Vector2d } from 'konva/types/types';
import type { TiledMapManager } from '../manager';
import type { TokenOptions } from './BaseToken';
import { ImageToken } from './ImageToken';

/**
 * 与Image不同，该Token具有一些玩家特有的事件与逻辑
 */
export class ActorToken extends ImageToken {
  uuid?: string;
  private _name: string = 'Actor';

  private _labelNode?: Konva.Text;

  static createActor(
    tiledMapManager: TiledMapManager,
    imageUrl: string,
    pos: Vector2d,
  ): ActorToken {
    const imageObj = new Image();
    const image = new Konva.Image({
      image: imageObj,
      x: pos.x,
      y: pos.y,
    });
    imageObj.src = imageUrl;
    imageObj.onload = () => {
      token.draw();
    };
    const token = new ActorToken(tiledMapManager, image);

    return token;
  }

  get name() {
    return this._name;
  }

  set name(val: string) {
    this._name = val;
    this._labelNode?.setText(val);
  }

  constructor(
    public manager: TiledMapManager,
    imageNode: Konva.Image,
    options?: TokenOptions,
  ) {
    super(manager, imageNode, options);

    this.initLabelNode();
    this.initLabelEvent();
  }

  private initLabelNode() {
    this._labelNode = new Konva.Text({
      align: 'center',
      text: name,
      fontFamily: 'Calibri',
      fill: 'grey',
      visible: false,
    });

    this.node.on('transform dragmove', () => {
      this.updateLabelPos();
    });

    this.updateLabelPos();

    this.renderNodeGroup.add(this._labelNode);
  }

  /**
   * 移动到节点上时显示标签
   */
  private initLabelEvent() {
    this.node.on('mouseenter', (e) => {
      if (!this._labelNode) {
        return;
      }

      this._labelNode.show();
      this._labelNode.draw();
    });
    this.node.on('mouseleave', (e) => {
      if (!this._labelNode) {
        return;
      }

      this._labelNode.hide();
      this._labelNode.getLayer()?.draw();
    });
  }

  updateLabelPos() {
    const labelNode = this._labelNode;
    if (!labelNode) {
      return;
    }

    const { x, y, width, height } = this.getNodeDisplayRect();

    labelNode.setAttrs({
      x: x,
      y: y + height + 10,
      width: width,
      fontSize: width >= 80 ? 20 : 10,
    });
  }
}
