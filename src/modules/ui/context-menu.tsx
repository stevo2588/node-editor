import React from 'react';
import PieMenu, { Slice } from 'react-pie-menu';
import styled from '@emotion/styled';


const Menu = styled(PieMenu)<{ xPos: number, yPos: number }>`
  position: absolute;
  top: ${p => p.yPos - 125}px;
  left: ${p => p.xPos - 125}px;
`;



export default ({ x, y }: { x: number, y: number }) => (
  <Menu 
    radius='125px' 
    centerRadius='20px'
    xPos={x}
    yPos={y}
  >
    <Slice onSelect={() => console.log('thing 1')}>
      <p>Add Project</p>
    </Slice>
    <Slice onSelect={() => console.log('thing 2')}>
      <p>Add Integration</p>
    </Slice>
  </Menu>
);
