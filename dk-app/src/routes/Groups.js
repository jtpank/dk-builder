import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/styles.css';

class Groups extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        
        }
      }
    render() {
       
        return (
        <div>
            <div>
                <p>Group stats!</p>
            </div>
          
            <Outlet></Outlet>
        </div>
        );
    }
}

export default Groups;