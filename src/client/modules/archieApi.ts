// NOTE: `api` is exposed through preload script
const { api } = window;


// api.send("toMain", "saveFile", fileName, fileContents);

// api.receive("fromMain", (data) => {
//   console.log(`Received ${data} from main process`);
// });

export default {
  async saveFile(fileName: string, fileContents: string) {
    return api.invoke("toMain", "saveFile", fileName, fileContents);
  },
  async loadFile(fileName: string) {
    return api.invoke("toMain", "loadFile", fileName);
  },
  async codeGen(graph: any) {
    return api.invoke("toMain", "codeGen", graph);
  },
  async build(graph: any) {
    return api.invoke("toMain", "build", graph);
  },
  async provision(graph: any) {
    return api.invoke("toMain", "provision", graph);
  },
  async deploy(graph: any) {
    return api.invoke("toMain", "deploy", graph);
  },
};
