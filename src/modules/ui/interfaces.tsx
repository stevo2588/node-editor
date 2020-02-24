import React from 'react';
import NodeEditor from './node-editor';


export default ({ path, graph, actions }: { path: string, graph: Record<string, any>, actions: { addProject: () => void } }) => (
  <>
  <div>Interfaces</div>
  <NodeEditor graph={graph} />
  </>
);
