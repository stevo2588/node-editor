import React from "react";
import { Bezier } from "./Bezier";


export default ({ start, end }: { start: { x: number; y: number }, end: { x: number; y: number }}) => {
  return <Bezier startPoint={start} endPoint={end} style={`
    position: absolute;
  `} />
};
