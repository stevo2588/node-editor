(ns nodegui-clj.hello-world.canvas 
  (:require [reagent.core :as r]
            [goog.object :as gob]
            ["@nodegui/nodegui" :refer (ContextMenuPolicy, QMenu, QAction, QPoint, WidgetEventTypes, QMouseEvent, MouseButton)]
            ["@nodegui/react-nodegui" :refer (View)]))


(def graphStyle "
  background-color: '#444';
  flex: 1;")

(def PortLabel "
  display: flex;
  flex-direction: 'row';
  margin-top: 1px;
  align-items: 'center';")

(def Label "
  color: '#fff';
  padding: 0 5px;
  flex-grow: 1;")

(def Port "
  width: 20px;
  height: 20px;
  margin: 3px 3px;
  border-radius: 6px;
  background-color: rgb(255, 128, 128);")

(def NodeStyle "
  position: absolute;
  font-family: sans-serif;
  color: white;
  overflow: visible;
  font-size: 11px;
  border-radius: 10px;
  border-style: solid;
  border-width: 5px;
  border-color: '#000';
  background-color: '#222';")

(def Title "
  background: rgba(0, 0, 0, 0.3);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  white-space: nowrap;")

(def TitleName "
  flex-grow: 1;
  padding: 5px 5px;
  color: '#fff';")

(def Config "
  padding: 2px 5px;
  margin: 3px 3px;
  margin-left: 8px;
  display: inline-block;
  color: white;
  background-color: transparent;
  font-size: 1em;
  border: 0px;
  border-radius: 3px;
  display: block;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: rgba(255, 255, 255, 0.1);
    color: black;
  }")

(def Content "
  display: flex;
  flex-direction: row;")

(defn PortsContainer [input] str "
  display: flex;
  flex-direction: column;
  align-items: flex-" (if input "start" "end") ";")

(def BodyContainer "
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;")

(def NodePortStyle "
  flex-direction: column;")

(def ComboBoxStyle "
QComboBox {
    border: 1px solid black;
    border-radius: 3px;
    padding: 1px 18px 1px 3px;
    width: 25em;
    background-color: black;
}

QComboBox::drop-down {
    subcontrol-origin: padding;
    subcontrol-position: top right;
    width: 25px;

    border-top-right-radius: 3px; /* same radius as the QComboBox */
    border-bottom-right-radius: 3px;
}

QComboBox::down-arrow {
  image: url(/something);
}")


(defn canvas [nodes dispatch]
  (let [!canvasEl (clojure.core/atom nil)
        position (r/atom {:x 0 :y 0})
        globalPosition (r/atom {:x 0 :y 0})
        mouseDown (r/atom false)
        lastPress (r/atom {:x 0 :y 0})
        dragging (r/atom nil)

        canvasEvents (js-obj ; useEventHandler<QWidgetSignals>({
          "customContextMenuRequested" (fn [pos] 
            (let [ctxMenu (QMenu. @!canvasEl)
                  action (QAction. @!canvasEl)]
            (.setText action "Add Node")
            (.addEventListener action "triggered" (fn [] (dispatch { :type "add_node" :data { :x 50 :y 50 :inputs () :outputs () } })))
            (.addAction ctxMenu action)
            (.exec ctxMenu (.mapToGlobal @!canvasEl (QPoint. (.-x pos) (.-y pos))))))

          (.-MouseMove WidgetEventTypes) (fn [nativeEvt] 
            (let [mouseEvt (QMouseEvent. nativeEvt)]
            (if ((.button mouseEvt) == (.-RightButton MouseButton)) nil (
              (swap! position { :x (.x mouseEvt) :y (.y mouseEvt) })
              (swap! globalPosition { :x (.globalX mouseEvt) :y (.globalY mouseEvt) })
              (if dragging
                (dispatch { :type "update_node" :data (merge (gob/get nodes dragging) { :x (.x mouseEvt) :y (.y mouseEvt) }) :id dragging })
                nil)))))

          (.-MouseButtonPress WidgetEventTypes) (fn [nativeEvt] 
            (let [mouseEvt (QMouseEvent. nativeEvt)]
            (if ((.button mouseEvt) == (.-RightButton MouseButton)) nil (
              (swap! mouseDown true)
              (swap! position { :x (.x mouseEvt) :y (.y mouseEvt) })
              (swap! globalPosition { :x (.globalX mouseEvt) :y (.globalY mouseEvt) })
              (swap! lastPress { :x (.x mouseEvt) :y (.y mouseEvt) })))))

          (.-MouseButtonRelease WidgetEventTypes) (fn [nativeEvt]
            (let [mouseEvt (QMouseEvent. nativeEvt)]
            (if ((.button mouseEvt) == (.-RightButton MouseButton)) nil (swap! mouseDown false)))))]
          ;   }, [position, portPress, lastPress, globalPosition]);

    (r/create-class
      {:component-did-mount
      (fn [] (.setContextMenuPolicy @!canvasEl (.-CustomContextMenu ContextMenuPolicy)))
      :reagent-render
      (fn []
        [:> View {:style graphStyle :ref #(reset! !canvasEl %) :on canvasEvents }])})))

; export const Canvas = ({ nodes, dispatch }: {
;   nodes: { [id: string]: Node };
;   dispatch: (a: any) => void;
; }) => {
;   const [portPress, setPortPress] = useState<{ x: number, y: number }|null>(null);
;   const [dragPayload, setDragPayload] = useState<any>();
;   const [size, setSize] = useState<{ [id: string]: { width: number; height: number }}>();

;   return (
;     <View style={graphStyle} on={handler} ref={canvasEl}>
;       {Object.keys(nodes).map((k) =>
;         <Draggable
;           id={k}
;           key={k}
;           position={{ x: nodes[k].x, y: nodes[k].y }}
;           inputs={nodes[k].inputs}
;           outputs={nodes[k].outputs}
;           additionalInputs={['test_input_01', 'test_input_02']}
;           additionalOutputs={['test_output']}
;           disableDrag={!!portPress}
;           onDrag={() => setDragging(k)}
;           onEndDrag={() => setDragging(null)}
;           onPortPress={(payload, offset) => {
;             setPortPress({ x: globalPosition.x, y: globalPosition.y });
;             setDragPayload(payload);
;           }}
;           onPortRelease={(pos) => {
;             setMouseDown(false);
;             setGlobalPosition({ x: pos.x, y: pos.y });
;             setPortPress(null);
;             setDragPayload(null);
;           }}
;           onLink={(input: { nodeId: string, portId: number }, output: { nodeId: string, portId: number }) => {
;             dispatch({ type: 'link_nodes', input, output });
;           }}
;           onUnlink={(output: { nodeId: string, portId: number }) => {
;             dispatch({ type: 'unlink_nodes', output });
;           }}
;           onAddPort={(input: boolean, type: string) => {
;             dispatch({ type: 'add_port', id: k, input, portType: type });
;           }}
;           onResize={(width, height) => setSize({ ...size, [k]: { width, height } })}
;           mouseState={{ isDown: mouseDown, globalPos: { x: globalPosition.x, y: globalPosition.y } }}
;           dragPayload={dragPayload}
;         />
;       )}
;       {Object.keys(nodes).map((k) => (
;         nodes[k].outputs.map((p, i) => (
;           (p.links && size && size[k]) ? p.links.map((link: any) => (
;             <Link
;               key={`${k}-${i}-${link.nodeId}-${link.inputIndex}`}
;               start={{ x: nodes[k].x + size[k].width - 15, y: nodes[k].y + 67 + (i * 27) }}
;               end={{ x: nodes[link.nodeId].x + 15, y: nodes[link.nodeId].y + 67 + (link.inputIndex * 27) }}
;             />
;           )) : null)
;       ))).reduce((a, b) => [...a, ...b], [])}
;       {portPress && <Link start={lastPress} end={position} />}
;     </View>
;   );
; }
