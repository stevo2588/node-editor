import { NodeModel as Model, NodeModelGenerics, NodeModelListener } from '@projectstorm/react-diagrams-core';
import { BasePositionModelOptions, BaseEntityEvent } from '@projectstorm/react-canvas-core';
import { PortModel } from './port';
import { DiagramModel } from './diagram';


export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name: string;
	color: string;
}

interface Listener extends NodeModelListener {
	// @ts-ignore
	modelChanged?(event: BaseEntityEvent<NodeModel> & { model: {} | any }): void;
}

export abstract class NodeModel extends Model<NodeModelGenerics & { OPTIONS: DefaultNodeModelOptions; LISTENER: Listener }> {
	graph?: DiagramModel;
	containerPortToModelMap: Record<string, string> = {};
  abstract model: any;
	private _compiledData: any = null;
  public path = '/';
	public name: string;
	public color: string;
	readonly abstract defaultInputs: typeof NodeModel[];
	readonly abstract defaultOutputs: typeof NodeModel[];
	readonly abstract additionalInputs: typeof NodeModel[];
  readonly abstract additionalOutputs: typeof NodeModel[];
	protected portsIn: PortModel[];
	protected portsOut: PortModel[];
	isReadonly = false;

	abstract get schema(): any;
	abstract get displayType(): string;

  constructor(isContainer: boolean, type: string, name: string, color: string) {
		super({
			type,
			name,
			color,
		});
		this.color = color;
		this.portsOut = [];
		this.portsIn = [];
    this.name = name;

    if (isContainer) {
			this.graph = new DiagramModel();
			this.graph.containerNode = this;
		}

		this.onInputOrConfigChange();
	}
	
	get isContainerOutput() {
		if (!this.getParentCanvasModel()) return false;
		return (this.getParentCanvasModel() as DiagramModel).getOutputNodes().some(n => n.getID() === this.getID()) || false;
	}

  abstract async codeEffect(): Promise<void>;

	public get compiledData() { return this._compiledData; }

  protected abstract compile(inputs: { type: string, value: any }[], config: NodeModel['model']): {
		outputs: { type: string, value: any }[], data: any,
	};

  onInputOrConfigChange() {
		console.log(`compiling ${this.displayType}`);
    const inputValues = this.getInPorts()
      .filter(i => Object.keys(i.getLinks()).length > 0)
			.map(i => Object.values(i.getLinks())[0].getSourcePort() as PortModel)
			.filter(p => p)
			.map(p => ({ type: p.portType, value: p.value, portId: p.getID() }));

		if (this.isContainerOutput) {
			const link = Object.values(this.getInPorts()[0].getLinks())[0];
			const value = link ? (link.getSourcePort() as PortModel).value : null;

			const containerNode = (this.getParentCanvasModel() as DiagramModel).containerNode;
			const containerOutPort = containerNode?.getOutPorts().find(p => containerNode.containerPortToModelMap[p.getID()] === this.getID());
			if (!containerOutPort) throw new Error('could not find matching container output');
			containerOutPort.value = value;

			Object.values(containerOutPort.getLinks())
				.forEach(l => {
					if (l.getTargetPort()) (l.getTargetPort().getNode() as NodeModel).onInputOrConfigChange();
				});
			// NOTE: do we need to wait on other output nodes before propogating? Probably not since you can't
			// update multiple output node's config or input at the same time.

			return;
		}
		if (this.graph) {
			// set underlying input node outputs
			const modelIds = this.getInPorts()
				.map(p => this.containerPortToModelMap[p.getID()]);
			const inputNodes = this.graph.getModels()
				.filter(m => modelIds.includes(m.getID()))
				.map(m => m as NodeModel);

			inputNodes.forEach(n => {
				const value = inputValues.find(i => this.containerPortToModelMap[i.portId] === n.getID());
				n.getOutPorts()[0].value = value;
			});

			// trigger updates
			inputNodes.forEach(n => n.onInputOrConfigChange());

			// NOTE: this part shouldn't be necessary since graph output nodes will always lift and propogate
			// // get graph outputs
			// const outputModelIds = this.getOutPorts()
			// 	.map(p => this.containerPortToModelMap[p.getID()]);

			// outputs = this.graph.getModels()
			// 	.filter(m => outputModelIds.includes(m.getID()))
			// 	.map(m => (m as NodeModel).getInPorts()[0])
			// 	.map(p => {
			// 		const link = Object.values(p.getLinks())[0];
			// 		const value = link ? (link.getSourcePort() as PortModel).value : null;
			// 		return { type: p.portType, value: value };
			// 	});

			return;
		}

		let outputs: { type: string, value: any }[] = [];
		let data: any;

		({ outputs, data } = this.compile(inputValues, this.model));
		this._compiledData = data;

    // attempt to update existing outputs and add any new ones
		const outPorts = this.getOutPorts();
		let i = 0;
    outputs.forEach((o) => {
			const existingPort = outPorts[i];
			let port: PortModel;
			if (!existingPort) {
				port = this.addOutPort(o.type);
			} else if (existingPort.portType === o.type) { // update
				port = existingPort;
      } else { // replace
        this.removePort(existingPort);
				port = this.addOutPort(o.type);
      }
			port.value = o.value;
			i++;
		});
		// remove any remaining ports
		while (i < outPorts.length) {
      this.removePort(outPorts[i]);
			i++;
		}

		// trigger compile on connected nodes
		this.getOutPorts().forEach(p => (
			Object.values(p.getLinks())
				.forEach(link => (link.getTargetPort().getNode() as NodeModel).onInputOrConfigChange())
		));
  }

