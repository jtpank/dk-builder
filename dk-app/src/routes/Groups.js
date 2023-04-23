import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/styles.css';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from "../utils/Data"
import { BarChart } from '../components/BarChart';

class Groups extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        
        }
      }
    render() {
        Chart.register(CategoryScale);
        let testMap = new Map();
        testMap.set("item1", 10);
        testMap.set("item2", 20);
        testMap.set("item3", 30);
        const utilityData =
        {
            labels: [...testMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...testMap.values()].map(val => (val*100.0)),
            }
            ]
        }
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
                <div className='bar-chart-style'>
                    <BarChart
                    chartData={utilityData}
                    labelName={"Captain"}/>

                    <BarChart 
                    chartData={utilityData}
                    labelName={"Total"} 
                    />
                </div>
            </div>
          
            <Outlet></Outlet>
        </div>
        );
    }
}

export default Groups;