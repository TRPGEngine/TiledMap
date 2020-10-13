import Konva from 'konva';
import type { LayerConfig } from 'konva/types/Layer';
import type { BaseToken } from '../token/BaseToken';

interface LayerOptions extends LayerConfig {}

export class BaseLayer {
  private render: Konva.Layer;

  constructor(options?: LayerOptions) {
    this.render = new Konva.Layer(options);
  }

  addToken(token: BaseToken) {
    this.render.add(token.node);
  }

  draw() {
    this.getRenderLayer().draw();
  }

  getRenderLayer(): Konva.Layer {
    return this.render;
  }
}
