import React from 'react';
import '../styles/styles.css';
import DragAndDrop from '../components/DragAndDrop';
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
            <EntryField></EntryField>
            <div>
                <DragAndDrop></DragAndDrop>
            </div>
        </div>
        );
    }
}

export default TeamBuilder;