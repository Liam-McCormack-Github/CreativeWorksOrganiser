
const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');
const { PythonShell } = require('python-shell');

const fs = require('fs');
const path = require('path');


// Global Vars
let appStoragePath, pythonVenvPath;
const def_globalVars = new EventEmitter();
const fileInput = document.getElementById('fileInput')

// Define Vars Via Electron IPC
function getGlobalVariables() {
  ipcRenderer.send('get-global-vals');
  ipcRenderer.on('recieve-global-val', (event, returnData) => { 
    appStoragePath = returnData.appStoragePath;  
    pythonVenvPath = returnData.pythonVenvPath; 
    def_globalVars.emit('DEF!globalVars');
  });
}

// Other Functions
function createWindowLaunchButtons() {
  const createWaitWindowFromURL = document.querySelector("#create-wait-window-btn-data-from-url");

  createWaitWindowFromURL.addEventListener('click', () => {
    let scriptSelection = "getLinksFromInputs";
    let scriptArgs = null;
    ipcRenderer.send('create-wait-window-for-long-script', { scriptSelection, scriptArgs });
  });
}


// Python Functions
function startPythonShell(scriptLocation, argv) {
  let pyshell = new PythonShell(scriptLocation, { pythonPath: pythonVenvPath, args: argv});

  pyshell.on('message', function(message) {
    console.log(message);
  })

  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    console.log('Python File Ran Successfully');
  });
}

async function asyncMain() {
  const promise1 = new Promise((resolve) => {
      def_globalVars.once('DEF!globalVars', () => {
          resolve('DEF!globalVars');
      });
  });

  // Wait for Promise to resolve
  const result = await promise1;
  console.log(result);
  // Promise Resolved Continue...
  createWindowLaunchButtons()
  scriptLocation = path.join(appStoragePath, 'Scripts/electron_copyFileToInputs.py');
  fileInput.addEventListener('change', (event) => {
    const fileList = event.target.files
    const filePath = fileList[0].path
    startPythonShell(scriptLocation,filePath);
  })
}

// Call Functions
asyncMain();
getGlobalVariables();
console.log("input!");
