import React from 'react';
import '../styles/styles.css';
import EntryField from '../components/EntryField';
class TeamBuilder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
      }
    render() {
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
                <p>Team Builder Page -- Contest ID: {this.props.contestId} -- Number of Entries: {this.props.numEntries}</p>
                <p>{salaries_disp}</p>
                <p>{entries_disp}</p>
            </div>
            <div>
            </div>
            <div>
                {/* This is to be a fetch request to the server to lint (or do that browser side)
                then it saves / overwriets with a post fetch request to the server for the
                corresponding email-entry id combinations */}
                <button>TODO: Save and Lint Lineups</button>
            </div>
            <div> 
                {/* Probably easiest to make this browser side... 
                Can only be performed AFTER save and linted*/}
                <button>TODO: Download Lineup CSV</button>
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
            ></EntryField>
            <div>
            </div>
        </div>
        );
    }
}

export default TeamBuilder;