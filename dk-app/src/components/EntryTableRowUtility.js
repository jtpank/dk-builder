import React from 'react';
import DropdownSelector from './DropdownSelector';
import '../styles/styles.css';
class EntryTableRowUtility extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        return(
            <div className='splash-header'>
                <p className='captain-inline-block'>Utility {this.props.utilityId}</p>
                <DropdownSelector className='captain-inline-block'
                whichRow={"UTIL"}
                playerDict={this.props.playerDict}
                onSelectUtility={this.props.onSelectUtility}
                ></DropdownSelector>
                <p className='captain-inline-block'>{this.props.utility.player_name}</p>
                <p className='captain-inline-block'>{this.props.utility.salary}</p>
            </div>
    
        );
    }
}

export default EntryTableRowUtility;
