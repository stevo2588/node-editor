
export type Node = {
  x: number;
  y: number;
  inputs: { index: number; value: string }[];
  outputs: { index: number; value: string; links?: { nodeId: string; inputIndex: number }[] }[];
}

type AddNodeAction = {
  type: 'add_node';
  data: Node;
}
type UpdateNodeAction = {
  type: 'update_node';
  id: string;
  data: Node;
}
type LinkNodesAction = {
  type: 'link_nodes';
  input: { nodeId: string, portId: number },
  output: { nodeId: string, portId: number },
}
type UnlinkNodesAction = {
  type: 'unlink_nodes';
  output: { nodeId: string, portId: number },
}
type AddPortAction = {
  type: 'add_port';
  id: string;
  input: boolean;
  portType: string;
}

export const reducer = (
    state: { [id: string]: Node },
    action: AddNodeAction | UpdateNodeAction | LinkNodesAction | UnlinkNodesAction | AddPortAction,
  ) => {
  switch (action.type) {
    case 'add_node':
      return { ...state, [Object.keys(state).length + 1]: action.data };
    case 'update_node':
      return { ...state, [action.id]: action.data };
    case 'link_nodes': {
      if (state[action.output.nodeId].outputs.find(o => 
        o.index === action.output.portId
        && o.links?.find(l => l.nodeId === action.input.nodeId && l.inputIndex === action.input.portId)
      )) return state;

      const obj = {
        ...state[action.output.nodeId],
        outputs: state[action.output.nodeId].outputs,
      };
      obj.outputs[action.output.portId] = {
        ...obj.outputs[action.output.portId],
        index: action.output.portId,
        links: [...(obj.outputs[action.output.portId].links || []), { nodeId: action.input.nodeId, inputIndex: action.input.portId }],
      };

      return { ...state, [action.output.nodeId]: obj };
    }
    case 'unlink_nodes': {
      const obj = {
        ...state[action.output.nodeId],
        outputs: state[action.output.nodeId].outputs,
      };
      obj.outputs[action.output.portId] = { index: action.output.portId, value: obj.outputs[action.output.portId].value };
      return { ...state, [action.output.nodeId]: obj };
    }
    case 'add_port': {
      const obj = { ...state[action.id] };
      if (action.input) {
        obj.inputs.push({ index: obj.inputs.length, value: action.portType });
      } else {
        obj.outputs.push({ index: obj.outputs.length, value: action.portType });
      }
      return { ...state, [action.id]: obj };
    }
    default:
      throw new Error('Unknown action');
  }
}

