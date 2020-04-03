import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import ContextMenu from './context-menu';


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

const Overlay = styled.div`
  display: block;
	position: fixed;
	top: 0;
	bottom: 0;
`;

export default ({ background, color, engine }: { background?: string, color?: string, engine: DiagramEngine }) => {
	const [mouseX, setMouseX] = useState(0);
	const [mouseY, setMouseY] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

	return (
		<Container
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
			<CanvasWidget engine={engine} />
			{/* <Overlay /> */}
			{showMenu && <ContextMenu x={mouseX} y={mouseY} />}
		</Container>
	);
}
