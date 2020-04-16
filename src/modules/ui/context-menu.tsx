import React from 'react';
import PieMenu, { Slice } from 'react-pie-menu';
import styled from '@emotion/styled';


const Menu = styled(PieMenu)<{ xPos: number, yPos: number, radiusPx: number }>`
  position: absolute;
  top: ${p => p.yPos - p.radiusPx}px;
  left: ${p => p.xPos - p.radiusPx}px;
`;


export default ({ x, y, options }: { x: number, y: number, options: any[] }) => (
  <Menu 
    radius='80px' 
    radiusPx={80}
    centerRadius='10px'
    xPos={x}
    yPos={y}
  >
    {options.map(o => (
      <Slice key={o.key} onSelect={() => o.onAddNode({ name: 'untitled' }, { x, y })}>
        <p>{o.name}</p>
      </Slice>
    ))}
  </Menu>
);
