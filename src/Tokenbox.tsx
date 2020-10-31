import React from 'react';
import styled from 'styled-components';
import imageMap from './image-map.json';

const Root = styled.div`
  width: 100%;
  overflow: auto;
  padding: 10px 0;
  border-top: 1px solid #ccc;
`;

export const Tokenbox: React.FC = React.memo(() => {
  return <Root>Token 列表: {JSON.stringify(imageMap.token)}</Root>;
});
Tokenbox.displayName = 'Tokenbox';
