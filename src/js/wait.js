const { EventEmitter }= require('events');
const { ipcRenderer } = require('electron');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const path = require('path');

// Global Vars
let appStoragePath, pythonScriptData, pythonVenvPath;
const def_globalVars = new EventEmitter();
const def_pythonScriptData = new EventEmitter();

// Define Vars Via Electron IPC
function getGlobalVariables() {
  ipcRenderer.send('get-global-vals');
  ipcRenderer.on('recieve-global-val', (event, returnData) => { 
    appStoragePath = returnData.appStoragePath;  
    pythonVenvPath = returnData.pythonVenvPath; 
    def_globalVars.emit('DEF!globalVars');
  });
}

ipcRenderer.on('variable-long-scipts', (event, returnData) => {
    pythonScriptData = returnData;
    def_pythonScriptData.emit('DEF!pythonScriptData');
});

// Other Functions


// Python Functions
function startPythonShell(scriptLocation, argv) {
  let pyshell = new PythonShell(scriptLocation, { pythonPath: pythonVenvPath, args: argv});

  pyshell.on('message', function(message) {
    console.log(message);
    if (message === "Python : input file found : False") {
      alert("Please Select a Valid Input File");
    }
    if (message === "Python : temp file found : False") {
      alert("Something Went Wrong Temp Files Not Found");
    }
  })

  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    console.log('Python File Ran Successfully');
    ipcRenderer.send('close-wait-window');
  });
}

// Main Function
async function asyncMain() {
    const promise1 = new Promise((resolve) => {
        def_globalVars.once('DEF!globalVars', () => {
            resolve('DEF!globalVars');
        });
    });
    
    const promise2 = new Promise((resolve) => {
        def_pythonScriptData.once('DEF!pythonScriptData', () => {
            resolve('DEF!pythonScriptData');
        });
    });
    
    // Wait for both Promises to resolve
    const [result1, result2] = await Promise.all([promise1, promise2]);

    console.log(`Received events: ${result1} and ${result2}`);
    

    switch (pythonScriptData.scriptSelection) {
        case 'getLinksFromInputs':
          scriptLocation = path.join(appStoragePath, 'Scripts/electron_getLinksFromInputs.py');
          startPythonShell(scriptLocation,pythonScriptData.scriptArgs);
          break;
        case 'fetchDataFromInternet':
            scriptLocation = path.join(appStoragePath, 'Scripts/electron_fetchDataFromInternet.py');
            startPythonShell(scriptLocation,pythonScriptData.scriptArgs);
          break;
        case 'downloadWorkFromInternet':
            scriptLocation = path.join(appStoragePath, 'Scripts/electron_downloadWorkFromInternet.py');
            startPythonShell(scriptLocation,pythonScriptData.scriptArgs);
          break;
        default:
          console.log('Unknown fruit.');
          break;
    }
}

// Call Functions
asyncMain();
getGlobalVariables();
console.log("wait!");