	setName(name: string) {
		this.name = name;
		this.onInputOrConfigChange();
		this.fireEvent({ model: { name } }, 'modelChanged');
	}

	setModel(model: Record<string, any>) {
		this.model = model;
		this.onInputOrConfigChange();
		this.fireEvent({ model }, 'modelChanged');
	}

	doClone(lookupTable: {}, clone: any) {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: PortModel) {
		Object.values(port.getLinks()).forEach(link => link.remove());

		super.removePort(port);
		if (port.in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}

		if (this.graph) {
			this.graph.removeNodeById(this.containerPortToModelMap[port.getID()]);
			delete this.containerPortToModelMap[port.getID()];
		}
	}

	addPort<T extends PortModel>(port: T): T {
		super.addPort(port);
		if (port.in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}

	addInPort(type: string, after = true) {
		const p = new PortModel(type, {
			in: true,
			label: type,
		});

		if (this.graph) {
			const n = this.graph.addInputNode(type) as NodeModel;
			console.log(n);
			n.isReadonly = true;
			this.containerPortToModelMap[p.getID()] = n.getID();
		}

		if (!after) {
			this.portsIn.splice(0, 0, p);
		}

		return this.addPort(p);
	}

	addOutPort(type: string, after = true) {
		const p = new PortModel(type, {
			in: false,
			label: type,
		});

		if (this.graph) {
			const n = this.graph.addOutputNode(type) as NodeModel;
			n.isReadonly = true;
			this.containerPortToModelMap[p.getID()] = n.getID();
		}

		if (!after) {
			this.portsOut.splice(0, 0, p);
		}

		return this.addPort(p);
	}

	getInPorts() {
		return this.portsIn;
	}

	getOutPorts() {
		return this.portsOut;
	}

	serialize() {
    const s: any = {
      ...super.serialize(),
			name: this.name,
			color: this.color,
			model: this.model,
			compiledData: { ...this._compiledData },
    };

    if (this.graph) {
			s.graph = this.graph.serialize();
			s.containerPortToModelMap = this.containerPortToModelMap;
		}

    return s;
	}

	deserialize(event: any) {
    super.deserialize(event);
    this.name = event.data.name;
		this.color = event.data.color;
		this.model = event.data.model;
		this._compiledData = event.data.compiledData;
    if (event.data.graph) {
      this.graph = new DiagramModel();
			this.graph.deserializeModel(event.data.graph, event.engine);
			this.graph.containerNode = this;
			this.containerPortToModelMap = event.data.containerPortToModelMap;
		}

		this.onInputOrConfigChange();
  }
}
