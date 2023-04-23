
const { EventEmitter } = require('events');
const { ipcRenderer, shell } = require('electron');


const fs = require('fs');
const path = require('path');


// Global Vars
let appStoragePath, appCodePath, pythonVenvPath;
const def_globalVars = new EventEmitter();

// Define Vars Via Electron IPC
function getGlobalVariables() {
  ipcRenderer.send('get-global-vals');
  ipcRenderer.on('recieve-global-val', (event, returnData) => { 
    appStoragePath = returnData.appStoragePath;  
    appCodePath = returnData.appCodePath;  
    pythonVenvPath = returnData.pythonVenvPath; 
    def_globalVars.emit('DEF!globalVars');
  });
}


// Other Functions
function displayLocations(div, text, path) {
    div.textContent = (text + path);

    const button = document.createElement('button');
    button.textContent = 'Open In Explorer';
    button.setAttribute('id', 'open-explorer');
    button.setAttribute('class', 'btn btn-primary');
    button.addEventListener('click', function() {
      ipcRenderer.send('open-path-explorer', { path });
    });
    div.appendChild(button);
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
    const downloadScriptsBtn = document.getElementById('download-scripts-btn');
    const openScriptsRepoBtn = document.getElementById('open-scripts-repo-btn');
    const openAppReleasesBtn = document.getElementById('download-app-btn');
    const openAppRepoBtn = document.getElementById('open-app-repo-btn');
  
    downloadScriptsBtn.addEventListener('click', () => {
      ipcRenderer.send('download-git-repo');
    });

    openScriptsRepoBtn.addEventListener('click', function() {
      url = 'https://www.github.com/Liam-McCormack-Github/CreativeWorksOrganiserScripts';
      ipcRenderer.send('open-link-in-browser', { url });
    });
    
    openAppReleasesBtn.addEventListener('click', function() {
      url = 'https://www.github.com/Liam-McCormack-Github/CreativeWorksOrganiser';
      ipcRenderer.send('open-link-in-browser', { url });
    });
    
    openAppRepoBtn.addEventListener('click', function() {
      url = 'https://www.github.com/Liam-McCormack-Github/CreativeWorksOrganiser/releases';
      ipcRenderer.send('open-link-in-browser', { url });
    });

    const div2 = document.getElementById('settings-div-2');
    const div3 = document.getElementById('settings-div-3');
    const div4 = document.getElementById('settings-div-4');

    displayLocations(div2, 'Path to Application Storage : ', appStoragePath);
    displayLocations(div3, 'Path to App Install : ',         appCodePath);
    displayLocations(div4, 'Path to Python Venv : ',         path.dirname(pythonVenvPath));
}

// Call Functions
asyncMain();
getGlobalVariables();
console.log('settings!');