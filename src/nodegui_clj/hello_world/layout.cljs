(ns nodegui-clj.hello-world.layout
  (:require ["@nodegui/react-nodegui" :refer (View, Text, Button)]
            [nodegui-clj.hello-world.canvas :refer (canvas)]))


(def containerStyle "
  background-color: '#222';
  flex-grow: 1;
")

(def headerStyle "
  padding: 10px;
")

(def editorStyle "
  flex: 1;
  flex-direction: 'row';
")

(def sideBarStyle "
  padding: 20px;
  background-color: '#333';
  width: 300px;
")

(def textStyle "
  color: '#fff';
  padding-right: 20px;
")

(def btnStyle "
  margin-top: 10px;
  padding: 10px;
")


(defn layout []
  ; (defn useEventHandler<QPushButtonSignals>({}, []))
  (def btnEvents { :clicked #(println "https://creativelogic.me") })

  ; const [nodes, dispatch] = useReducer(reducer, {
  ;   '1': { x: 20, y: 10, inputs: [{ index: 0, value: 'input_0' }], outputs: [{ index: 0, value: 'output_0' }, { index: 1, value: 'output_1', links: [{ nodeId: '2', inputIndex: 1 }] }] },
  ;   '2': { x: 300, y: 200, inputs: [{ index: 0, value: 'input_0' }, { index: 1, value: 'input_1' }], outputs: [{ index: 0, value: 'output_0', links: [{ nodeId: '3', inputIndex: 2 }] }] },
  ;   '3': { x: 700, y: 500, inputs: [{ index: 0, value: 'input_0' }, { index: 1, value: 'input_1' }, { index: 2, value: 'input_2' }], outputs: [{ index: 0, value: 'output_0' }] },
  ; });

  [:> View {:style containerStyle}
    [:> View {:style headerStyle}
      [:> Text {:style textStyle :children "<h1>Node Editor</h1>"}]]
    [:> View {:style editorStyle}
      [canvas {} #(println %)]
      [:> View {:style sideBarStyle}
        [:> Text {:style textStyle :wordWrap true :children "<h2>Name</h2>"}]
        [:> Button {:style btnStyle :on btnEvents :text "Compile Graph"}]]]]
)
