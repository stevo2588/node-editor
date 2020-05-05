import { Fiber } from 'react-reconciler';
import { registerComponent, ComponentConfig } from '@nodegui/react-nodegui/dist/components/config';
import { AppContainer } from '@nodegui/react-nodegui/dist/reconciler';
import {
  FlexLayout,
  PenStyle,
  QColor,
  QPainter,
  QPoint,
  RenderHint,
  WidgetEventTypes
} from "@nodegui/nodegui";

import { RNBezier, BezierProps } from './RNBezier';


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
    widget.setProps(newProps, { pos: { x: 250, y: 250 }, startPoint: {x:10,y:10}, endPoint: {x:20,y:20}});

    // const center = new QWidget();
    const layout = new FlexLayout();
    const hourHand = [new QPoint(7, 8), new QPoint(-7, 8), new QPoint(0, -40)];
    const minuteHand = [new QPoint(7, 8), new QPoint(-7, 8), new QPoint(0, -70)];
    const secondHand = [new QPoint(4, 8), new QPoint(-4, 8), new QPoint(0, -70)];
    const hourColor = new QColor(127, 0, 127);
    const minuteColor = new QColor(0, 127, 127, 191);
    const secondColor = new QColor(0, 0, 0);

    widget.setLayout(layout);
    widget.resize(200, 200);
    const side = Math.min(widget.geometry().width(), widget.geometry().height());
    console.log(side);

    function repaint(): void {
      widget.repaint();
      setTimeout(repaint, 1000);
    }

    setTimeout(repaint, 1000);
    widget.addEventListener(WidgetEventTypes.Paint, () => {
      const time = new Date();

      const painter = new QPainter(widget);
      painter.setRenderHint(RenderHint.Antialiasing);
      painter.translate(widget.geometry().width() / 2, widget.geometry().height() / 2);
      painter.scale(side / 200.0, side / 200.0);

      painter.setPen(PenStyle.NoPen);
      painter.setBrush(hourColor);

      painter.save();
      painter.rotate(30.0 * (time.getHours() + time.getMinutes() / 60.0));
      painter.drawConvexPolygon(hourHand);
      painter.restore();

      painter.setPen(hourColor);

      for (let i = 0; i < 12; ++i) {
        painter.drawLine(88, 0, 96, 0);
        painter.rotate(30.0);
      }

      painter.setPen(PenStyle.NoPen);
      painter.setBrush(minuteColor);

      painter.save();
      painter.rotate(6.0 * (time.getMinutes() + time.getSeconds() / 60.0));
      painter.drawConvexPolygon(minuteHand);
      painter.restore();

      painter.setBrush(secondColor);
      painter.setPen(PenStyle.NoPen);

      painter.save();
      painter.rotate(360 * (time.getSeconds() / 60.0));
      painter.drawConvexPolygon(secondHand);
      painter.restore();

      painter.setPen(minuteColor);
      for (let j = 0; j < 60; ++j) {
        if (j % 5 != 0) {
          painter.drawLine(92, 0, 96, 0);
        }
        painter.rotate(6.0);
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
