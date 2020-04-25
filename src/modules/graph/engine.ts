import {
	DefaultDiagramState,
	DiagramEngine,
	LinkLayerFactory,
	NodeLayerFactory,
  NodeModel,
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory, AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { PortFactory } from './port';
import { MiddlewareLinkFactory } from '../../client/modules/ui/graph/link';


export default (otherFactories: AbstractReactFactory<NodeModel, DiagramEngine>[]) => {
  const engine = new DiagramEngine();
  engine.getLayerFactories().registerFactory(new NodeLayerFactory());
  engine.getLayerFactories().registerFactory(new LinkLayerFactory());
  engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

  engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
  engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
  engine.getPortFactories().registerFactory(new PortFactory());
  engine.getLinkFactories().registerFactory(new MiddlewareLinkFactory());

  const state = new DefaultDiagramState();
  state.dragNewLink.config.allowLooseLinks = false;
  engine.getStateMachine().pushState(state);

  otherFactories.forEach(f => {
    engine.getNodeFactories().registerFactory(f);
  })

  return engine;
}
