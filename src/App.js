import React, { Component, Fragment } from 'react'
import ReactDropzone from 'react-dropzone'

import { api } from './constants'

// const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    filename: '',
    remoteFile: '',
    total: 0,
  }

  onDrop = ([file]) => { // pattern matching
    this.setState({
      filename: file.name,
      remoteFile: '― Loading...',
    })

    this.uploadFile(file)
  }

  uploadFile = async (file) => {
    const response = await fetch(`${api}/Binary`, {
      method: 'POST',
      body: file,
    })

    if (response.status === 201) {
      this.setState({
        remoteFile: `― ${response.headers.get('Location')}`,
      })
    }

    this.findTotal()
  }

  findTotal = async () => {
    const tmp = await fetch(`${api}/Binary/_history`)
    const { total } = await tmp.json()

    this.setState({
      total,
    })
  }

  render = () => {
    const {
      filename,
      remoteFile,
      total,
    } = this.state

    return (
      <Fragment>
        <ReactDropzone
          multiple={false}
          onDrop={this.onDrop}
        >
          Drop your document here.
        </ReactDropzone>

        <div id="foo">
          { filename } { remoteFile }
          <br />
          {
            (total !== 0) && (`${total} files uploaded so far.`)
          }
        </div>
      </Fragment>
    )
  }
}

export default App
