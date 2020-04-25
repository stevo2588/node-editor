import { DiagramModel as DM } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import { NodeModel } from './model';


export class DiagramModel extends DM {
  path = '/';
  containerNode?: NodeModel;
	protected inputNodeIds: string[];
	protected outputNodeIds: string[];
  createNodeByType: (type: string) => NodeModel = () => { throw new Error('Not set'); };

	constructor() {
    super();
    this.inputNodeIds = [];
    this.outputNodeIds = [];
	}

	serialize() {
    return {
      ...super.serialize(),
      inputNodeIds: this.inputNodeIds,
      outputNodeIds: this.outputNodeIds,
    };
  }

	deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.inputNodeIds = event.data.inputNodeIds;
    this.outputNodeIds = event.data.outputNodeIds;
  }

	addInputNode(type: string) {
    const n = this.createNodeByType(type);
    n.addOutPort(type);
    this.addNode(n);
    this.inputNodeIds.push(n.getID());
    return n;
  }

	addOutputNode(type: string) {
    const n = this.createNodeByType(type);
    n.addInPort(type);
    this.addNode(n);
    this.outputNodeIds.push(n.getID());
    return n;
	}

	_removeNode(node: NodeModel) {
    let i = this.inputNodeIds.indexOf(node.getID());
    if (i >= 0) this.inputNodeIds.splice(i, 1);
    else {
      i = this.outputNodeIds.indexOf(node.getID());
      if (i >= 0) this.outputNodeIds.splice(i, 1);
    }
    super.removeNode(node);
  }

	removeNode(node: NodeModel) {
    if (node.isReadonly) return;
    this._removeNode(node);
  }

	removeNodeById(id: string) {
    const n = this.getNodes().find(n => n.getID() === id);
    if (!n) throw new Error('Cannot find node');
    this._removeNode(n as NodeModel);
  }
  
  getInputNodes() {
    return this.getNodes().filter(n => this.inputNodeIds.includes(n.getID()));
  }

  getOutputNodes() {
    return this.getNodes().filter(n => this.outputNodeIds.includes(n.getID()));
  }
}
