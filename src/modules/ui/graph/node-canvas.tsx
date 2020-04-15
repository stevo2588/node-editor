import React, { useState, useEffect, useRef, useReducer, FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasEngine, TransformLayerWidget, SmartLayerWidget } from '@projectstorm/react-canvas-core';
import ContextMenu from '../context-menu';


export const Canvas = styled.div`
	position: relative;
	cursor: move;
	overflow: hidden;
`;

export const CanvasWidget: FunctionComponent<{ engine: CanvasEngine; className?: string }> = ({
	engine, className, children
}) => {
	const ref = useRef(null);
	const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

	useEffect(() => {
		const canvasListener = engine.registerListener({
			repaintCanvas: () => {
				forceUpdate();
			},
		});

		const keyDown = (event: any) => {
			engine.getActionEventBus().fireAction({ event });
		};
		const keyUp = (event: any) => {
			engine.getActionEventBus().fireAction({ event });
		};

		document.addEventListener('keyup', keyUp);
		document.addEventListener('keydown', keyDown);

		return () => {
			engine.deregisterListener(canvasListener);
			engine.setCanvas();

			document.removeEventListener('keyup', keyUp);
			document.removeEventListener('keydown', keyDown);
		}
	}, []);

	useEffect(() => {
		engine.setCanvas(ref.current || undefined);
		engine.iterateListeners(list => {
			list.rendered && list.rendered();
		});
	});

	const model = engine.getModel();

	return (
		<Canvas
			className={className}
			ref={ref}
			onWheel={(event: any) => {
				engine.getActionEventBus().fireAction({ event });
			}}
			onMouseDown={(e: any) => {
				if (e.nativeEvent.which !== 3) {
					engine.getActionEventBus().fireAction({ event: e });
				}
			}}
			onMouseUp={(e: any) => {
				if (e.nativeEvent.which !== 3) {
					engine.getActionEventBus().fireAction({ event: e });
				}
			}}
			onMouseMove={(event: any) => {
				engine.getActionEventBus().fireAction({ event });
			}}>
			{model.getLayers().map(layer => {
				return (
					<TransformLayerWidget layer={layer} key={layer.getID()}>
						<SmartLayerWidget layer={layer} engine={engine} key={layer.getID()} />
					</TransformLayerWidget>
				);
			})}
			{children}
		</Canvas>
	);
};


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
	background, color, engine, nodes, onAddProjectNode, onAddIntegrationNode, onAddContainerNode }: {
		background?: string,
		color?: string,
		engine: DiagramEngine,
		nodes: { name: string, onAddNode: (position: { x: number, y: number }) => void }[],
		onAddProjectNode: (position: { x: number, y: number }) => void,
		onAddIntegrationNode: (position: { x: number, y: number }) => void,
		onAddContainerNode: (position: { x: number, y: number }) => void,
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
						options={nodes}
						addProject={(node, pos) => onAddProjectNode(pos)}
						addService={(node, pos) => onAddIntegrationNode(pos)}
						addContainer={(node, pos) => onAddContainerNode(pos)}
					/>
				)}
			</CanvasWidget>
		</Container>
	);
}
