import React from 'react';
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
        return(
            <div className='splash-header'>
                <table className='teams-entry-table'>
                <thead>
                    <tr>
                    <th>Team {this.props.tableIndex}</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Cpt Name</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 1 Name</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 2</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 3</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 4</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 5</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>Sum</td>
                    </tr>
                </tbody>
                </table>

            </div>
    
        );
    }
}

export default EntryTable;

{/* <thead>
                    <tr>
                    <th>Team {this.props.tableIndex}</th>
                    <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Cpt Name</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 1 Name</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 2</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 3</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 4</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Util 5</td>
                        <td>1000</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>Sum</td>
                    </tr>
                </tbody> */}