import React from "react";
import { Bezier } from "./Bezier";


export default ({ start, end }: { start: { x: number; y: number }, end: { x: number; y: number }}) => {
  let startX = Math.min(start.x, end.x);
  let endX = Math.max(start.x, end.x);
  let startY = Math.min(start.y, end.y);
  let endY = Math.max(start.y, end.y);

  if (start.x < end.x) {
    startX -= 8;
  } else {
    endX += 8;
  }
  if (start.y < end.y) {
    startY -= 8;
  } else {
    endY += 8;
  }

  return <Bezier startPoint={start} endPoint={end} style={`
    position: absolute;
    left: ${startX}px;
    top: ${startY}px;
    width: ${endX - startX}px;
    height: ${endY - startY}px;
    min-width: 10px;
    min-height: 10px;
  `} />
};
