import React from 'react';
import PieMenu, { Slice } from 'react-pie-menu';
import styled from '@emotion/styled';


const Menu = styled(PieMenu)<{ xPos: number, yPos: number, radiusPx: number }>`
  position: absolute;
  top: ${p => p.yPos - p.radiusPx}px;
  left: ${p => p.xPos - p.radiusPx}px;
`;


export default ({ x, y, options, addProject, addService, addContainer }: { x: number, y: number, options: any[], addProject: (p: any, pos: any) => void, addService: (s: any, pos: any) => void, addContainer: (p: any, pos: any) => void }) => (
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
    {/* <Slice onSelect={() => addProject({ name: 'untitled' }, { x, y })}>
      <p>Project</p>
    </Slice>
    <Slice onSelect={() => addService({ name: 'untitled' }, { x, y })}>
      <p>Service</p>
    </Slice>
    <Slice onSelect={() => addContainer({ name: 'untitled' }, { x, y })}>
      <p>Container</p>
    </Slice> */}
  </Menu>
);
