import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  padding: 10px 0;
`;

export const ToolAttrs: React.FC = React.memo(() => {
  return <Root>道具属性配置</Root>;
});
ToolAttrs.displayName = 'ToolAttrs';
