import React, { Component } from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedFile: null };
  }

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleUpload = () => {
    // Handle the file upload here
    console.log(this.state.selectedFile);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Click to upload: {this.props.fileName}</button>
      </div>
    );
  }
}

export default FileUpload;