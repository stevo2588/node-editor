import React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';


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

export default ({ background, color, engine }: { background?: string, color?: string, engine: DiagramEngine }) => (
  <Container
    background={background || 'rgb(60, 60, 60)'}
    color={color || 'rgba(255,255,255, 0.05)'}
	>
    <CanvasWidget engine={engine} />
  </Container>
);
