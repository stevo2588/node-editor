import {
  NodeWidget,
  QWidgetSignals,
  QLabelSignals,
  NativeElement,
} from "@nodegui/nodegui";
import addon from "@nodegui/nodegui/dist/lib/utils/addon";
import { RNWidget } from '@nodegui/react-nodegui/dist/components/config';
import { ViewProps, setViewProps } from '@nodegui/react-nodegui/dist/components/View/RNView';
import { throwUnsupported } from '@nodegui/react-nodegui/dist/utils/helpers';
import { NodeFrame } from "@nodegui/nodegui/dist/lib/QtWidgets/QFrame";


export interface BezierProps extends ViewProps<QWidgetSignals> {
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
  children?: string;
}

const setBezierProps = (
  widget: RNBezier,
  newProps: BezierProps,
  oldProps: BezierProps,
) => {
  const setter: BezierProps = {
    set startPoint({ x, y }: { x: number; y: number }) {
      // const startX = Math.min(x, newProps.endPoint?.x || x);
      // const endX = Math.max(x, newProps.endPoint?.x || x);
      // const startY = Math.min(y, newProps.endPoint?.y || y);
      // const endY = Math.max(y, newProps.endPoint?.y || y);

      // widget.setGeometry(startX, startY, endX - startX, endY - startY);
      widget.repaint();
    },
    
    set endPoint({ x, y }: { x: number; y: number }) {
      // const startX = Math.min(x, newProps.startPoint?.x || x);
      // const endX = Math.max(x, newProps.startPoint?.x || x);
      // const startY = Math.min(y, newProps.startPoint?.y || y);
      // const endY = Math.max(y, newProps.startPoint?.y || y);

      // widget.setGeometry(startX, startY, endX - startX, endY - startY);
      widget.repaint();
    },
  };
  
  Object.assign(setter, newProps);
  setViewProps(widget, newProps, oldProps);
};

/**
 * @ignore
 */
export class RNBezier extends NodeFrame<QLabelSignals> implements RNWidget {
  native: NativeElement;
  props?: BezierProps;
  constructor();
  constructor(parent: NodeWidget<any>);
  constructor(parent?: NodeWidget<any>) {
      let native;
      if (parent) {
          native = new addon.QWidget(parent.native);
      } else {
          native = new addon.QWidget();
      }
      super(native);
      this.native = native;
      this.setNodeParent(parent);
  }

  setProps(newProps: BezierProps, oldProps: BezierProps): void {
    this.props = newProps;
    setBezierProps(this, newProps, oldProps);
  }

  appendInitialChild(child: NodeWidget<any>): void {
    throwUnsupported(this);
  }
  
  appendChild(child: NodeWidget<any>): void {
    throwUnsupported(this);
  }
  
  insertBefore(child: NodeWidget<any>, beforeChild: NodeWidget<any>): void {
    throwUnsupported(this);
  }
  
  removeChild(child: NodeWidget<any>): void {
    throwUnsupported(this);
  }
  
  static tagName = 'bezier';
}
