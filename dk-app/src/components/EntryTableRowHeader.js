import React from 'react';
import '../styles/styles.css';
class EntryTableRowHeader extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        return(
            <div className='splash-header'>
                <p>Entry: {this.props.entryNumber}</p>

            </div>
    
        );
    }
}

export default EntryTableRowHeader;
