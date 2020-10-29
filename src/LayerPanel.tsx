import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { BaseLayer } from './lib/layer/BaseLayer';
import { useTiledMap } from './TiledManagerContext';

const Root = styled.div`
  width: 240px;
  border-right: 1px solid #ccc;
`;

const Title = styled.div`
  font-size: 18px;
  padding: 4px 6px;
`;

const Item = styled.div`
  width: 100%;
  line-height: 24px;
  border-top: 1px solid #ccc;
  padding: 4px 6px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const LayerPanel: React.FC = React.memo(() => {
  const { getLayerManager } = useTiledMap();
  const [layers, setLayers] = useState<BaseLayer[]>([]);

  useEffect(() => {
    // TODO: 改成监听模式
    setTimeout(() => {
      const layers = getLayerManager()?.getLayers();
      if (Array.isArray(layers)) {
        setLayers(layers);
      }
    }, 1000);
  }, [getLayerManager]);

  return (
    <Root>
      <Title>图层</Title>
      <div>
        {layers.map((layer) => (
          <Item key={layer.layerId} title={`${layer.layerId}`}>
            {layer.layerName}
          </Item>
        ))}
      </div>
    </Root>
  );
});
LayerPanel.displayName = 'LayerPanel';
