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
  display: flex;

  ${(props) => (props.active ? 'background-color: rgba(0, 0, 0, 0.1);' : '')};

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  > .title {
    flex: 1;
  }
`;

const ActionBtn = styled.button.attrs({
  className: 'iconfont',
})``;

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

  const handleRemoveLayer = useCallback(
    (layerId: string) => {
      if (!layerManager) {
        return;
      }

      layerManager.removeLayer(layerId);
    },
    [layerManager],
  );

  const handleRemoveCurrentLayer = useCallback(() => {
    if (currentLayerId === '') {
      return;
    }

    handleRemoveLayer(currentLayerId);
    setCurrentLayerId('');
  }, [handleRemoveLayer, currentLayerId]);

  const handleSelectLayer = useCallback(
    (layerId: string) => {
      tiledMapManager?.setCurrentLayerId(layerId);
    },
    [tiledMapManager],
  );

  const handleSwitchLayerVisible = useCallback(
    (layerId: string, visible: boolean) => {
      layerManager?.changeLayerVisible(layerId, visible);
    },
    [layerManager],
  );

  const handleChangeLayerName = useCallback(
    (layerId: string) => {
      let layerName = prompt(
        '请输入图层名',
        layerManager?.findLayerById(layerId)?.layerName ?? 'Layer',
      );

      if (layerName != null && layerName != '') {
        layerManager?.changeLayerName(layerId, layerName);
      }
    },
    [layerManager],
  );

  return (
    <Root>
      <Title>
        <i className="iconfont">&#xe768;</i>图层
      </Title>
      <div>
        <ActionBtn title="新增" onClick={handleAddLayer}>
          &#xe604;
        </ActionBtn>
        <ActionBtn title="删除当前层" onClick={handleRemoveCurrentLayer}>
          &#xe76b;
        </ActionBtn>
      </div>
      <div>
        {layers.map((layer) => (
          <Item
            key={layer.layerId}
            title={`${layer.layerId}`}
            active={currentLayerId === layer.layerId}
            onClick={() => handleSelectLayer(layer.layerId)}
          >
            <div className="title">{layer.layerName}</div>
            <div>
              <ActionBtn
                title="修改图层名"
                onClick={() => handleChangeLayerName(layer.layerId)}
              >
                &#xe612;
              </ActionBtn>
              <ActionBtn
                title="切换显示"
                onClick={() =>
                  handleSwitchLayerVisible(layer.layerId, !layer.visible())
                }
              >
                {layer.visible() ? (
                  <span>&#xe760;</span>
                ) : (
                  <span>&#xe762;</span>
                )}
              </ActionBtn>
              <ActionBtn
                title="删除"
                onClick={() => handleRemoveLayer(layer.layerId)}
              >
                &#xe76b;
              </ActionBtn>
            </div>
          </Item>
        ))}
      </div>
    </Root>
  );
});
LayerPanel.displayName = 'LayerPanel';
