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
      if(Object.keys(this.props.playerDict).length > 0)
      {
      let player = this.props.playerDict.values.find(
        (p) => p.player_name === event.target.value
      );
      if(this.props.whichRow === "UTIL")
      {
        this.props.handleSelectUtility(player, this.props.lineupIndex, this.props.utilityId-1);
        this.props.handleSetEntryTableRowUtility(true,  this.props.lineupIndex, this.props.utilityId-1);
      }
      else
      {
        this.props.handleSelectCaptain(player, this.props.lineupIndex);
        this.props.handleSetEntryTableRowCaptain(true, this.props.lineupIndex);
      }
    }
      
    }
  
    render() {
      let options 
      if(Object.keys(this.props.playerDict).length > 0)
      {
        options = this.props.playerDict.values.map((player) => (
          <option className='option-dropdown' key={player.player_id} value={player.player_name}>
            {player.player_name} | {player.salary} | {player.team_abbr}
          </option>
        ));
      }
      else
      {
        options = <option className='option-dropdown' value="none" disabled>
          Please upload salaries!
        </option>
      }
      return (
        <select className='select-dropdown' defaultValue="" onChange={this.handleChange}>
          <option className='option-dropdown' value="" disabled>Select a name</option>
          {options}
        </select>

      );
    }
  }

  export default DropdownSelector;