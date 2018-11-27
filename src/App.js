import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone'

class App extends Component {
  state = {
    filename: '',
  }

  onDrop = ([{name}]) => { // pattern matching
    this.setState({
      filename: name,
    })
  }

  render() {
    const { filename } = this.state

    return (
      <div>
        <ReactDropzone
          multiple={false}
          onDrop={this.onDrop}
        >
          Drop your document here.
        </ReactDropzone>

        {filename}
      </div>
    )
  }
}

export default App
