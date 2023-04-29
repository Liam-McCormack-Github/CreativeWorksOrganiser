
window.jQuery = window.$ = require('jquery'); 

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



function updateLoginSelectorFromDB(db) {
  const rows = db.prepare('SELECT "username", "selected" FROM AO3Login;').all();

  for (const row of rows) {
    ao3_username = Object.values(row)[0];
    ao3_selected_account = Object.values(row)[1];
    let newOption = $('<option>');
    newOption.val(`${ao3_username}`).text(`${ao3_username}`);

    if (ao3_selected_account === 1) {
      newOption.val(`${ao3_username}`).prop('selected', true);
    }

    $('#select-credentials').append(newOption);
  }
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


    // Links
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

    // AO3 Login
    
    const registerLoginBtn = document.getElementById('add-login-to-db');
    const removeLoginBtn = document.getElementById('remove-login-from-db');
    const selectLoginSel = document.getElementById('select-credentials');

    dbLocation = path.join(appStoragePath, 'Data/Storage/index.db');
    const db = require('better-sqlite3')(dbLocation);

    
    updateLoginSelectorFromDB(db);

    registerLoginBtn.addEventListener('click', () => {
      const ao3_username = document.querySelector('#input-username').value;
      const ao3_password = document.querySelector('#input-password').value;

      const insertQuery = db.prepare('INSERT OR REPLACE INTO AO3Login ("username", "password", "selected") VALUES (?, ?, ?)');
      insertQuery.run(ao3_username, ao3_password, 1);

      const updateQuery = db.prepare('UPDATE AO3Login SET "selected" = 0 WHERE "username" != ?');
      updateQuery.run(ao3_username);

      updateLoginSelectorFromDB(db);
    });

    removeLoginBtn.addEventListener('click', () => {
      const selectedValue = $('#select-credentials').val();
      const deleteQuery = db.prepare('DELETE FROM AO3Login WHERE "username" = ?');
      deleteQuery.run(selectedValue);
      location.reload();
    });

    selectLoginSel.addEventListener('change', (event) => {
      const selectedOption = event.target.value;
      const updateQuery = db.prepare('UPDATE AO3Login SET "selected" = (CASE username WHEN ? THEN 1 ELSE 0 END)');
      updateQuery.run(selectedOption);
    });
}

// Call Functions
asyncMain();
getGlobalVariables();
console.log('settings!');