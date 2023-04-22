import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/styles.css';
import FileUpload from '../components/FileUpload';
import {Link} from 'react-router-dom';

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
                                handleContestUpload={this.props.handleContestUpload}
                                contestId={this.props.contestId}
                                fileName={"Contest Entries"}
                                routeName={"entries"}
                                isDisabled={this.props.isDisabled}
                                _jwt={this.props._jwt}
                                _email={this.props._email}
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
                                handleContestUpload={this.props.handleContestUpload}
                                contestId={this.props.contestId}
                                fileName={"Contest Entries"}
                                routeName={"entries"}
                                isDisabled={this.props.isDisabled}
                                _jwt={this.props._jwt}
                                _email={this.props._email}
                                >
                                </FileUpload>
                            </div>
                            <div>
                                <FileUpload
                                onUploadSuccess={this.props.onUploadSuccess}
                                handleSalaryUpload={this.props.handleSalaryUpload}
                                contestId={this.props.contestId}
                                fileName={"DK Salaries"}
                                routeName={"salaries"}
                                isDisabled={this.props.isDisabled}
                                _jwt={this.props._jwt}
                                _email={this.props._email}
                                >
                                </FileUpload>
                            </div>
                        </div>
        }
        return (
            <>
            {
                this.props.is_logged_in ? (
                <div>
                    <div>
                        <p>Welcome {this.props._email} - Please enter your contests entries and salaries!</p>
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
                ) : 
                (
                    <div>
                        <p>Please Sign Up or Log In!</p>
                        <Outlet></Outlet>
                    </div>
                )
            }
        </>
        );
    }
}

export default Splash;