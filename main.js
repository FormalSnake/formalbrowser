// include the Node.js 'path' module at the top of your file
const path = require("path");
const { autoUpdater } = require("electron-updater");

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
  // This checks if there is a new version available, and notifies it to the process
  autoUpdater.checkForUpdatesAndNotify();
  // When there is an update available, it changes the window to the updating screen
  autoUpdater.on("update-available", function() {
    mainWindow.loadURL(`file://${__dirname}/updater/updater.html`);
  });

  // When the update has been downloaded, it quits the application and installs it
  autoUpdater.on("update-downloaded", (updateInfo) => {
    setTimeout(() => {
      autoUpdater.quitAndInstall();
      app.exit();
    }, 10000);
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
