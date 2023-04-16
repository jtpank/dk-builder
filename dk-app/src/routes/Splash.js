import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/styles.css';
import FileUpload from '../components/FileUpload';

class Splash extends React.Component {
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

        let viewField = <div>
                            <div>
                                <FileUpload
                                onUploadSuccess={this.props.onUploadSuccess}
                                onUploadContestId={this.props.onUploadContestId}
                                contestId={this.props.contestId}
                                fileName={"Contest Entries"}
                                routeName={"entries"}
                                isDisabled={this.props.isDisabled}
                                >
                                </FileUpload>
                            </div>
                        </div>
        if(this.props.isEntriesUploaded)
        {
            viewField = <div>
                            <div>
                                <FileUpload
                                onUploadSuccess={this.props.onUploadSuccess}
                                onUploadContestId={this.props.onUploadContestId}
                                contestId={this.props.contestId}
                                fileName={"Contest Entries"}
                                routeName={"entries"}
                                isDisabled={this.props.isDisabled}
                                >
                                </FileUpload>
                            </div>
                            <div>
                                <FileUpload
                                onUploadSuccess={this.props.onUploadSuccess}
                                onUploadContestId={this.props.onUploadContestId}
                                contestId={this.props.contestId}
                                fileName={"DK Salaries"}
                                routeName={"salaries"}
                                isDisabled={this.props.isDisabled}
                                >
                                </FileUpload>
                            </div>
                        </div>
        }
        return (
        <div>
            <div>
                <p>Splash Page - Please enter your contests entries and salaries!</p>
            </div>
            {viewField}
            <div>
                <div>
                <p>{entries_disp}</p>
                <p>{salaries_disp}</p>
                <p>Current Contest Entry: {this.props.contestId}</p>
                </div>

            <Outlet></Outlet>
            </div>
        </div>
        );
    }
}

export default Splash;