import React from 'react';
import '../styles/styles.css';
class DropdownSelector extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
      this.props.onChange(event.target.value);
    }
  
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