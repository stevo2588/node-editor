import React, { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import {
	DiagramEngine,
	LinkWidget,
	PointModel,
} from '@projectstorm/react-diagrams-core';
import { DefaultLinkPointWidget, DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { MiddlewareLinkModel } from '../../../../modules/graph/link';


interface MiddlewareLinkProps {
	link: MiddlewareLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded?: (point: PointModel, event: MouseEvent) => any;
}

interface MiddlewareLinkState {
	selected: boolean;
}

class MiddlewareLinkWidget extends React.Component<MiddlewareLinkProps, MiddlewareLinkState> {
	refPaths: React.RefObject<SVGPathElement>[];

	constructor(props: MiddlewareLinkProps) {
		super(props);
		this.refPaths = [];
		this.state = {
			selected: false
		};
	}

	componentDidUpdate(): void {
		this.props.link.setRenderedPaths(
			// @ts-ignore
			this.refPaths.map(ref => ref.current),
		);
	}

	componentDidMount(): void {
		this.props.link.setRenderedPaths(
			// @ts-ignore
			this.refPaths.map(ref => ref.current),
		);
	}

	componentWillUnmount(): void {
		this.props.link.setRenderedPaths([]);
	}

	addPointToLink(event: MouseEvent, index: number) {
		if (
			!event.shiftKey &&
			!this.props.link.isLocked() &&
			this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const point = new PointModel({
				link: this.props.link,
				position: this.props.diagramEngine.getRelativeMousePoint(event)
			});
			this.props.link.addPoint(point, index);
			event.persist();
			event.stopPropagation();
			this.forceUpdate(() => {
				this.props.diagramEngine.getActionEventBus().fireAction({
					event,
					model: point
				});
			});
		}
	}

	generatePoint(point: PointModel): JSX.Element {
		return (
			<DefaultLinkPointWidget
				key={point.getID()}
				point={point as any}
				colorSelected={this.props.link.getOptions().selectedColor || '#ffffff'}
				color={this.props.link.getOptions().color}
			/>
		);
	}

	generateLink(path: string, extraProps: any, id: string | number): JSX.Element {
		const ref = React.createRef<SVGPathElement>();
		this.refPaths.push(ref);
		return (
			<DefaultLinkSegmentWidget
				key={`link-${id}`}
				path={path}
				selected={this.state.selected}
				diagramEngine={this.props.diagramEngine}
				factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
				link={this.props.link}
				forwardRef={ref}
				onSelection={selected => {
					this.setState({ selected: selected });
				}}
				extras={extraProps}
			/>
		);
	}

	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		if (points.length === 2) {
			const svgPath = this.props.link.getSVGPath();
			if (!svgPath) throw new Error('No SVG path');
			paths.push(
				this.generateLink(
					svgPath,
					{
						// This enables clicks on links to add a point
						// onMouseDown: (event: any) => this.addPointToLink(event, 1),
					},
					'0'
				)
			);

			// draw the link as dangeling
			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[1]));
			}
		} else {
			//draw the multiple anchors and complex line instead
			for (let j = 0; j < points.length - 1; j++) {
				paths.push(
					this.generateLink(
						LinkWidget.generateLinePath(points[j], points[j + 1]),
						{
							'data-linkid': this.props.link.getID(),
							'data-point': j,
							onMouseDown: (event: MouseEvent) => {
								this.addPointToLink(event, j + 1);
							}
						},
						j
					)
				);
			}

			//render the circles
			for (let i = 1; i < points.length - 1; i++) {
				paths.push(this.generatePoint(points[i]));
			}

			if (this.props.link.getTargetPort() == null) {
				paths.push(this.generatePoint(points[points.length - 1]));
			}
		}

		return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

const Keyframes = keyframes`
	from {
		stroke-dashoffset: 24;
	}
	to {
		stroke-dashoffset: 0;
	}
`;

const selected = css`
	stroke-dasharray: 10, 2;
	animation: ${Keyframes} 1s linear infinite;
`;

const Path = styled.path<{ selected: boolean }>`
	${p => p.selected && selected};
	fill: none;
	pointer-events: all;
`;

export class MiddlewareLinkFactory<Link extends MiddlewareLinkModel = MiddlewareLinkModel> extends AbstractReactFactory<
	Link,
	DiagramEngine
> {
	constructor(type = 'default') {
		super(type);
	}

	generateReactWidget(event: any): JSX.Element {
		return <MiddlewareLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event: any): Link {
		return new MiddlewareLinkModel() as Link;
	}

	generateLinkSegment(model: Link, selected: boolean, path: string) {
		return (
			<Path
				selected={selected}
				stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
				strokeWidth={model.getOptions().width}
				d={path}
			/>
		);
	}
}
