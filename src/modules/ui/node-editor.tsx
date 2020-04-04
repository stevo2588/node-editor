import React, { useEffect, useState } from 'react';
import createEngine, { DefaultLinkModel, DiagramModel } from '@projectstorm/react-diagrams';
import NodeCanvas from './node-canvas';
import { IntegrationNodeModel, IntegrationNodeFactory } from './node-integration';
import { ProjectNodeFactory, ProjectNodeModel } from './node-project';


export default ({ graph, onUpdateActiveNodes }: { graph: Record<string, any>, onUpdateActiveNodes: (nodes: any[]) => void }) => {
  
  const getDefaultEngine = () => {
    const engine = createEngine();
    const model = new DiagramModel();
    engine.setModel(model);
    return engine;
  }
  
  const [engine, setEngine] = useState(getDefaultEngine());

  const buildEngine = () => {
    // engine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
    engine.getNodeFactories().registerFactory(new IntegrationNodeFactory());
    engine.getNodeFactories().registerFactory(new ProjectNodeFactory());
    const model = new DiagramModel();

    const interfaceNodes: { [name: string]: IntegrationNodeModel } = {};
    let i = 0;
    for (const interf in graph.interfaces) {
      const interfNode = new IntegrationNodeModel({
        name: `${graph.interfaces[interf].name} (${interf})`,
        apis: graph.interfaces[interf].apis?.map((a: any) => a.name) || [],
      });
      // @ts-ignore
      interfNode.registerListener({
        selectionChanged(e) { onUpdateActiveNodes([e.isSelected]); },
      });
      interfaceNodes[interf] = interfNode;
      interfNode.setPosition(380, i * 130 + 85);
      model.addNode(interfNode);
      i++;
    }

    i = 0;
    for (const proj in graph.projects) {
      const projNode = new ProjectNodeModel({
        name: proj,
        languages: graph.projects[proj].languages,
        artifacts: graph.projects[proj].artifacts,
      });
      // @ts-ignore
      projNode.registerListener({
        selectionChanged(e) { onUpdateActiveNodes([e.isSelected]); },
      });
      projNode.setPosition(40, i * 185 + 90);

      let j = 0;
      for (const interf of graph.projects[proj].interfaces) {
        const interfNode = interfaceNodes[interf.name];

        const portProj = projNode.addOutPort(j.toString());
        const portInterf = interfNode.addInPort(proj);
        let link = portProj.link<DefaultLinkModel>(portInterf);
        link.getOptions().testName = 'Test';
        // link.addLabel('Hello World!');
        model.addLink(link);
        j++;
      }

      projNode.addOutPort('empty');
      model.addNode(projNode);
      i++;
    }

    for (const interf in interfaceNodes) {
      interfaceNodes[interf].addInPort('empty');
    }

    engine.setModel(model);
    setEngine(engine);
  }

  useEffect(() => buildEngine(), []);

  return <NodeCanvas engine={engine} />;
};
