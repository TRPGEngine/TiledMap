import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TiledMapManager } from './lib/manager';
import type { ToolConfig } from './lib/tools/manager';
import imageMap from './image-map.json';
import { useTiledManager } from './TiledManagerContext';

const Row = styled.div`
  padding: 4px;
  display: flex;
`;

const Item = styled.div.attrs({
  className: 'iconfont',
})<{
  active: boolean;
}>`
  background-color: ${(props) => (props.active ? '#ddd' : 'transparent')};
  padding: 6px;
  cursor: pointer;
`;

function useToolbox() {
  const { tiledMapManager } = useTiledManager();
  const [currentTool, setCurrentTool] = useState('');
  const [currentToolConfig, setCurrentToolConfig] = useState<ToolConfig>({});

  const handleSwitchTool = useCallback(
    (toolName: string) => {
      if (!tiledMapManager) {
        return;
      }

      if (currentTool === toolName) {
        setCurrentTool('');
      } else {
        setCurrentTool(toolName);
      }

      const success = tiledMapManager.switchTool(toolName);
      if (success) {
        setCurrentToolConfig({});
      } else {
        console.error('切换工具失败');
      }
    },
    [tiledMapManager, currentTool],
  );

  useEffect(() => {
    if (!tiledMapManager) {
      return;
    }

    setCurrentTool(tiledMapManager.getCurrentToolName());
  }, [tiledMapManager]);

  const handleSetToolConfig = useCallback(
    (key: string, value: string | number | undefined) => {
      setCurrentToolConfig({
        ...currentToolConfig,
        [key]: value,
      });
    },
    [currentToolConfig],
  );

  useEffect(() => {
    tiledMapManager?.setToolConfig(currentToolConfig);
  }, [tiledMapManager, currentToolConfig]);

  return {
    currentTool,
    handleSwitchTool,
    currentToolConfig,
    handleSetToolConfig,
  };
}

interface Props {}
export const Toolbox: React.FC<Props> = React.memo((props) => {
  const {
    currentTool,
    handleSwitchTool,
    currentToolConfig,
    handleSetToolConfig,
  } = useToolbox();

  const buildToolItem = useCallback(
    (toolName: string, icon: React.ReactElement) => {
      return (
        <Item
          active={currentTool === toolName}
          onClick={() => handleSwitchTool(toolName)}
        >
          {icon}
        </Item>
      );
    },
    [handleSwitchTool],
  );

  return (
    <div>
      <Row>
        {buildToolItem('', <span>&#xe65c;</span>)}
        {buildToolItem('freeBrush', <span>&#xe8b4;</span>)}
        {buildToolItem('lineTool', <span>&#xe7fd;</span>)}
        {buildToolItem('rectTool', <span>&#xe7f9;</span>)}
        {buildToolItem('circleTool', <span>&#xe803;</span>)}
        {buildToolItem('polygonTool', <span>&#xe67b;</span>)}
        {buildToolItem('tiledBrush', <span> &#xe650;</span>)}
      </Row>

      <div>
        {currentTool === 'tiledBrush' ? (
          <Row>
            <Item
              active={currentToolConfig['texture'] === undefined}
              onClick={() => handleSetToolConfig('texture', undefined)}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  lineHeight: '40px',
                }}
              >
                清空
              </div>
            </Item>
            {Object.entries(imageMap.tiles).map(([name, fullPath]) => {
              return (
                <Item
                  key={name}
                  active={currentToolConfig['texture'] === fullPath}
                  onClick={() => handleSetToolConfig('texture', fullPath)}
                >
                  <img src={fullPath} width="40" height="40" />
                </Item>
              );
            })}
          </Row>
        ) : null}
      </div>
    </div>
  );
});
Toolbox.displayName = 'Toolbox';
