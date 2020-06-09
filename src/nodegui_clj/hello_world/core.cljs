(ns nodegui-clj.hello-world.core
  (:require [reagent.core :as r]
            ["@nodegui/react-nodegui" :refer (Renderer, Window, View, Text)]
            ["@nodegui/nodegui"       :refer (QIcon)]
            [nodegui-clj.hello-world.layout :refer [layout]]))


(def winIcon (QIcon. "./out/assets/nodegui.jpg"))
(def containerStyle "
  flex: 1;
  width: 1500px;
  height: 850px;
")

(def styleSheet "
  body {
    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;
    margin: auto;
    padding: 2rem;
  }

  html, body, #root {
    height: 100%;
    display: flex;
    flex-grow: 1;
    padding: 0;
    margin: 0;
  }

  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
")


(defn App []
  [:> Window {:windowTitle "Node Editor" :minSize {:width 1500 :height 850} :stylesheet styleSheet :windowIcon winIcon }
    [:> View {:style containerStyle}
      [layout ]]])

(defn main! []
  (.render Renderer (r/as-element [App])))

(defn reload!
  "Hot reloading"
  []
  (.render Renderer (r/as-element [App])))
