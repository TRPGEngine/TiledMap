import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BaseLayer } from './lib/layer/BaseLayer';
import { useTiledManager } from './TiledManagerContext';

const Root = styled.div`
  width: 240px;
  border-right: 1px solid #ccc;
`;

const Title = styled.div`
  font-size: 18px;
  padding: 4px 6px;
`;

const Item = styled.div<{
  active: boolean;
}>`
  width: 100%;
  line-height: 24px;
  border-top: 1px solid #ccc;
  padding: 4px 6px;

  ${(props) => (props.active ? 'background-color: rgba(0, 0, 0, 0.05);' : '')};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const LayerPanel: React.FC = React.memo(() => {
  const { tiledMapManager } = useTiledManager();
  const [layers, setLayers] = useState<BaseLayer[]>([]);
  const [currentLayerId, setCurrentLayerId] = useState<string>('');
  const layerManager = tiledMapManager?.layerManager;

  useEffect(() => {
    if (!tiledMapManager) {
      return;
    }

    const _handleLayerSelected = () => {
      const _currentLayerId = tiledMapManager.layerManager.currentLayer.layerId;
      setCurrentLayerId(_currentLayerId);
    };

    const _handleLayerChange = () => {
      const layers = tiledMapManager.layerManager.getLayers();
      if (Array.isArray(layers)) {
        setLayers(layers);
      }
    };

    _handleLayerChange();
    _handleLayerSelected();

    tiledMapManager.on('layerChange', _handleLayerChange);
    tiledMapManager.on('layerSelected', _handleLayerSelected);

    return () => {
      tiledMapManager.off('layerChange', _handleLayerChange);
      tiledMapManager.off('layerSelected', _handleLayerSelected);
    };
  }, [tiledMapManager]);

  const handleAddLayer = useCallback(() => {
    if (!layerManager) {
      return;
    }

    layerManager.addLayer(new BaseLayer(layerManager));
  }, [layerManager]);

  const handleRemoveCurrentLayer = useCallback(() => {
    if (!layerManager) {
      return;
    }

    if (currentLayerId === '') {
      return;
    }

    layerManager.removeLayer(currentLayerId);
    setCurrentLayerId('');
  }, [layerManager, currentLayerId]);

  const handleSelectLayer = useCallback(
    (layerId: string) => {
      tiledMapManager?.setCurrentLayerId(layerId);
    },
    [tiledMapManager],
  );

  return (
    <Root>
      <Title>图层</Title>
      <div>
        <button onClick={handleAddLayer}>新增</button>
        <button onClick={handleRemoveCurrentLayer}>删除当前层</button>
      </div>
      <div>
        {layers.map((layer) => (
          <Item
            key={layer.layerId}
            title={`${layer.layerId}`}
            active={currentLayerId === layer.layerId}
            onClick={() => handleSelectLayer(layer.layerId)}
          >
            {layer.layerName}
          </Item>
        ))}
      </div>
    </Root>
  );
});
LayerPanel.displayName = 'LayerPanel';
