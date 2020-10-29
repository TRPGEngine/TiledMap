import React, { useCallback, useContext, useState } from 'react';
import { initTiledMap } from './lib';
import type { TiledMapManager, TiledMapManagerOptions } from './lib/manager';

const TiledManagerContext = React.createContext<{
  tiledMapManager: TiledMapManager | null;
  buildTiledMapManager: (el: any, options: any) => void;
}>({
  tiledMapManager: null,
  buildTiledMapManager: () => {},
});
TiledManagerContext.displayName = 'TiledManagerContext';

export const TiledManagerProvider: React.FC = (props) => {
  const [
    tiledMapManager,
    setTiledMapManager,
  ] = useState<TiledMapManager | null>(null);

  const buildTiledMapManager = useCallback(
    (el: HTMLDivElement, options?: Partial<TiledMapManagerOptions>) => {
      setTiledMapManager(initTiledMap(el, options));
    },
    [],
  );

  return (
    <TiledManagerContext.Provider
      value={{ tiledMapManager, buildTiledMapManager }}
    >
      {props.children}
    </TiledManagerContext.Provider>
  );
};
TiledManagerProvider.displayName = 'TiledManagerProvider';

/**
 * 获取网格地图管理器
 */
export function useTiledManager() {
  const { tiledMapManager, buildTiledMapManager } = useContext(
    TiledManagerContext,
  );

  return { tiledMapManager, buildTiledMapManager };
}
