const {
  app,
  BrowserWindow,
} = require('electron')
const chokidar = require('chokidar')
const fs = require('fs')
const fetch = require('node-fetch')

const api = 'https://fhirtest.uhn.ca/baseDstu3'

let mainWindow

const uploadFile = async (pathname) => {
  const filename = pathname.replace(/^.*[\\\/]/g, '')

  return new Promise((resolve, reject) => {
    fs.readFile(pathname, async (err, data) => {
      const response = await fetch(`${api}/Binary`, {
        method: 'POST',
        body: data,
      })

      if (response.status === 201) {
        const location = response.headers.get('Location')

        mainWindow
          .webContents
          .executeJavaScript(`document.getElementById("foo").innerHTML = "${filename} ${location}"`)
        resolve()
      } else {
        reject()
      }
    })
  })
}

const findTotal = async () => {
  const tmp = await fetch(`${api}/Binary/_history`)
  const { total } = await tmp.json()

  mainWindow
    .webContents
    .executeJavaScript(`document.getElementById("foo").innerHTML += "<br />${total} files uploaded so far."`)
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  mainWindow.loadURL('http://localhost:3000')


  chokidar
    .watch(`${process.env.HOME}/FHIR`)
    .on('add', async (path, stats) => {
      const pdf = /^.*.pdf$/gi
      const sizeLimit = 2000000 // 2Mb

      if (pdf.test(path) && stats.size <= sizeLimit) {
        console.log(`Add ${path}`)
        await uploadFile(path)
        findTotal()
      }
    })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
