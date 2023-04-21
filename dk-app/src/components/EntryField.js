import React from 'react';
import EntryTable from './EntryTable';
import DropdownSelector from './DropdownSelector';
import '../styles/styles.css';
class EntryField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            selectedName1: null, 
            selectedName2: null,
            _exposure_dict: {},
        };
        this.handleSelectName1 = this.handleSelectName1.bind(this);
        this.handleSelectName2 = this.handleSelectName2.bind(this);
    }
    handleSelectName1(name) {
        this.setState({ selectedName1: name });
      }
    
    handleSelectName2(name) {
        this.setState({ selectedName2: name });
    }

    calculateExposure() {
        let totalInput = this.props.numEntries*5; //5 utility per lineup
        let totalCaptainInput = this.props.numEntries; //1 captain per lineup
        for(let i = 0; i < this.props.numEntries; ++i)
        {
            //get _lineup from table
            //for each item in lineup that IS NOT in exposure dict
            //
        }
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