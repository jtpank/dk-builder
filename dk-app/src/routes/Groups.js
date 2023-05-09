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
        let captainMap = new Map();
        let entries = 0;
        if(this.props.groupEntryDataList)
        {
            entries = this.props.groupEntryDataList.length; // 1 captain per lineup
        }
        for(let i = 0; i < entries; ++i)
        {
            const captain = this.props.groupEntryDataList[i].captain;
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
        if(this.props.groupEntryDataList)
        {
            for(let i = 0; i < entries; ++i)
            {
                const lineup = this.props.groupEntryDataList[i];
                if(lineup)
                {
                        if(lineup.utility)
                        {
                            const utilArray = lineup.utility;
                            for(let j = 0; j < utilArray.length; ++j)
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
                        if(lineup.captain)
                        {
                            const captain = this.props.groupEntryDataList[i].captain;
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
        }
        // Sort array by value of key-value pair
        console.log(typeof(totalPlayerMap))
        // totalPlayerMap.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);
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
                        <li>{item['contest_name']} : {item['contest_id']}</li>
                        <button
                        onClick={() => this.props.handleDisplayGroupsAndContestCharts(item['contest_id'])}
                        >Display Group Contest Charts</button>
                        </div>
                        ))}
                    </ul>
                </div>
                <div>
                    People in group:
                    <ul>
                    {this.props.groupEmailList.map((email, index) => (
                        <li key={index}>{email}</li>
                    ))}
                    </ul>
                </div>
                <div>
                    Duplicates in group:
                    <ul>
                    {Object.keys(this.props.groupDuplicateDict).forEach(k => (
                        <li key={k}>{k} has dupes with {this.props.groupDuplicateDict[k]}</li>
                    ))}
                    </ul>
                </div>
                <div className='bar-chart-style'>
                    <BarChart
                    chartData={captainData}
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