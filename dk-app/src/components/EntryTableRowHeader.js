import React from 'react';
import '../styles/styles.css';
class EntryTableRowHeader extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        let failure_rows = []
        let ii = 0;
        if(this.props.failureDict != null && this.props.entryNumber != null)
        {
            if(this.props.entryNumber in this.props.failureDict)
            {
                
                for (let item of this.props.failureDict[this.props.entryNumber])
                {
                    ii+=1;
                    let row = <p key={String(item) + String(ii)}>{item}</p>
                    failure_rows.push(row)
                }
            }
        }
        //this is going to be annoying
        // it will list the entry id not the lineup number (which is arbitrary)
        if(this.props.duplicateUserLineupsDict != null && this.props.entryNumber != null)
        {
            if(this.props.entryNumber in this.props.duplicateUserLineupsDict)
            {
                
                for (let item of this.props.duplicateUserLineupsDict[this.props.entryNumber])
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
