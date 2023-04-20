import React from 'react';
import EntryTableRowHeader from './EntryTableRowHeader';
import EntryTableRowCaptain from './EntryTableRowCaptain';
import EntryTableRowUtility from './EntryTableRowUtility';
import EntryTableRowFooter from './EntryTableRowFooter';
import '../styles/styles.css';
class EntryTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleRowClick = this.handleRowClick.bind(this);
      }
    
      handleRowClick(event, name) {
        event.preventDefault();
        this.props.onSelectName(name);
      }
    
    render() {
        let rows = [];
        for(let i = 0; i < 5; ++i)
        {
            rows.push(
                <EntryTableRowUtility></EntryTableRowUtility>
            )
        }
        return(
            <div className='splash-header'>
                <EntryTableRowHeader></EntryTableRowHeader>
                <EntryTableRowCaptain></EntryTableRowCaptain>
                {rows}
                <EntryTableRowFooter></EntryTableRowFooter>

            </div>
    
        );
    }
}

export default EntryTable;
