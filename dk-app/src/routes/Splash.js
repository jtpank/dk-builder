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
        return (
        <div>
            <div>
                <p>Splash Page</p>
            </div>
            
            <div>
                <FileUpload
                onUploadSuccess={this.props.onUploadSuccess}
                fileName={"DK Salaries"}
                routeName={"salaries"}
                >
                </FileUpload>
            </div>
            <div>
                <FileUpload
                onUploadSuccess={this.props.onUploadSuccess}
                fileName={"Contest Entries"}
                routeName={"entries"}
                >
                </FileUpload>
            </div>
            <div>
                <div>
                <p>{salaries_disp}</p>
                <p>{entries_disp}</p>
                </div>

            <Outlet></Outlet>
            </div>
        </div>
        );
    }
}

export default Splash;