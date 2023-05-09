import React from 'react';
import EntryTable from './EntryTable';
import DropdownSelector from './DropdownSelector';
import '../styles/styles.css';
class EntryField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tables = []
        for(let i = 0; i < this.props.numEntries; ++i)
        {
            let row = <div key={"_table_"+String(i)} className='teams-table-wrapper'>
                        <EntryTable
                        captainDict={this.props.captainDict}
                        utilityDict={this.props.utilityDict}
                        tableIndex={i+1}
                        lineup={this.props.allLineups[i]}
                        lineupIndex={i}
                        handleSelectCaptain={this.props.handleSelectCaptain}
                        handleSelectUtility={this.props.handleSelectUtility}
                        handleSetEntryTableRowCaptain={this.props.handleSetEntryTableRowCaptain}
                        isCaptainSet={this.props.isCaptainSet}
                        handleSetEntryTableRowUtility={this.props.handleSetEntryTableRowUtility}
                        isUtilitySet={this.props.isUtilitySet}
                        failureDict={this.props.failureDict}
                        duplicateUserLineupsDict={this.props.duplicateUserLineupsDict}
                        ></EntryTable>
                    </div>
            tables.push(row);
        }
        return(
            <div className='teams-splash-header'>
                {tables}
            </div>
    
        );
    }
}

export default EntryField;