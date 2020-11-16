import React, { useEffect, useRef } from 'react';
import { Toolbox } from './Toolbox';
import styled from 'styled-components';
import { LayerPanel } from './LayerPanel';
import { useTiledManager } from './TiledManagerContext';
import { Tokenbox } from './Tokenbox';
import { ToolAttrs } from './ToolAttrs';
import { TokenContextMenu } from './TokenContextMenu';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const LeftPanel = styled.div`
  width: 240px;
  border-right: 1px solid #ccc;
`;

export const App: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { buildTiledMapManager } = useTiledManager();
  useEffect(() => {
    if (containerRef.current) {
      buildTiledMapManager(containerRef.current, {
        width: 800,
        height: 600,
      });
    }
  }, []);

  return (
    <div className="App">
      <Container>
        <LeftPanel>
          <ToolAttrs />

          <Tokenbox />

          <LayerPanel />
        </LeftPanel>

        <div>
          <Toolbox />
          <div ref={containerRef} style={{ backgroundColor: 'white' }}></div>
          <TokenContextMenu />
        </div>
      </Container>
    </div>
  );
});
App.displayName = 'App';
