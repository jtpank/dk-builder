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
            <button
            onClick={()=> this.props.handleSetEntryTableRowUtility(true,  this.props.lineupIndex, this.props.utilityId-1)}>
                Set Utility {this.props.utilityId}
            </button>

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
