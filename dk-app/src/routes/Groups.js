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
                <div>
                    <p>Select Contest:</p>
                    <button onClick={this.props.handleDisplayContestData}>Find contests</button>
                </div>
                <div className="scrollable-container">
                    <ul className="contest-list">
                        {this.props.allUserContestsList.map((item, index) => (
                        <div key={index}>
                        <li>{item} <button>click me</button></li>
                        </div>
                        ))}
                    </ul>
                </div>
            </div>
          
            <Outlet></Outlet>
        </div>
        );
    }
}

export default Groups;