const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');
// const datatables_editor = require( 'datatables.net-editor' )( window, $ );
const fs = require('fs');
const path = require('path');

// Global Vars
let appStoragePath;
const def_globalVars = new EventEmitter();




// Define Vars Via Electron IPC
function getGlobalVariables() {
  ipcRenderer.send('get-global-vals');
  ipcRenderer.on('recieve-global-val', (event, returnData) => { 
    appStoragePath = returnData.appStoragePath; 
    def_globalVars.emit('DEF!globalVars');
  });
}

// Other Functions

function updateFileContents(logLocation) {
    let fileContentsDiv = document.getElementById('file-contents');

    fs.readFile(logLocation, 'utf8', function(err, fileContent) {
        if (err) throw err;
        fileContentsDiv.textContent = fileContent;
    });
}



// Main Function
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

    logLocation = path.join(appStoragePath, 'Data/Log/log.txt');
    // read the file asynchronously
    updateFileContents(logLocation);

    // watch for changes to the log file and update the content of the text element
    fs.watch(logLocation, (eventType, filename) => {
        if (eventType === 'change') {
            updateFileContents(logLocation);
        }
    });
}


// Call Functions
asyncMain();
getGlobalVariables();
console.log("log!");