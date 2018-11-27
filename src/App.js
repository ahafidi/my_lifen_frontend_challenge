import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'

import { api } from './constants'

class App extends Component {
  state = {
    filename: '',
    remoteFile: '',
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
  }

  render = () => {
    const {
      filename,
      remoteFile,
    } = this.state

    return (
      <div>
        <ReactDropzone
          multiple={false}
          onDrop={this.onDrop}
        >
          Drop your document here.
        </ReactDropzone>

        { filename } { remoteFile }
      </div>
    )
  }
}

export default App
