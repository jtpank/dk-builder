import React from 'react';
import EntryTableRowHeader from './EntryTableRowHeader';
import EntryTableRowCaptain from './EntryTableRowCaptain';
import EntryTableRowUtility from './EntryTableRowUtility';
import EntryTableRowFooter from './EntryTableRowFooter';
import '../styles/styles.css';
class EntryTable extends React.Component {
    constructor(props) {
        super(props);
      }

    render() {
        let rows = [];
        for(let i = 0; i < 5; ++i)
        {
            rows.push(
                <EntryTableRowUtility
                key={i}
                playerDict={this.props.utilityDict}
                handleSelectUtility={this.props.handleSelectUtility}
                handleSetEntryTableRowUtility={this.props.handleSetEntryTableRowUtility}
                isUtilitySet={this.props.isUtilitySet}
                utility={this.props.lineup._utility[i]}
                lineupIndex={this.props.lineupIndex}
                utilityId={i+1}
                ></EntryTableRowUtility>
            )
        }
        return(
            <div className='entry-table_container'>
                <EntryTableRowHeader
                failureDict={this.props.failureDict}
                duplicateUserLineupsDict={this.props.duplicateUserLineupsDict}
                entryNumber={this.props.lineup._entry_id}
                tableIndex={this.props.tableIndex}
                ></EntryTableRowHeader>
                {rows}
                <EntryTableRowCaptain
                playerDict={this.props.captainDict}
                handleSelectCaptain={this.props.handleSelectCaptain}
                handleSetEntryTableRowCaptain={this.props.handleSetEntryTableRowCaptain}
                isCaptainSet={this.props.isCaptainSet}
                captain={this.props.lineup._captain}
                lineupIndex={this.props.lineupIndex}
                ></EntryTableRowCaptain>
                <EntryTableRowFooter
                captain={this.props.lineup._captain}
                utilityArray={this.props.lineup._utility}
                ></EntryTableRowFooter>

            </div>
    
        );
    }
}

export default EntryTable;
