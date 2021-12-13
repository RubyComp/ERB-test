// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: {
//     myPing() {
//       ipcRenderer.send('ipc-example', 'ping');
//     },
//     on(channel, func) {
//       const validChannels = ['ipc-example'];
//       if (validChannels.includes(channel)) {
//         // Deliberately strip event as it includes `sender`
//         ipcRenderer.on(channel, (event, ...args) => func(...args));
//       }
//     },
//     once(channel, func) {
//       const validChannels = ['ipc-example'];
//       if (validChannels.includes(channel)) {
//         // Deliberately strip event as it includes `sender`
//         ipcRenderer.once(channel, (event, ...args) => func(...args));
//       }
//     },
//   },
// });
// const { ipcMain } = require('electron');

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg); // prints "ping"
//   event.reply('asynchronous-reply', 'pong');
// });

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg); // prints "ping";
//   event.returnValue = 'pong';
// });
