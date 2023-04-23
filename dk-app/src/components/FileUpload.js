import React, { Component } from 'react';
//set baseurl here!
const base_url = '/api/'
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        selectedFile: null, 
        csvHeaders: [],
        contestId: -1,
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
    try {
      reader.readAsText(file);
    } catch (e) {
      console.error(e);
      alert('Failed to readAsText');
    }
  };

  handleUpload = () => {

    if (!this.state.selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.selectedFile);
    let obj = {
      contest_id: -1
    }
    let email_obj = {
      email: "none"
    }
    if(this.props.contestId != null && this.props.contestId > 0)
    {
      obj = {
        contest_id: this.props.contestId
      }
    }
    if(this.props._email != null && this.props._email.length > 0)
    {
      email_obj = {
        email: this.props._email
      }
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + this.props._jwt);
    myHeaders.append("Access-Control-Allow-Origin","*");
    let json = JSON.stringify(obj);
    let blob = new Blob([json], {
      type: 'application/json'
    });
    formData.append("blob", blob);

    
    let json_email = JSON.stringify(email_obj);
    let blob_email = new Blob([json_email], {
      type: 'application/json'
    });
    formData.append("blob_email", blob_email);

    const fetch_req = this.props.routeName;
    const end_url = '-route';
    const full_url = base_url + fetch_req + end_url;
    fetch(full_url, {
            method: 'PUT',
            headers: myHeaders,
            body: formData
        }).then(response => {
          if (!response.ok) {
              throw new Error("HTTP status " + response.status + " / Either wrong Entry.csv file, or server error");
          }
          return response.json();
        })
        .then(data => {
            if(data.contest_id != null && data.contest_id > 0)
            {
              //also array of all the entry ids, because we need the number of lineups.
              this.props.handleContestUpload(data.contest_id, data.num_entries, data.entry_data);
            }

            this.props.onUploadSuccess(this.props.routeName);
            if(this.props.routeName == 'salaries')
            {
              //here we want to fill the salary dict, as part of the APP state
              this.props.handleSalaryUpload(data.salary_data);
            }
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
        <button disabled={this.props.isDisabled} onClick={this.handleUpload}>Click to upload: {this.props.fileName}</button>
        {/* {csvHeaders.length > 0 && <p>Headers: {csvHeaders.join(', ')}</p>} */}
      </div>
    );
  }
}

export default FileUpload;