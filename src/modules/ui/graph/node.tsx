import React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { BaseNodeWidget } from './node-base';
import { NodeModel } from './models/model';


export const NodeWidget = ({ node, engine }: { node: NodeModel; engine: DiagramEngine; }) => (
  <BaseNodeWidget
    node={node}
    engine={engine} headerButtonAction={node.graph ? () => {
      // @ts-ignore
      engine.fireEvent({ nav: { path: node.graph.path } }, 'navigateToDiagram');
    } : undefined}
  >
    <div>{console.log('rendering NodeWidget') as undefined}</div>
  </BaseNodeWidget>
);
