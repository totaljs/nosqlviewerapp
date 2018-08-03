const net = require('net');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const windowStateKeeper = require('electron-window-state');
const path = require('path');

let mainWindow;

module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app.asar', 'node_modules'));

function getPort(cb, port = 32871) {
        var server = net.createServer()
        server.listen(port, function () {
          server.once('close', () => cb(port))
          server.close()
        })
        server.on('error', () => getPort(cb, port += 1))
}

function createWindow() {
    var mainWindowState = windowStateKeeper({defaultWidth: 1280, defaultHeight: 768});
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {nodeIntegration: false}
    });
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindowState.manage(mainWindow);
    getPort(function(port) {
        global.F === undefined && require('total.js').http('release', {ip: '127.0.0.1', port});
        ON('ready', () => mainWindow.loadURL('http://127.0.0.1:{0}/'.format(port)));
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => mainWindow === null && createWindow());