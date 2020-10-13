import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TiledMapManager } from './lib/manager';
import type { ToolConfig } from './lib/tools/manager';

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

  return (
    <div>
      <Row>
        <Item
          active={currentTool === 'freeBrush'}
          onClick={() => handleSwitchTool('freeBrush')}
        >
          &#xe8b4;
        </Item>
        <Item
          active={currentTool === 'tiledBrush'}
          onClick={() => handleSwitchTool('tiledBrush')}
        >
          &#xe650;
        </Item>
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
            {['earth', 'forest', 'grassland'].map((name) => {
              const fullPath = `/image/tiles/${name}.jpg`;

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
