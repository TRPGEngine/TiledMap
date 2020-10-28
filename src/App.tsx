import React, { useEffect, useRef } from 'react';
import { initTiledMap } from './lib';
import type { TiledMapManager } from './lib/manager';
import { Toolbox } from './Toolbox';

export const App: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiledMapManagerRef = useRef<TiledMapManager>();
  useEffect(() => {
    if (containerRef.current) {
      tiledMapManagerRef.current = initTiledMap(containerRef.current, {
        width: 1000,
        height: 800,
      });
    }
  }, []);

  return (
    <div className="App">
      <Toolbox tiledMapManagerRef={tiledMapManagerRef} />
      <div ref={containerRef}></div>
    </div>
  );
});
App.displayName = 'App';
