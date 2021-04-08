// Modules to control application life and create native browser window
const { app, BrowserWindow, net, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
 mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('toMain', (event, arg) => {
  console.log('Search request obtained: ' + JSON.stringify(arg))

  const body = JSON.stringify(arg)
  const request = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: 'cis4250-06.socs.uoguelph.ca',
    port: 443,
    path: '/search',
    redirect: 'follow'
  })
  request.on('response', (response) => {
    let body = ''
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)

    response.on('data', (chunk) => {
      fs.writeFile('searchResults.json', '', function (err) {
        if (err) return console.log(err)
        console.log('Cleared file')
      })
      // console.log(`BODY: ${chunk}`)
      body += chunk
    })
    response.on('end', function () {
      fs.writeFile('searchResults.json', body, function (err) {
        if (err) return console.log(err)
        console.log('Wrote to file')
      })
      event.sender.send('fromMain', body.toString('utf8'))
      body = ''
    })
  })
  request.on('finish', () => {
    console.log('Request is Finished')
  })
  request.on('abort', () => {
    console.log('Request is Aborted')
  })
  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`)
  })
  request.on('close', (error) => {
    console.log('Last Transaction has occured')
  })
  request.setHeader('Content-Type', 'application/json')
  request.write(body, 'utf-8')
  request.end()
})

ipcMain.on('toMainResults', (event, arg) => {
  fs.readFile('searchResults.json', 'utf8', function (err, data) {
    // Display the file content
    event.sender.send('fromMain', data.toString('utf8'))
  })
})

ipcMain.on('toResults', (event, arg) => {
  console.log('Search request obtained: ' + arg)

  const request = net.request({
    method: 'GET',
    protocol: 'http:',
    hostname: 'cis4250-06.socs.uoguelph.ca',
    port: 443,
    path: '/tree/' + arg,
    redirect: 'follow'
  })
  request.on('response', (response) => {
    let body = ''
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)

    response.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`)
      body += chunk
    })
    response.on('end', function () {
      event.sender.send('fromResults', body.toString('utf8'))
      body = ''
    })
  })
  request.on('finish', () => {
    console.log('Request is Finished')
  })
  request.on('abort', () => {
    console.log('Request is Aborted')
  })
  request.on('error', (error) => {
    console.log(`ERROR: ${JSON.stringify(error)}`)
  })
  request.on('close', (error) => {
    console.log('Last Transaction has occured')
  })
  request.setHeader('Content-Type', 'application/json')
  request.end()
})

ipcMain.on('toImage', (event, arg) => {
  console.log('Prof name obtained: ' + arg)
  // TODO BEFORE PUSH HIDE THIS
  let subscriptionKey = '';
  fs.readFile('config.json', 'utf8', function (err, data) {
    // Display the file content
    let json = data.toString('utf8');
    json = JSON.parse(json);
    subscriptionKey = json['subscriptionKey'];
  
    let ourPath = '/v7.0/images/search' + '?q=' + encodeURIComponent(arg);
    const request = net.request({
      method: 'GET',
      protocol: 'https:',
      hostname: 'api.bing.microsoft.com',
      port: 443,
      path: ourPath,
      headers : {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
      }
    })
    request.on('response', (response) => {
      let body = ''
      // console.log(`STATUS: ${response.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)

      response.on('data', (chunk) => {
        body += chunk
      })
      response.on('end', function () {
        // console.log('\n\n\n\n\nMADDIE ' + body)
        // console.log(`SENDING BACK ${body}`)
        event.sender.send('fromImage', body.toString('utf8'))
        body = ''
      })
    })
    request.on('finish', () => {
      console.log('Request is Finished')
    })
    request.on('abort', () => {
      console.log('Request is Aborted')
    })
    request.on('error', (error) => {
      console.log(`ERROR: ${JSON.stringify(error)}`)
    })
    request.on('close', (error) => {
      console.log('Last Transaction has occured')
    })
    request.setHeader('Content-Type', 'application/json')
    request.end()
  
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})