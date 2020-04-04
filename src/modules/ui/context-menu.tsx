import React from 'react';
import PieMenu, { Slice } from 'react-pie-menu';
import styled from '@emotion/styled';


const Menu = styled(PieMenu)<{ xPos: number, yPos: number, radiusPx: number }>`
  position: absolute;
  top: ${p => p.yPos - p.radiusPx}px;
  left: ${p => p.xPos - p.radiusPx}px;
`;


export default ({ x, y, addProject, addService }: { x: number, y: number, addProject: (p: any, pos: any) => void, addService: (s: any, pos: any) => void }) => (
  <Menu 
    radius='80px' 
    radiusPx={80}
    centerRadius='10px'
    xPos={x}
    yPos={y}
  >
    <Slice onSelect={() => addProject({ name: 'untitled' }, { x, y })}>
      <p>Project</p>
    </Slice>
    <Slice onSelect={() => addService({ name: 'untitled' }, { x, y })}>
      <p>Service</p>
    </Slice>
  </Menu>
);
