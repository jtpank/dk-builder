import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/styles.css';
class EntryField extends React.Component {
    render() {
        return(
            <div className='splash-header'>
                <table>
                <thead>
                    <tr>
                    <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Cpt Row</td>
                    </tr>
                    <tr>
                    <td>Util 1</td>
                    </tr>
                    <tr>
                    <td>Util 2</td>
                    </tr>
                    <tr>
                    <td>Util 3</td>
                    </tr>
                    <tr>
                    <td>Util 4</td>
                    </tr>
                    <tr>
                    <td>Util 5</td>
                    </tr>
                </tbody>
                </table>

            </div>
    
        );
    }
}

export default EntryField;