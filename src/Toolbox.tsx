import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import type { TiledMapManager } from './lib/manager';

const Root = styled.div`
  display: flex;
  padding: 4px;
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

interface Props {
  tiledMapManagerRef: React.MutableRefObject<TiledMapManager | undefined>;
}
export const Toolbox: React.FC<Props> = React.memo((props) => {
  const { tiledMapManagerRef } = props;
  const [currentTool, setCurrentTool] = useState('');
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
      if (!success) {
        console.error('切换工具失败');
      }
    },
    [currentTool],
  );

  useEffect(() => {
    if (!tiledMapManagerRef.current) {
      return;
    }

    setCurrentTool(tiledMapManagerRef.current.currentToolName);
  }, [tiledMapManagerRef.current]);

  return (
    <Root>
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
    </Root>
  );
});
Toolbox.displayName = 'Toolbox';
