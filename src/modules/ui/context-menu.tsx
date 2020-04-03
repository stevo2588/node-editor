import React from 'react';
import PieMenu, { Slice } from 'react-pie-menu';


export default ({ x, y }: { x: number, y: number }) => (
  <PieMenu 
    radius='125px' 
    centerRadius='30px'
    centerX={x}
    centerY={y}
  >
    {/* Contents */}
    <Slice onSelect={() => console.log('thing 1')}>
      <p>Thing 1</p>
    </Slice>
    <Slice onSelect={() => console.log('thing 2')}>
      <p>Thing 2</p>
    </Slice>
    <Slice onSelect={() => console.log('thing 3')}>
      <p>Thing 3</p>
    </Slice>
    <Slice onSelect={() => console.log('thing 4')}>
      <p>Thing 4</p>
    </Slice>
  </PieMenu>
);