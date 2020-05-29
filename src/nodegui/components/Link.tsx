import React from "react";
import { Bezier } from "./Bezier";
import { View } from "@nodegui/react-nodegui";


const offset = 8;
const widthPadding = 16;

export default React.memo(({ start, end }: { start: { x: number; y: number }, end: { x: number; y: number }}) => {
  const startX = Math.min(start.x, end.x) - (offset + widthPadding);
  const endX = Math.max(start.x, end.x) + (offset + widthPadding);
  const startY = Math.min(start.y, end.y) - offset;
  const endY = Math.max(start.y, end.y) + offset;
  const width = endX - startX;
  const height = endY - startY;

  return <Bezier startPoint={start} endPoint={end} style={`
    position: absolute;
    left: ${startX}px;
    top: ${startY}px;
    width: ${width}px;
    height: ${height}px;
  `} />
});
