import React from 'react';
import '../styles/styles.css';
import DropdownSelector from './DropdownSelector';
class EntryTableRowCaptain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
      }
    render() {
        let rows;
        if(!this.props.isCaptainSet[this.props.lineupIndex])
        {
            rows = <div>
            <p className='captain-inline-block'>Captain </p>
            <button
            onClick={()=> this.props.handleSetEntryTableRowCaptain(true, this.props.lineupIndex)}
            >

            </button>
            </div>
        }
        else
        {
            rows = <div>
                <button
                onClick={()=> this.props.handleSetEntryTableRowCaptain(false, this.props.lineupIndex)}
                >
                Clear
                </button>
                <p className='captain-inline-block'>{this.props.captain.player_name}</p>
                <p className='captain-inline-block'>{this.props.captain.salary}</p>
            </div>
        }
        return(
            <div className='splash-header'>
                {rows}
            </div>
    
        );
    }
}

export default EntryTableRowCaptain;