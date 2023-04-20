import React from 'react';
import '../styles/styles.css';
class EntryTableRowFooter extends React.Component {
    constructor(props) {
        super(props);
      }
    
    render() {
        let totalSalary = 0;
        let cpt = this.props.captain;
        let util = this.props.utilityArray;
        if(Object.keys(cpt).length != 0)
        {
            totalSalary += cpt.salary;
        }
        for(let i = 0; i < util.length; ++i)
        {
            if(Object.keys(util[i]).length != 0)
            {
                totalSalary += util[i].salary;
            }
        }
        return(
            <div className='splash-header'>
                <p>Total Salary: {totalSalary}</p>
            </div>
    
        );
    }
}

export default EntryTableRowFooter;
