const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const download = require('download');
const AdmZip = require('adm-zip');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS 
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS
// HARD TO MISS BIG GREEN COMMENT BLOCK ALL MY PERSONAL CODE SHOULD BE BELOW THIS

// Create a new dir at path
const createNewDirectories = (newFolder)  => {
  fs.mkdir(newFolder, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Directory created successfully:', newFolder);
    }
  });
};

// Create new Folders in user data path. On windows this would be "C:\Users\%user%\AppData\Roaming\CreativeWorksOrganiser"
const userDataPath = app.getPath('userData');
const newPath_AppStorage = path.join(userDataPath, 'Application Storage');
const newPath_Scripts = path.join(newPath_AppStorage, 'Scripts');
const newPath_Storage = path.join(newPath_AppStorage, 'Storage');
const newPath_Data = path.join(newPath_AppStorage, 'Data');
createNewDirectories(newPath_AppStorage);
createNewDirectories(newPath_Scripts);
createNewDirectories(newPath_Storage);
createNewDirectories(newPath_Data);

// Display error message if Python is not installed using the default web browser
const exitAndShow = (msg)  => {
  console.log(msg); 
  const readMePath = path.join(__dirname, 'readme.html');
  shell.openExternal(`file://${readMePath}`);
  app.quit();
}

// Check if a file exist/accessable on this system (Not using Async!)
const doesFileExist = (filePath) => {
  try {
    fs.accessSync(filePath);
    console.log(`File ${filePath} exists and is accessible!`);
    return true;
  } catch (error) {
    console.error(`File ${filePath} does not exist or is not accessible:`);
    return false;
  }
}

// Create Python Venv for each supported platform
function createPythonVenv_linux(venvPath) {
  const venvScriptsDir = path.dirname(venvPath);                                                              console.log(venvScriptsDir);        
  const venvBaseDir = path.dirname(venvScriptsDir);                                                           console.log(venvBaseDir);
  const requirements = path.join(__dirname, 'requirements.txt');                                              console.log(requirements);
  const outCreateVenv = execSync(`python3 -m venv "${venvBaseDir}"`).toString();                              console.log(outCreateVenv);
  const outPipInstall = execSync(`pip3 --timeout=60 install -r "${requirements}"`, { cwd: venvScriptsDir}).toString();     console.log(outPipInstall);
}

function createPythonVenv_darwin(venvPath) {
  const venvScriptsDir = path.dirname(venvPath);                                                              console.log(venvScriptsDir);        
  const venvBaseDir = path.dirname(venvScriptsDir);                                                           console.log(venvBaseDir);
  const requirements = path.join(__dirname, 'requirements.txt');                                              console.log(requirements);
  const outCreateVenv = execSync(`python3 -m venv "${venvBaseDir}"`).toString();                              console.log(outCreateVenv);
  const outPipInstall = execSync(`pip3 --timeout=60 install -r "${requirements}"`, { cwd: venvScriptsDir}).toString();     console.log(outPipInstall);
}

function createPythonVenv_win32(venvPath) {
  const venvScriptsDir = path.dirname(venvPath);                                                              console.log(venvScriptsDir);        
  const venvBaseDir = path.dirname(venvScriptsDir);                                                           console.log(venvBaseDir);
  const requirements = path.join(__dirname, 'requirements.txt');                                              console.log(requirements);
  const outCreateVenv = execSync(`python -m venv "${venvBaseDir}"`).toString();                               console.log(outCreateVenv);
  const outPipInstall = execSync(`pip --timeout=60 install -r "${requirements}"`, { cwd: venvScriptsDir}).toString();      console.log(outPipInstall);
}

// Init global var
let pathToPythonVENV;

