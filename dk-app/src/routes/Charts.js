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
        let exposureData = [];
        let maxNumUtils = this.props.numEntries*5; // 5 utility per lineup
        let captainMap = new Map();
        let maxNumCaptains = this.props.numEntries; // 1 captain per lineup
        for(let i = 0; i < maxNumCaptains; ++i)
        {
            const captain = this.props.allLineups[i]._captain;
            if(captain != null && Object.keys(captain).length !== 0)  // captain is not empty and not null
            {
                if(captain.player_name != null)  //player name not null
                {
                    if(captainMap.has(captain.player_name))
                    {
                        let prevVal = captainMap.get(captain.player_name);
                        captainMap.set(captain.player_name, prevVal + 1);
                    }
                    else
                    {
                        captainMap.set(captain.player_name,1);
                    }
                }
            }
        }
        const thisData =
        {
            labels: [...captainMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...captainMap.values()].map(val => (val/(maxNumCaptains)).toPrecision(3)),
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


