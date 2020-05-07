import { Fiber } from 'react-reconciler';
import { registerComponent, ComponentConfig } from '@nodegui/react-nodegui/dist/components/config';
import { AppContainer } from '@nodegui/react-nodegui/dist/reconciler';
import {
  QColor,
  QPainter,
  QPoint,
  RenderHint,
  WidgetEventTypes
} from "@nodegui/nodegui";

import { RNBezier, BezierProps } from './RNBezier';


const drawLineSegment = (painter: QPainter, x1: number, y1: number, x2: number, y2: number, thickness: number) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  painter.drawConvexPolygon([
    new QPoint(x1 + thickness * Math.cos(angle + Math.PI / 2), y1 + thickness * Math.sin(angle + Math.PI / 2)),
    new QPoint(x1 + thickness * Math.cos(angle - Math.PI / 2), y1 + thickness * Math.sin(angle - Math.PI / 2)),
    new QPoint(x2 + thickness * Math.cos(angle - Math.PI / 2), y2 + thickness * Math.sin(angle - Math.PI / 2)),
    new QPoint(x2 + thickness * Math.cos(angle + Math.PI / 2), y2 + thickness * Math.sin(angle + Math.PI / 2)),
  ]);
}

const drawPolyLine = (painter: QPainter, points: { x: number; y: number }[], thickness: number) => {
  for (let i = 1; i < points.length; i++) {
    drawLineSegment(painter, points[i-1].x, points[i-1].y, points[i].x, points[i].y, thickness);
  }
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

    const hourColor = new QColor(255, 255, 255);

    widget.addEventListener(WidgetEventTypes.Paint, (event) => {
      const painter = new QPainter(widget);
      painter.setRenderHint(RenderHint.Antialiasing);

      painter.setPen(hourColor);
      painter.setBrush(hourColor);

      painter.save();
      const width = widget.geometry().width();
      const height = widget.geometry().height();
      if (widget.props?.startPoint && widget.props.endPoint) {
        let x1;
        let y1;
        let x2;
        let y2;
        if (widget.props?.startPoint.x < widget.props?.endPoint.x) {
          x1 = 8;
          x2 = width - 8;
        } else {
          x1 = width - 8;
          x2 = 8;
        }
        if (widget.props?.startPoint.y < widget.props?.endPoint.y) {
          y1 = 8;
          y2 = height - 8;
        } else {
          y1 = height - 8;
          y2 = 8;
        }

        drawPolyLine(painter, [{ x: x1, y: y1 }, { x: x2, y: y2 }], 4);
      }
      painter.restore();

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
