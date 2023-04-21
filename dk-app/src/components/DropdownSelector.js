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
      let player = this.props.playerDict.values.find(
        (p) => p.player_name === event.target.value
      );
      if(this.props.whichRow === "UTIL")
      {
        this.props.handleSelectUtility(player, this.props.lineupIndex, this.props.utilityId-1);
      }
      else
      {
        this.props.handleSelectCaptain(player, this.props.lineupIndex);
      }
      
    }
  
    render() {
      const options = this.props.playerDict.values.map((player) => (
        <option key={player.player_id} value={player.player_name}>
          {player.player_name}
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