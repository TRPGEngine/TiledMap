import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TiledMapManager } from './lib/manager';
import type { ToolConfig } from './lib/tools/manager';
import imageMap from './image-map.json';

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

function useToolbox({ tiledMapManagerRef }: Props) {
  const [currentTool, setCurrentTool] = useState('');
  const [currentToolConfig, setCurrentToolConfig] = useState<ToolConfig>({});

  const handleSwitchTool = useCallback(
    (toolName: string) => {
      if (!tiledMapManagerRef.current) {
        return;
      }

      if (currentTool === toolName) {
        setCurrentTool('');
      } else {
        setCurrentTool(toolName);
      }

      const success = tiledMapManagerRef.current.switchTool(toolName);
      if (success) {
        setCurrentToolConfig({});
      } else {
        console.error('切换工具失败');
      }
    },
    [currentTool],
  );

  useEffect(() => {
    if (!tiledMapManagerRef.current) {
      return;
    }

    setCurrentTool(tiledMapManagerRef.current.getCurrentToolName());
  }, [tiledMapManagerRef.current]);

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
    tiledMapManagerRef.current?.setToolConfig(currentToolConfig);
  }, [currentToolConfig]);

  return {
    currentTool,
    handleSwitchTool,
    currentToolConfig,
    handleSetToolConfig,
  };
}

interface Props {
  tiledMapManagerRef: React.MutableRefObject<TiledMapManager | undefined>;
}
export const Toolbox: React.FC<Props> = React.memo((props) => {
  const {
    currentTool,
    handleSwitchTool,
    currentToolConfig,
    handleSetToolConfig,
  } = useToolbox(props);

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
