import React from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from "../utils/Data.js";
import { BarChart } from '../components/BarChart';
import '../styles/styles.css';

class Charts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() 
    {
        Chart.register(CategoryScale);
        const thisData =
        {
            labels: Data.map((data) => data.year), 
            datasets: [
            {
                label: "Users Gained ",
                data: Data.map((data) => data.userGain),
            }
            ]
        }
        return (
            <div className='bar-chart-style'>
                <BarChart chartData={thisData} />
            </div>
        );
    }
}

export default Charts;


