import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasEngine, TransformLayerWidget, SmartLayerWidget } from '@projectstorm/react-canvas-core';
import ContextMenu from './context-menu';


export interface DiagramProps {
	engine: CanvasEngine;
	className?: string;
}

export const Canvas = styled.div`
	position: relative;
	cursor: move;
	overflow: hidden;
`;

export class CanvasWidget extends React.Component<DiagramProps> {
	ref: React.RefObject<HTMLDivElement>;
	keyUp: any;
	keyDown: any;
	canvasListener: any;

	constructor(props: DiagramProps) {
		super(props);

		this.ref = React.createRef();
		this.state = {
			action: null,
			diagramEngineListener: null
		};
	}

	componentWillUnmount() {
		this.props.engine.deregisterListener(this.canvasListener);
		this.props.engine.setCanvas();

		document.removeEventListener('keyup', this.keyUp);
		document.removeEventListener('keydown', this.keyDown);
	}

	registerCanvas() {
		this.props.engine.setCanvas(this.ref.current || undefined);
		this.props.engine.iterateListeners(list => {
			list.rendered && list.rendered();
		});
	}

	componentDidUpdate() {
		this.registerCanvas();
	}

	componentDidMount() {
		this.canvasListener = this.props.engine.registerListener({
			repaintCanvas: () => {
				this.forceUpdate();
			}
		});

		this.keyDown = (event: any) => {
			this.props.engine.getActionEventBus().fireAction({ event });
		};
		this.keyUp = (event: any) => {
			this.props.engine.getActionEventBus().fireAction({ event });
		};

		document.addEventListener('keyup', this.keyUp);
		document.addEventListener('keydown', this.keyDown);
		this.registerCanvas();
	}

	render() {
		const engine = this.props.engine;
		const model = engine.getModel();

		return (
			<Canvas
				className={this.props.className}
				ref={this.ref}
				onWheel={(event: any) => {
					this.props.engine.getActionEventBus().fireAction({ event });
				}}
				onMouseDown={(e: any) => {
					if (e.nativeEvent.which !== 3) {
						this.props.engine.getActionEventBus().fireAction({ event: e });
					}
				}}
				onMouseUp={(e: any) => {
					if (e.nativeEvent.which !== 3) {
						this.props.engine.getActionEventBus().fireAction({ event: e });
					}
				}}
				onMouseMove={(event: any) => {
					this.props.engine.getActionEventBus().fireAction({ event });
				}}>
				{model.getLayers().map(layer => {
					return (
						<TransformLayerWidget layer={layer} key={layer.getID()}>
							<SmartLayerWidget layer={layer} engine={this.props.engine} key={layer.getID()} />
						</TransformLayerWidget>
					);
				})}
				{this.props.children}
			</Canvas>
		);
	}
}

const Container = styled.div<{ color: string; background: string }>`
	background-color: rgb(60, 60, 60) !important;
	background-size: 50px 50px;
	display: flex;
	flex-grow: 1;
	> * {
		height: 100%;
		min-height: 100%;
		width: 100%;
	}
	background-image: linear-gradient(
			0deg,
			transparent 24%,
			${p => p.color} 25%,
			${p => p.color} 26%,
			transparent 27%,
			transparent 74%,
			${p => p.color} 75%,
			${p => p.color} 76%,
			transparent 77%,
			transparent
		),
		linear-gradient(
			90deg,
			transparent 24%,
			${p => p.color} 25%,
			${p => p.color} 26%,
			transparent 27%,
			transparent 74%,
			${p => p.color} 75%,
			${p => p.color} 76%,
			transparent 77%,
			transparent
		);
`;

export default ({
	background, color, engine, onAddProjectNode, onAddIntegrationNode }: {
		background?: string,
		color?: string,
		engine: DiagramEngine,
		onAddProjectNode: (position: { x: number, y: number }) => void,
		onAddIntegrationNode: (position: { x: number, y: number }) => void,
}) => {
	const [mouseX, setMouseX] = useState(0);
	const [mouseY, setMouseY] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

	return (
		<Container
			role="presentation"
			background={background || 'rgb(60, 60, 60)'}
			color={color || 'rgba(255,255,255, 0.05)'}
			onContextMenu={e => e.preventDefault()}
			onMouseDown={(e) => {
				if (e.nativeEvent.which === 3) {
					console.log(e.pageX);
					setMouseX(e.pageX);
					setMouseY(e.pageY);
					setShowMenu(true);
					e.preventDefault();
					e.stopPropagation();
				}
			}}
			onMouseUp={(e) => {
				if (e.nativeEvent.which === 3) {
					setShowMenu(false);
					e.preventDefault();
					e.stopPropagation();
				}
			}}
		>
			<CanvasWidget engine={engine}>
				{showMenu && (
					<ContextMenu
						x={mouseX}
						y={mouseY}
						addProject={(node, pos) => onAddProjectNode(pos)}
						addService={(node, pos) => onAddIntegrationNode(pos)}
					/>
				)}
			</CanvasWidget>
		</Container>
	);
}
