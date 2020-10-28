import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTiledMap } from './TiledManagerContext';

const Root = styled.div`
  width: 120px;
`;

export const LayerPanel: React.FC = React.memo(() => {
  const { getLayerManager } = useTiledMap();

  useEffect(() => {
    setTimeout(() => {
      console.log('当前图层', getLayerManager()?.getLayers());
    }, 1000);
  }, [getLayerManager]);

  return <Root>图层控制</Root>;
});
LayerPanel.displayName = 'LayerPanel';
