
const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');
const { PythonShell } = require('python-shell');

const fs = require('fs');
const path = require('path');

// Global Vars
let appStoragePath, pythonVenvPath;
const def_globalVars = new EventEmitter();
const loc_pythonScripts = new EventEmitter();


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
function startRedirect() {
  setTimeout(function() {
    location.href = "./html/log.html";
  }, 1000);
}


// Python Functions
function startPythonShell(scriptLocation) {
  let pyshell = new PythonShell(scriptLocation, { pythonPath: pythonVenvPath});

  pyshell.on('message', function(message) {
    console.log(message);
  })

  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    console.log('Python File Ran Successfully');
    startRedirect();
  });
}


function createButton() {
  const button = document.createElement("button");

  // Set the button's text content
  button.textContent = "Goto View Page";

  // Set the button's ID and class attributes
  button.setAttribute("id", "go-to-view");
  button.setAttribute("class", "btn btn-success");
  button.setAttribute("onclick", "window.location.href='./html/view.html'");
  // Add the button to the document body
  document.getElementById("indexTextBox").appendChild(button);
}

function addTextToCard(text) {
  const para = document.createElement("p");
  const node = document.createTextNode(text);
  para.appendChild(node);
  document.getElementById("indexTextBox").appendChild(para);
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
  const downloadBtn = document.querySelector('#download-btn');

  downloadBtn.addEventListener('click', () => {
    ipcRenderer.send('download-git-repo');
  });
  
  addTextToCard('Python Venv Created');
  addTextToCard('PIP Packages Downloaded to Venv');

  scriptLocation = path.join(appStoragePath, 'Scripts/electron_startup.py');
  fs.access(scriptLocation, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      addTextToCard('Scipt Files Not Located');
      ipcRenderer.send('download-git-repo');
      addTextToCard('Downloading Files!');
      ipcRenderer.on('downloaded-git-repo', (event) => { 
        loc_pythonScripts.emit('LOC!pythonScripts');
      });
      addTextToCard('Downloaded Files!');
    } else {
      addTextToCard('Scipt Files Located');
      loc_pythonScripts.emit('LOC!pythonScripts');
    }
  });

  loc_pythonScripts.once('LOC!pythonScripts', () => {
    createButton();
    startPythonShell(scriptLocation);
  });
}


// Call Functions
asyncMain();
getGlobalVariables();
console.log("render!");