import React from 'react';
import '../styles/styles.css';
import DropdownSelector from './DropdownSelector';
class EntryTableRowCaptain extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        return(
            <div className='splash-header'>
                <p className='captain-inline-block'>Captain</p>
                <DropdownSelector className='captain-inline-block'
                whichRow={"CPT"}
                playerDict={this.props.playerDict}
                handleSelectCaptain={this.props.handleSelectCaptain}
                lineupIndex={this.props.lineupIndex}
                utilityId={this.props.utilityId}
                ></DropdownSelector>
                <p className='captain-inline-block'>{this.props.captain.player_name}</p>
                <p className='captain-inline-block'>{this.props.captain.salary}</p>
            </div>
    
        );
    }
}

export default EntryTableRowCaptain;