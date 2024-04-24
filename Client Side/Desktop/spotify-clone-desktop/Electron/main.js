const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    title: "SYNK",
    minHeight: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "rgba(0,0,0,0)",
      symbolColor: "#ffffff",
    },
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
      
    }
  })

  // and load the index.html of the app.
  if(app.isPackaged){
    win.loadURL(`file://${__dirname}/build/index.html`)
  } else {
    win.loadURL('http://localhost:5173/')
  }
}

app.whenReady().then(createWindow)