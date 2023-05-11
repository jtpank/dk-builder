import React from 'react';
import '../styles/styles.css';
import EntryField from '../components/EntryField';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { BarChart } from '../components/BarChart';
class TeamBuilder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
      }
    render() {
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
        const totalCaptainArray = [...captainMap.entries()];
        totalCaptainArray.sort((a, b) => b[1] - a[1]);
        const captainData =
        {
            labels: totalCaptainArray.map(item => item[0]), 
            datasets: [
            {
                label: "Percent Exposed ",
                data: totalCaptainArray.map(item => item[1]).map(val =>  ((val/(entries))*100.0)),
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

        const totalPlayerArray = [...totalPlayerMap.entries()];
        totalPlayerArray.sort((a, b) => b[1] - a[1]);
        const utilityData =
        {
            labels: totalPlayerArray.map(item => item[0]),
            datasets: [
            {
                label: "Percent Exposed ",
                data: totalPlayerArray.map(item => item[1]).map(val => ((val/(entries))*100.0)),
            }
            ]
        }
        let salaries_disp = "Salaries not uploaded!";
        let entries_disp = "Entries not uploaded!";
        if(this.props.isSalariesUploaded)
        {
            salaries_disp = "Salaries GOOD!";
        }
        if(this.props.isEntriesUploaded)
        {
            entries_disp = "Entries GOOD!";
        }
        return (
        <div>
            <div>
                <p>Team Builder Page -- Contest ID: {this.props.contestId} -- Contest Name: {this.props.contestName} -- Number of Entries: {this.props.numEntries}</p>
                <p>{salaries_disp}</p>
                <p>{entries_disp}</p>
            </div>
            <div>
            </div>
            <div>
                <button
                onClick={this.props.handleSaveLintLineups}
                >Save and Lint Lineups</button>
            </div>
            <div>
                <button
                onClick={this.props.handleDownloadLineupCsv}
                >Download Lineup CSV</button>
            </div>
            <div>
                {/* Fetch get request to load current lineups 
                ALSO: (need to ensure that past lineups are READ ONLY) */}
                <button>TODO: Load Saved Lineups</button>
            </div>
            <div>
                Upload using this link:
                <a target="_blank" rel="noopener noreferrer" href="https://www.draftkings.com/entry/upload">Entry Upload!</a>
            </div>
            <EntryField
            key={"_entry_field_0"}
            numEntries={this.props.numEntries}
            contestName={this.props.contestName}
            contestId={this.props.contestId}
            utilityDict={this.props.utilSalaryDict}
            captainDict={this.props.cptSalaryDict}
            allLineups={this.props.allLineups}
            handleSelectCaptain={this.props.handleSelectCaptain}
            handleSelectUtility={this.props.handleSelectUtility}
            handleSetEntryTableRowCaptain={this.props.handleSetEntryTableRowCaptain}
            isCaptainSet={this.props.isCaptainSet}
            handleSetEntryTableRowUtility={this.props.handleSetEntryTableRowUtility}
            isUtilitySet={this.props.isUtilitySet}
            failureDict={this.props.failureDict}
            duplicateUserLineupsDict={this.props.duplicateUserLineupsDict}
            ></EntryField>
            <div>
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
        );
    }
}

export default TeamBuilder;