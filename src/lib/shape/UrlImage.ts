import Konva from 'konva';
import type { ImageConfig } from 'konva/types/shapes/Image';
import _isNil from 'lodash/isNil';

/**
 * 专用Image形状
 * 只能通过Url进行加载， 方便传输
 * 先用base64 一像素图片让其快速渲染占位, 然后再换成正常的图片
 */
export class UrlImage extends Konva.Image {
  // 使用的图片地址
  private url: string;

  constructor(url: string, config?: Omit<ImageConfig, 'image'>) {
    const image = new Image();
    image.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 一像素透明图片
    const _config: ImageConfig = {
      ...config,
      image,
    };
    super(_config);

    this.url = url;
    this.loadImage(this.url);
  }

  /**
   * 加载图片
   * @param url 图片地址
   */
  loadImage(url: string) {
    this.url = url;
    const realImage = new Image();
    realImage.src = String(url);
    realImage.onload = () => {
      this.image(realImage);
      if (!_isNil(this.getLayer())) {
        this.draw();
      }
    };
  }

  /**
   * 获取图片地址
   */
  getImageUrl(): string {
    return this.url;
  }
}
