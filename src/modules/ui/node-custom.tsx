import * as React from 'react';
import { DiagramEngine, PortModelAlignment, PortWidget, NodeModel, NodeModelGenerics, LinkModel, DefaultLinkModel, PortModel } from '@projectstorm/react-diagrams';
import { AbstractReactFactory, AbstractModelFactory } from '@projectstorm/react-canvas-core';
import styled from '@emotion/styled';


export class DiamondPortModel extends PortModel {
	constructor(alignment: PortModelAlignment) {
		super({ type: 'diamond', name: alignment, alignment: alignment });
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}

export class DiamondNodeModel extends NodeModel<NodeModelGenerics & { PORT: DiamondPortModel }> {
	constructor() {
		super({ type: 'diamond' });
		this.addPort(new DiamondPortModel(PortModelAlignment.TOP));
		this.addPort(new DiamondPortModel(PortModelAlignment.LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT));
	}

	getPort(s: string) {
		const p = super.getPort(s);
		if (!p) throw new Error('no port');
		return p;
	}
}

const Port = styled.div`
	width: 16px;
	height: 16px;
	z-index: 10;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 8px;
	cursor: pointer;
	&:hover {
		background: rgba(0, 0, 0, 1);
	}
`;

const DiamondNodeWidget = ({ node, engine, size }: { node: DiamondNodeModel; engine: DiagramEngine; size: number }) => (
	<div
		className={'diamond-node'}
		style={{ position: 'relative', width: size, height: size }}>
		<svg width={size} height={size} dangerouslySetInnerHTML={{ __html: `
				<g id="Layer_1"></g>
				<g id="Layer_2">
					<polygon fill="mediumpurple" stroke="${node.isSelected() ? 'white' : '#000000'}"
						stroke-width="3" stroke-miterlimit="10"
						points="10, ${size / 2} ${size / 2},10 ${size - 10},${size / 2} ${size / 2},${size - 10}"
					/>
				</g>
		` }} />
		<PortWidget
			style={{ top: size / 2 - 8, left: -8, position: 'absolute' }}
			port={node.getPort(PortModelAlignment.LEFT)}
			engine={engine}>
			<Port />
		</PortWidget>
		<PortWidget
			style={{ left: size / 2 - 8, top: -8, position: 'absolute' }}
			port={node.getPort(PortModelAlignment.TOP)}
			engine={engine}>
			<Port />
		</PortWidget>
		<PortWidget
			style={{ left: size - 8, top: size / 2 - 8, position: 'absolute' }}
			port={node.getPort(PortModelAlignment.RIGHT)}
			engine={engine}>
			<Port />
		</PortWidget>
		<PortWidget
			style={{ left: size / 2 - 8, top: size - 8, position: 'absolute' }}
			port={node.getPort(PortModelAlignment.BOTTOM)}
			engine={engine}>
			<Port />
		</PortWidget>
	</div>
);

export class DiamondNodeFactory extends AbstractReactFactory<DiamondNodeModel, DiagramEngine> {
	constructor() {
		super('diamond');
	}

	generateReactWidget(event: any): JSX.Element {
		return <DiamondNodeWidget engine={this.engine} size={50} node={event.model} />;
	}

	generateModel(event: any) {
		return new DiamondNodeModel();
	}
}

export class SimplePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel) {
		super(type);
		this.cb = cb;
	}

	generateModel(event: any): PortModel {
		return this.cb(event.initialConfig);
	}
}
