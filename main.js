// include the Node.js 'path' module at the top of your file
const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    vibrancy: "hud",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 20 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
ipcMain.on("get-dirname", (event) => {
  event.sender.send(
    "get-dirname-response",
    path.join(app.getAppPath(), "pages", "newtab")
  );
});
try {
  require("electron-reloader")(module);
} catch (_) { }