// Check platform for Python and create Python Venv
switch (process.platform) {
  case 'win32': // Code to execute on Windows
    // Check if Python Installed
    try {
      const pythonVersion = execSync(`python -V`).toString();
      pythonVersionMajor = pythonVersion.split(" ")[1].split(".")[0];
      pythonVersionMinor = pythonVersion.split(".")[1];
      if (pythonVersionMajor != 3) { exitAndShow("Python 3 Not Installed!"); }
      if (pythonVersionMinor <= 8) { exitAndShow("Python 3.8 or higher should be installed!");  }
    } 
    catch (error) {
      console.error(error); exitAndShow("No Python Installed At All");
    }
    // Set Path to Python Venv
    pathToPythonVENV = path.join(newPath_AppStorage, 'python_environment_win32', 'Scripts', 'pythonw.exe'); 
    // Check if Python Venv exist, if it does not, create one.
    if (!doesFileExist(pathToPythonVENV)) {
      createPythonVenv_win32(pathToPythonVENV);
    }
    // End Switch
    break;
  case 'darwin': // Code to execute on macOS
    // Check if Python Installed
    try {
      const pythonVersion = execSync(`python3 --version`).toString();
      pythonVersionMajor = pythonVersion.split(" ")[1].split(".")[0];
      pythonVersionMinor = pythonVersion.split(".")[1];
      if (pythonVersionMajor != 3) { exitAndShow("Python 3 Not Installed!"); }
      if (pythonVersionMinor <= 8) { exitAndShow("Python 3.8 or higher should be installed!");  }
    } 
    catch (error) {
      console.error(error); exitAndShow("No Python Installed At All");
    }
    // Set Path to Python Venv
    pathToPythonVENV = path.join(newPath_AppStorage, 'python_environment_macos', 'Scripts', 'pythonw.exe'); 
    // Check if Python Venv exist, if it does not, create one.
    if (!doesFileExist(pathToPythonVENV)) {
      createPythonVenv_darwin(pathToPythonVENV);
    } 
    // End Switch
    break;
  case 'linux': // Code to execute on Linux
    // Check if Python Installed
    try {
      const pythonVersion = execSync(`python3 --version`).toString();
      pythonVersionMajor = pythonVersion.split(" ")[1].split(".")[0];
      pythonVersionMinor = pythonVersion.split(".")[1];
      if (pythonVersionMajor != 3) { exitAndShow("Python 3 Not Installed!"); }
      if (pythonVersionMinor <= 8) { exitAndShow("Python 3.8 or higher should be installed!");  }
    } 
    catch (error) {
      console.error(error); exitAndShow("No Python Installed At All");
    }
    // Set Path to Python Venv
    pathToPythonVENV = path.join(newPath_AppStorage, 'python_environment_linux', 'Scripts', 'pythonw.exe'); 
    // Check if Python Venv exist, if it does not, create one.
    if (!doesFileExist(pathToPythonVENV)) {
      createPythonVenv_linux(pathToPythonVENV);
    }
    // End Switch
    break;
  default:
    console.log(`Unsupported platform: ${process.platform}`);
    break;
}


// Init global var
let waitWindow;
let waitTaskInProgress = 1;

// Create a new window which can run Python scripts in the background while allowing the user to continue to use the application
function createWaitWindow(data) {
  waitTaskInProgress = 1;

  waitWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });

  waitWindow.loadFile('./src/html/wait.html');

  waitWindow.webContents.on('did-finish-load', () => {
    waitWindow.webContents.send('variable-long-scipts', data);
  });

  waitWindow.on('close', (event) => {
    if (waitTaskInProgress === 1){
      const close_options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        title: 'Confirmation',
        message: 'Are you sure you want to close this window?',
        detail: 'This action cannot be undone.'
      };

      event.preventDefault(); // Prevents the window from closing immediately
    
      dialog.showMessageBox(null, close_options).then(result => {
        console.log()
        if (result.response === 0) {
          waitWindow = null;
          event.sender.destroy();
        }
      }).catch(err => {
        console.log(err)
      });
    } else {
      waitWindow = null;
      event.sender.destroy();
    }
  });
}


// Inter-Process Communication - For transfering data between the main proccess and the render proccesses.
ipcMain.on('get-global-vals', (event) => {
  appStoragePath = newPath_AppStorage;
  appCodePath = __dirname;
  pythonVenvPath = pathToPythonVENV;
  event.reply('recieve-global-val', {appStoragePath, appCodePath, pythonVenvPath});
});

// Download Python scripts from my github
ipcMain.on('download-git-repo', (event) => {
  console.log("test");
  var fileUrl = "https://github.com/Liam-McCormack-Github/CreativeWorksOrganiserScripts/archive/refs/heads/main.zip";
  var filePath = path.join(newPath_Data, 'Temp');
  download(fileUrl,filePath).then(() => { 
    console.log('File downloaded successfully!'); 
    var filePathZip = path.join(filePath, 'CreativeWorksOrganiserScripts-main.zip');
    var zip = new AdmZip(filePathZip);
    zip.extractEntryTo(/*entry name*/ "CreativeWorksOrganiserScripts-main/", newPath_Scripts, false, true);
    event.reply('downloaded-git-repo');
  })

});

// Call the function for creating the seperate download window
ipcMain.on('create-wait-window-for-long-script', (event, data) => {
  if (waitWindow) {
    waitWindow.focus();
  } else {
    createWaitWindow(data);
  }
});

// Force close the seperate download window
ipcMain.on('close-wait-window', (event, data) => {
  waitTaskInProgress = 0;
  waitWindow.close();
  waitWindow = null;
});

// Open platform explorer at path
ipcMain.on('open-path-explorer', (event, data) => {
  switch (process.platform) {
    case 'win32':
      execSync(`start "" "${data.path}"`);
      break;
    case 'darwin':
      execSync(`open "${data.path}"`);
      break;
    case 'linux':
      execSync(`xdg-open "${data.path}"`);
      break;
    default:
      console.log(`Unsupported platform: ${platform}`);
      break;
  }
});

// Open url in default browser
ipcMain.on('open-link-in-browser', (event, data) => {
  shell.openExternal(data.url);
});




