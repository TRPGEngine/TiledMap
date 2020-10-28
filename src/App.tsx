import React, { useEffect, useRef } from 'react';
import { initTiledMap } from './lib';
import { Toolbox } from './Toolbox';
import styled from 'styled-components';
import { LayerPanel } from './LayerPanel';
import { useTiledManagerRef } from './TiledManagerContext';

const Row = styled.div`
  display: flex;
`;

export const App: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiledMapManagerRef = useTiledManagerRef();
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
      <Row>
        <LayerPanel />

        <div>
          <Toolbox tiledMapManagerRef={tiledMapManagerRef} />
          <div ref={containerRef} style={{ backgroundColor: 'white' }}></div>
        </div>
      </Row>
    </div>
  );
});
App.displayName = 'App';
