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
};
