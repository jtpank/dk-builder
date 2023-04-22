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
        let captainMap = new Map();
        let entries = this.props.numEntries; // 1 captain per lineup
        for(let i = 0; i < entries; ++i)
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
        const captainData =
        {
            labels: [...captainMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...captainMap.values()].map(val =>  ((val/(entries))*100.0)),
            }
            ]
        }


        let totalPlayerMap = new Map();
        for(let i = 0; i < entries; ++i)
        {
            const lineup = this.props.allLineups[i];
            if(lineup)
            {
                    if(lineup._utility)
                    {
                        const utilArray = lineup._utility;
                        for(let j = 0; j < 5; ++j)
                        {
                            const utilPlayer = utilArray[j];
                            if(utilPlayer != null && Object.keys(utilPlayer).length != 0)
                            {
                                if(utilPlayer.player_name != null)
                                {
                                    if(totalPlayerMap.has(utilPlayer.player_name))
                                    {
                                        let prevVal = totalPlayerMap.get(utilPlayer.player_name);
                                        totalPlayerMap.set(utilPlayer.player_name, prevVal + 1);
                                    }
                                    else
                                    {
                                        totalPlayerMap.set(utilPlayer.player_name,1);
                                    }
                                }
                            }
                        }
                    }
                    if(lineup._captain)
                    {
                        const captain = this.props.allLineups[i]._captain;
                        if(captain != null && Object.keys(captain).length !== 0)  // captain is not empty and not null
                        {
                            if(captain.player_name != null)  //player name not null
                            {
                                if(totalPlayerMap.has(captain.player_name))
                                {
                                    let prevVal = totalPlayerMap.get(captain.player_name);
                                    totalPlayerMap.set(captain.player_name, prevVal + 1);
                                }
                                else
                                {
                                    totalPlayerMap.set(captain.player_name,1);
                                }
                            }
                        }
                    }

            }
        }
        const utilityData =
        {
            labels: [...totalPlayerMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...totalPlayerMap.values()].map(val => ((val/(entries))*100.0)),
            }
            ]
        }
        return (
            <div className='bar-chart-style'>
                <BarChart 
                chartData={captainData} 
                labelName={"Captain"}/>

                <BarChart 
                chartData={utilityData}
                labelName={"Total"} 
                />
            </div>
        );
    }
}

export default Charts;


