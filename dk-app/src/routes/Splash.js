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
        let salaries_disp = <p className='not-uploaded'>Salaries not uploaded!</p>;
        let entries_disp = <p className='not-uploaded'>Entries not uploaded!</p>;
        if(this.props.isSalariesUploaded)
        {
            salaries_disp = <p className='uploaded'>Salaries GOOD!</p>;
        }
        if(this.props.isEntriesUploaded)
        {
            entries_disp = <p className='uploaded'>Entries GOOD!</p>;
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
                            <div>
                            Download Entries from this link (select appropriate lineup):
                                <a target="_blank" rel="noopener noreferrer" href="https://www.draftkings.com/mycontests">Get Entries Csv</a>
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
                            <div>
                            Download Salaries from the same link as entries, but select draft now then export to csv!
                                <a target="_blank" rel="noopener noreferrer" href="https://www.draftkings.com/mycontests">Get Salaries Csv</a>
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
                    {entries_disp}
                    </div>
                    <div>
                    {salaries_disp}
                    </div>
                    <div>
                        <p>Current Contest Entry: {this.props.contestId}</p>
                    </div>
                    <Outlet></Outlet>
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