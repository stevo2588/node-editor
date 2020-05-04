import Api from '../shared/api';

import * as wasm from "../../rust/wasm/pkg";


export default class implements Api {
  async hello() {
    return wasm.hello();
  }
};
