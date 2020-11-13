export interface BaseNotifyAttrs {
  id: string;
  x: number;
  y: number;
  [other: string]: any;
}

export type TokenVisible = 'all' | 'manager' | string[];

export interface TokenConfig {
  visible: TokenVisible;
  [otherConfig: string]: any;
}
