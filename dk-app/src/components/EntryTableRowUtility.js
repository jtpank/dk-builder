import React from 'react';
import DropdownSelector from './DropdownSelector';
import '../styles/styles.css';
class EntryTableRowUtility extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        let rows;
        if(!this.props.isUtilitySet[this.props.lineupIndex][this.props.utilityId-1])
        {
            rows = <div>
            <p className='captain-inline-block'>Utility </p>
            <DropdownSelector className='captain-inline-block'
            whichRow={"UTIL"}
            playerDict={this.props.playerDict}
            handleSelectUtility={this.props.handleSelectUtility}
            handleSetEntryTableRowUtility={this.props.handleSetEntryTableRowUtility}
            isUtilitySet={this.props.isUtilitySet}
            lineupIndex={this.props.lineupIndex}
            utilityId={this.props.utilityId}
            ></DropdownSelector>
            {/* <button
            onClick={()=> this.props.handleSetEntryTableRowUtility(true,  this.props.lineupIndex, this.props.utilityId-1)}>
                Set Utility {this.props.utilityId}
            </button> */}

            </div>
        }
        else
        {
            rows = <div>
                <button
                onClick={()=> this.props.handleSetEntryTableRowUtility(false, this.props.lineupIndex, this.props.utilityId-1)}
                >
                Clear 
                </button>
                <p className='captain-inline-block'>{this.props.utility.player_name}</p>
                <p className='captain-inline-block'>{this.props.utility.salary}</p>
            </div>
        }
        return(
            <div className='splash-header'>
                {rows}
            </div>
    
        );
    }
}

export default EntryTableRowUtility;
