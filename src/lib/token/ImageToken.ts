import Konva from 'konva';
import type { TiledMapManager } from '../manager';
import { BaseToken, TokenOptions } from './BaseToken';

export class ImageToken extends BaseToken {
  static createByUrl(
    tiledMapManager: TiledMapManager,
    url: string,
    x: number,
    y: number,
  ): ImageToken {
    const imageObj = new Image();
    const image = new Konva.Image({
      image: imageObj,
      x,
      y,
    });
    imageObj.src = url;
    imageObj.onload = () => {
      image.draw();
    };

    const token = new ImageToken(tiledMapManager, image);

    return token;
  }

  constructor(
    public manager: TiledMapManager,
    public imageNode: Konva.Image,
    options?: TokenOptions,
  ) {
    super(manager, imageNode, options);
  }
}
