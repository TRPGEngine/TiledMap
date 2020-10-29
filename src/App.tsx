import React, { useEffect, useRef } from 'react';
import { initTiledMap } from './lib';
import { Toolbox } from './Toolbox';
import styled from 'styled-components';
import { LayerPanel } from './LayerPanel';
import { useTiledManagerRef } from './TiledManagerContext';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const App: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiledMapManagerRef = useTiledManagerRef();
  useEffect(() => {
    if (containerRef.current) {
      tiledMapManagerRef.current = initTiledMap(containerRef.current, {
        width: 800,
        height: 600,
      });
    }
  }, []);

  return (
    <div className="App">
      <Container>
        <LayerPanel />

        <div>
          <Toolbox tiledMapManagerRef={tiledMapManagerRef} />
          <div ref={containerRef} style={{ backgroundColor: 'white' }}></div>
        </div>
      </Container>
    </div>
  );
});
App.displayName = 'App';
