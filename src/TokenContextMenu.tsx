import React, { CSSProperties, useEffect, useState } from 'react';
import { useTiledManager } from './TiledManagerContext';

export const TokenContextMenu: React.FC = React.memo(() => {
  const { tiledMapManager } = useTiledManager();
  const [style, setStyle] = useState<CSSProperties>({});
  useEffect(() => {
    if (!tiledMapManager) {
      return;
    }

    tiledMapManager.stage.container().addEventListener('click', () => {
      setStyle({
        display: 'none',
      });
    });

    tiledMapManager.on('tokenContextMenu', (token) => {
      const stage = tiledMapManager.stage;
      const pointerPos = stage.getPointerPosition();
      if (pointerPos === null) {
        return;
      }
      const containerRect = stage.container().getBoundingClientRect();
      setStyle({
        display: 'initial',
        top: containerRect.top + pointerPos.y + 4 + 'px',
        left: containerRect.left + pointerPos.x + 4 + 'px',
      });
    });
  }, [tiledMapManager]);

  return (
    <div
      style={{
        display: 'none',
        position: 'absolute',
        width: '60px',
        backgroundColor: 'white',
        boxShadow: '0 0 5px grey',
        borderRadius: '3px',
        ...style,
      }}
    >
      <button onClick={() => console.log('删除')}>删除</button>
    </div>
  );
});
TokenContextMenu.displayName = 'TokenContextMenu';
