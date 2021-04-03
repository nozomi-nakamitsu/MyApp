"use strict";

// index.js(main process)
// -GUI(renderer process)



const electron = require("electron");
const app =electron.app;
const BrowserWindow =electron.BrowserWindow;
const Menu=electron.Menu;
const dialog=electron.dialog;
const ipcMain=electron.ipcMain;





let mainWindow;
let settingsWindow;
// let backgroundcolor="skyblue";

let menuTemplate=[{
label: "MyApp",
submenu:[
    {label: 'About', accelerator: 'CmdOrCtrl+Shift+A', click: function() { showAboutDialog(); } },
    {type: "separator"},
    {label: 'Settings', accelerator: 'CmdOrCtrl+,', click: function() { showSettingsWindow(); }  },
    {type: "separator"},
    {label: "Quit",accelerator: "CmdOrCtrl+Q", click:
    function(){app.quit();}}
]
}];

let menu=Menu.buildFromTemplate(menuTemplate);
ipcMain.on("settings_changed", function(event,color){
    mainWindow.webContents.send("set_bgcolor",color);
});
function showAboutDialog(){
    dialog.showMessageBox({
    type: "info",
    buttun:["OK"],
    message: "About This App",
    detail: "This app was created by nozomi",

    });
}

function  showSettingsWindow(){
   settingsWindow=new BrowserWindow({width:600,height: 400,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }});
   settingsWindow.loadURL("file://"+ __dirname + "/settings.html");
   settingsWindow.webContents.openDevTools();
   settingsWindow.show();
   settingsWindow.on("closed",function(){
       settingsWindow=null;
    });
    // ipcMain.on("get_bgcolor",function(event){
    //     event.returnValue = backgroundcolor;
    // })
}


// ipcMain.on("bgcolor_changed", function(event,color){
//     backgroundcolor=color;
// });



function  createMainWindow(){
    Menu.setApplicationMenu(menu);
    mainWindow=new BrowserWindow({width:600,height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });
    mainWindow.loadURL("file://"+ __dirname + "/index.html");
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed",function(){
        mainWindow=null;
    });
}

app.on("ready",function (){
    // create window
    createMainWindow();
});

app.on("window-all-closed",function (){
if(process.platform !== "darwin"){
    app.quit();
}
});

app.on("activate",function (){
  if(mainWindow === null){
    createMainWindow();
  }
});
