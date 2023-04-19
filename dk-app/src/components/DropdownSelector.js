import React from 'react';
import '../styles/styles.css';
class DropdownSelector extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      // this.onChange = this.onChange.bind(this);
    }
    handleChange(event) {
      event.preventDefault();
      console.log(event.target.value)
      // this.props.onChange(event.target.value);
    }
  
    render() {
      const options = this.props.playerDict.values.map((player) => (
        <option key={Object.keys(player)[0]} value={player[Object.keys(player)[0]].player_name}>
          {player[Object.keys(player)[0]].player_name}
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