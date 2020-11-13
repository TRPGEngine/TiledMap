import React, { useCallback } from 'react';
import styled from 'styled-components';
import imageMap from './image-map.json';
import { setCurrentDragData } from './lib/utils/drag-helper';

const Root = styled.div`
  width: 100%;
  height: 50%;
  overflow: auto;
  padding: 10px 0;
  border-top: 1px solid #ccc;
`;

const TokenList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TokenListItem = styled.div`
  width: 50%;
  padding: 6px;
  overflow: hidden;

  > img {
    max-width: 100%;
  }

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    display: inline-block;
  }
`;

export const Tokenbox: React.FC = React.memo(() => {
  const handleDrag = useCallback((name: string, url: string) => {
    setCurrentDragData({
      type: 'imageToken',
      data: {
        name,
        url,
      },
    });
  }, []);

  return (
    <Root>
      <div>Token 列表: </div>
      <TokenList>
        {Object.entries(imageMap.token).map(([name, url]) => (
          <TokenListItem onDrag={() => handleDrag(name, url)}>
            <img src={url} />
            <span>{name}</span>
          </TokenListItem>
        ))}
      </TokenList>
    </Root>
  );
});
Tokenbox.displayName = 'Tokenbox';
