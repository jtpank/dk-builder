import React from 'react';
import '../styles/styles.css';
class DropdownSelector extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.ha
    }
  
    handleChange(event) {
      this.props.onChange(event.target.value);
    }

    // handleLoad(){
    //   let full_url = 'http://127.0.0.1:5000/api/';
    //   fetch(full_url, {
    //       method: 'GET',
    //       body: formData
    //     }).then(response => {
    //       if (!response.ok) {
    //           throw new Error("HTTP status " + response.status + " / GET error");
    //       }
    //       return response.json();
    //     })
    //     .then(data => {
    //         console.log(data.message + " | " + String(data.contest_id));

    //     }).catch(error => {
    //         console.error(error);
    //         alert(error.message);
    //     });
    // }
    
  
    render() {
      const options = this.props.names.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ));
      return (
        <select value={this.props.value} onChange={this.handleChange}>
          <option value="">Select a name</option>
          {options}
        </select>
      );
    }
  }

  export default DropdownSelector;