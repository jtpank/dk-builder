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
        const captainData =
        {
            labels: [...captainMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...captainMap.values()].map(val => (val/(maxNumCaptains)).toPrecision(2)),
            }
            ]
        }


        let utilityMap = new Map();
        let maxNumUtilities = this.props.numEntries*5; // 5 utils per lineup
        for(let i = 0; i < maxNumUtilities; ++i)
        {
            const lineup = this.props.allLineups[i];
            if(lineup && lineup._utility)
            {
                const utilArray = lineup._utility;
                for(let j = 0; j < 5; ++j)
                {
                    const utilPlayer = utilArray[j];
                    if(utilPlayer != null && Object.keys(utilPlayer).length != 0)
                    {
                        if(utilPlayer.player_name != null)
                        {
                            if(utilityMap.has(utilPlayer.player_name))
                            {
                                let prevVal = utilityMap.get(utilPlayer.player_name);
                                utilityMap.set(utilPlayer.player_name, prevVal + 1);
                            }
                            else
                            {
                                utilityMap.set(utilPlayer.player_name,1);
                            }
                        }
                    }
                }
            }
            // const utilArray = this.props.allLineups[i]._utility;
            // if(utilArray != null)
            // {
            //     for(let j = 0; j < 5; ++j)
            //     {
            //         const utilPlayer = utilArray[j];
            //         if(utilPlayer != null && Object.keys(utilPlayer).length != 0)
            //         {
            //             if(utilPlayer.player_name != null)
            //             {
            //                 if(utilityMap.has(utilPlayer.player_name))
            //                 {
            //                     let prevVal = utilityMap.get(utilPlayer.player_name);
            //                     utilityMap.set(utilPlayer.player_name, prevVal + 1);
            //                 }
            //                 else
            //                 {
            //                     utilityMap.set(utilPlayer.player_name,1);
            //                 }
            //             }
            //         }
            //     }
            // }
        }
        const utilityData =
        {
            labels: [...utilityMap.keys()], 
            datasets: [
            {
                label: "Percent Exposed ",
                data: [...utilityMap.values()].map(val => (val/(maxNumUtilities)).toPrecision(2)),
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
                labelName={"Utility"} 
                />
            </div>
        );
    }
}

export default Charts;


