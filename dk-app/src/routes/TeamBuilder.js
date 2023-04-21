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
                <p>Team Builder Page -- Contest ID: {this.props.contestId}</p>
                <p>{salaries_disp}</p>
                <p>{entries_disp}</p>
            </div>
            <div>
                {/* <DropdownSelector
                contestId={this.props.contestId}
                playerDict={this.props.homeSalaryDict}
                ></DropdownSelector>
                <DropdownSelector
                contestId={this.props.contestId}
                playerDict={this.props.awaySalaryDict}
                ></DropdownSelector> */}
            </div>
            <div>
                <button>Save and Lint Lineups</button>
            </div>
            <div>
                <button>Download Lineup CSV</button>
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