import { BaseToken } from './BaseToken';

export class FreeToken extends BaseToken {
  get snapGrid() {
    return false;
  }
}
