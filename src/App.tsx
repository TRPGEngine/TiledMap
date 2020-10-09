import React, { useEffect, useRef } from 'react';
import { initTiledMap } from './lib';

export const App: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      initTiledMap(containerRef.current);
    }
  }, []);

  return (
    <div className="App">
      <div ref={containerRef}></div>
    </div>
  );
});
App.displayName = 'App';
