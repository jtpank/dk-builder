import React from 'react';
import EntryTable from './EntryTable';
import DropdownSelector from './DropdownSelector';
import '../styles/styles.css';
class EntryField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedName1: null, selectedName2: null };
        this.handleSelectName1 = this.handleSelectName1.bind(this);
        this.handleSelectName2 = this.handleSelectName2.bind(this);
    }
    handleSelectName1(name) {
        this.setState({ selectedName1: name });
      }
    
      handleSelectName2(name) {
        this.setState({ selectedName2: name });
    }

    render() {
        let tables = []
        for(let i = 0; i < 10; ++i)
        {
            let row = <div className='teams-table-wrapper'>
                        <EntryTable
                        tableIndex={i+1}
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