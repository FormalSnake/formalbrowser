const { contextBridge, ipcRenderer } = require("electron");

// Expose the `require` function to the renderer process
contextBridge.exposeInMainWorld("require", require);

// Expose the `send` function of `ipcRenderer` to the renderer process
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
});
