window.jQuery = window.$ = require('jquery'); 

const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');
const datatables = require( 'datatables.net-dt' )();
const datatables_fixedcolumns = require( 'datatables.net-fixedcolumns' )( window, $ );
const fs = require('fs');
const path = require('path');
const { addListener } = require('process');


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
function eventCheckAllBox() {
  const workSelectors = document.querySelectorAll("input.work-selector");
  workSelectors.forEach(selector => {
    selector.checked = !selector.checked;
  });
}

function createWindowLaunchButtons() {
  const createWaitWindowFromWeb = document.querySelector("#create-wait-window-btn-data-from-web");
  const createWaitWindowDownload = document.querySelector("#create-wait-window-btn-download");

  createWaitWindowFromWeb.addEventListener('click', () => {
    let scriptSelection = "fetchDataFromInternet";
    let scriptArgs = [];

    const workSelectors = document.querySelectorAll("input.work-selector");

    workSelectors.forEach(selector => {
      if (selector.checked) {
        scriptArgs.push(selector.name);
      }
    });

    if (scriptArgs.length > 0) {
      ipcRenderer.send('create-wait-window-for-long-script', { scriptSelection, scriptArgs });
    } else {
      alert("No Works Selected!")
    }
  });

  createWaitWindowDownload.addEventListener('click', () => {
    let scriptSelection = "downloadWorkFromInternet";
    let scriptArgs = [];
    
    const workSelectors = document.querySelectorAll("input.work-selector");
    const downloadFormat = document.getElementById("select-download-format").value;

    scriptArgs.push(downloadFormat);

    workSelectors.forEach(selector => {
      if (selector.checked) {
        scriptArgs.push(selector.name);
      }
    });
    
    if (scriptArgs.length > 0) {
      ipcRenderer.send('create-wait-window-for-long-script', { scriptSelection, scriptArgs });
    } else {
      alert("No Works Selected!")
    }
  });
}


function addListenerToDownloadBtn(path) {
  const button = document.getElementById('open-downloads-folder-btn');
  button.addEventListener("click", function() {
    ipcRenderer.send('open-path-explorer', { path });
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

    // Path defines
    dbLocation = path.join(appStoragePath, 'Data/Storage/index.db');
    downloadsLocation = path.join(appStoragePath, 'Storage');

    addListenerToDownloadBtn(downloadsLocation);
    createWindowLaunchButtons();
    const db = require('better-sqlite3')(dbLocation);
    const rows = db.prepare('SELECT * FROM IndexData;').all();

    if (rows.length === 0) {
      alert('Database Query Returned No Data!\nPlease Check That You Have Provided Valid Data Through The Input Page!');
      window.location.href='./input.html';
    }

    $(() => {
      // Setup - add a text input to each footer cell
      let tableBody = $('#example tbody');
    
      // Create a new row element and append it to the table body
      for (const row of rows) {
        let newRow = '<tr>';
        let userTags = 0;

        for (const value of Object.values(row)) {
          if (Object.values(row)[0] === value) {
            newRow += `<td><div class="postition_of_checkbox_control"><input class="form-check-input work-selector" type="checkbox" id="${value}" name="${value}" autocomplete="off"></div></td><td>${value}</td>`;
          } else if (Object.values(row)[9] === value && userTags === 0) {
            newRow += `<td><input class="userFiltersInput" type="text" value="${value}"/><span style="display:none;">${value}</span></td>`;
            userTags += 1;
          } else {
            newRow += `<td>${value}</td>`;
          }
        }
        newRow += '</tr>';
        // console.log(newRow);
        tableBody.append(newRow);
      }

      $('.filterCell').each( function (i) {
          i+=1;
          let title = $('#example thead th').eq( $(this).index() ).text();
          $(this).html( '<input type="text" placeholder="'+title+'" data-index="'+i+'" />' );
      } );
      
      // Create new search bar
      const searchBar2 = document.querySelector('#search-bar-2');

      // DataTable
      let table = $('#example').DataTable( {
          searching:      true,
          scrollY:        "760px",
          scrollX:        true,
          scrollCollapse: true,
          paging:         false,
          fixedColumns:   true,
          columnDefs: [{ targets: 0, orderDataType: 'dom-checkbox'}],
          search: {
            input: searchBar2
          }
      } );

      // Filter event handler
      $( table.table().container() ).on( 'keyup', 'tfoot input', function () {
          table.column( $(this).data('index') )
              .search(this.value)
              .draw();
      });
    
      // Update user tags
      table.on('blur', '.userFiltersInput', function() {
        let cell = table.cell($(this).closest('td'));
        cell.data($(this).val());
        table.draw();
        index = cell.index();
        let element = table.cell({ row: index.row, column: index.column }).node();
        let userFilters_text = element.textContent;
        let objectID_text = table.cell({ row: index.row, column: 1 }).node().textContent;
        const updateQuery = db.prepare('UPDATE IndexData SET user_tags = ? WHERE object_id = ?');
        updateQuery.run(userFilters_text, objectID_text);
        element.innerHTML = '<input class="userFiltersInput" type="text" value="'+userFilters_text+'"/><span style="display:none;">'+userFilters_text+'</span>';
      });

      // Add a search function for the new search bar
      searchBar2.addEventListener('keyup', function() {
        table.search(this.value).draw();
      });
    });
}

// Call Functions
asyncMain();
getGlobalVariables();
console.log("view!");
