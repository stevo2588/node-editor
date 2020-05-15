import { Fiber } from 'react-reconciler';
import { registerComponent, ComponentConfig } from '@nodegui/react-nodegui/dist/components/config';
import { AppContainer } from '@nodegui/react-nodegui/dist/reconciler';
import {
  QColor,
  QPainter,
  RenderHint,
  WidgetEventTypes,
  QPainterPath,
  QPen,
  PenStyle,
  PenCapStyle
} from "@nodegui/nodegui";

import { RNBezier, BezierProps } from './RNBezier';


const calcControl = (portAlignment: 'left'|'right'|'top'|'bottom', curvyness: number): { x: number, y: number } => {
  if (portAlignment === 'right') {
    return { x: curvyness, y: 0 };
  } else if (portAlignment === 'left') {
    return { x: -curvyness, y: 0 };
  } else if (portAlignment === 'top') {
    return { x: 0, y: -curvyness };
  }
  return { x: 0, y: curvyness };
}

const drawBezier = (painter: QPainter, x1: number, y1: number, x2: number, y2: number, thickness: number) => {
  const painterPath: QPainterPath = new QPainterPath();
  painterPath.moveTo(x1, y1);
  const ctrl1 = calcControl('right', 75);
  const ctrl2 = calcControl('left', 75);
  painterPath.cubicTo(x1 + ctrl1.x, y1 + ctrl1.y, x2 + ctrl2.x, y2 + ctrl2.y, x2, y2);
  const pen = new QPen();
  pen.setStyle(PenStyle.SolidLine);
  pen.setCapStyle(PenCapStyle.RoundCap);
  pen.setColor(new QColor(255, 128, 128));
  pen.setWidth(thickness);
  painter.setPen(pen);
  painter.drawPath(painterPath);
}


class ViewConfig extends ComponentConfig {
  tagName = RNBezier.tagName;

  shouldSetTextContent() {
    return false;
  }
  
  createInstance(
    newProps: BezierProps,
    rootInstance: AppContainer,
    context: any,
    workInProgress: Fiber,
  ): RNBezier {
    const widget = new RNBezier();
    widget.setProps(newProps, {});

    widget.addEventListener(WidgetEventTypes.Paint, (event) => {
      const offset = 8;
      const lineWidth = 6;
      const halfLineWidth = lineWidth / 2;
      const widthPadding = 16; // should be based on bezier curviness

      const painter = new QPainter(widget);
      painter.setRenderHint(RenderHint.Antialiasing);

      const width = widget.geometry().width();
      const height = widget.geometry().height();
      if (widget.props?.startPoint && widget.props.endPoint) {
        let x1;
        let y1;
        let x2;
        let y2;
        if (widget.props?.startPoint.x < widget.props?.endPoint.x) {
          x1 = offset + widthPadding;
          x2 = width - (offset + widthPadding);
        } else {
          x1 = width - (offset + widthPadding);
          x2 = offset + widthPadding;
        }
        if (widget.props?.startPoint.y < widget.props?.endPoint.y) {
          y1 = offset - halfLineWidth;
          y2 = height - (offset + halfLineWidth);
        } else {
          y1 = height - (offset + halfLineWidth);
          y2 = offset - halfLineWidth; 
        }

        drawBezier(painter, x1, y1, x2, y2, lineWidth);
      }

      painter.end();
    });

    return widget;
  }
  
  commitMount(
    instance: RNBezier,
    newProps: BezierProps,
    internalInstanceHandle: any,
  ): void {
    if (newProps.visible !== false) {
      instance.show();
    }
    return;
  }

  finalizeInitialChildren(
    instance: RNBezier,
    newProps: BezierProps,
    rootContainerInstance: AppContainer,
    context: any
  ): boolean {
    return true;
  }
  
  commitUpdate(
    instance: RNBezier,
    updatePayload: any,
    oldProps: BezierProps,
    newProps: BezierProps,
    finishedWork: Fiber,
  ): void {
    instance.setProps(newProps, oldProps);
  }
}

export const Bezier = registerComponent<BezierProps>(new ViewConfig());
