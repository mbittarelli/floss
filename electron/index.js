'use strict';

const fs = require('fs');
const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');

// Path to the html render
const htmlPath = path.join(__dirname, 'index.html');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Get the configuration path 
const configPath = path.join(app.getPath('userData'), 'config.json');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow.bind(this));

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {

    let args = JSON.parse(process.argv.slice(2)[0]);
    
    // Get the window bounds
    const options = restoreBounds();

    options.show = args.debug;

    // Create the browser window.
    mainWindow = new BrowserWindow(options);

    ipcMain.on('mocha-done', function() {
        process.exit(0);
    });

    ipcMain.on('mocha-error', function() {
        process.exit(1);
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + htmlPath);

    // Open the DevTools.
    mainWindow.webContents.openDevTools('bottom');

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('ping', JSON.stringify(args));
    });

    // Update bounds
    mainWindow.on('close', saveBounds);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

/**
 * Restore the bounds of the window.
 */
function restoreBounds(){
    let data;
    try {
        data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    catch(e) {
        // do nothing
    }

    if (data && data.bounds) {
        return data.bounds;
    }
    else {
        return {
            width: 1024,
            height: 768
        };
    }
}

/**
 * Save the bounds of the window.
 */
function saveBounds(){
    fs.writeFileSync(configPath, JSON.stringify({
        bounds: mainWindow.getBounds()
    }));
}