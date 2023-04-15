import React, { Component } from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        selectedFile: null, 
        csvHeaders: [] 
    };
  }

  handleFileChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = (event) => {
      const csvData = event.target.result;
      
      // Parse the CSV data to get the headers
      try {
        const headers = csvData.split('\n')[0].split(',');
        this.setState({ csvHeaders: headers, selectedFile: file });
      } catch (e) {
        console.error(e);
        alert('Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
  };

  handleUpload = () => {

    if (!this.state.selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.selectedFile);
    const salaries_url ='http://127.0.0.1:5000/api/salaries-route';
    fetch(salaries_url, {
            method: 'PUT',
            body: formData
        }).then(response => response.json())
        .then(data => {
            console.log('data: ' + data.message);
        }).catch(error => {
            console.error(error);
            alert(error.message);
        });
    };

  render() {
    const { csvHeaders } = this.state;

    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Click to upload: {this.props.fileName}</button>
        {csvHeaders.length > 0 && <p>Headers: {csvHeaders.join(', ')}</p>}
      </div>
    );
  }
}

export default FileUpload;