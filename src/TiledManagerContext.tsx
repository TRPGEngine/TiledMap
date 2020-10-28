import React, { useRef, useEffect, useCallback, useContext } from 'react';
import type { TiledMapManager } from './lib/manager';
import { initTiledMap } from './lib';

type TiledMapManagerRef = React.MutableRefObject<TiledMapManager | undefined>;

const TiledManagerContext = React.createContext<TiledMapManagerRef>({
  current: undefined,
});

export const TiledManagerProvider: React.FC = (props) => {
  const tiledMapManagerRef = useRef<TiledMapManager>();

  useEffect(() => {
    const el = document.createElement('div');
    tiledMapManagerRef.current = initTiledMap(el);
  }, []);

  return (
    <TiledManagerContext.Provider value={tiledMapManagerRef}>
      {props.children}
    </TiledManagerContext.Provider>
  );
};
TiledManagerProvider.displayName = 'TiledManagerProvider';

/**
 * 获取网格地图管理器
 */
export function useTiledManagerRef(): TiledMapManagerRef {
  const tiledMapManagerRef = useContext(TiledManagerContext);

  return tiledMapManagerRef;
}

export function useTiledMap() {
  const tiledMapManagerRef = useTiledManagerRef();

  const getLayerManager = useCallback(() => {
    return tiledMapManagerRef.current?.layerManager;
  }, []);

  return {
    getLayerManager,
  };
}
