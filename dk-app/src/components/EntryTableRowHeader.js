import React from 'react';
import '../styles/styles.css';
class EntryTableRowHeader extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        let failure_rows = []
        if(this.props.failureDict != null && this.props.entryNumber != null)
        {
            if(this.props.entryNumber in this.props.failureDict)
            {
                let ii = 0;
                for (let item of this.props.failureDict[this.props.entryNumber])
                {
                    ii+=1;
                    let row = <p key={String(item) + String(ii)}>{item}</p>
                    failure_rows.push(row)
                }
            }
        }
        return(
            <div className='header'>
                <p>Entry: {this.props.entryNumber}</p>
                <div className="error-class-text">
                    {failure_rows}
                </div>
            </div>
    
        );
    }
}

export default EntryTableRowHeader;
