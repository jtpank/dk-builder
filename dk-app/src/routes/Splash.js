import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/styles.css';
import FileUpload from '../components/FileUpload';

class Splash extends React.Component {
    render() {
        return (
        <div>
            <div>
                <p>Splash Page</p>
            </div>
            <div>
                <FileUpload
                fileName={"DK Salaries"}
                >
                </FileUpload>
            </div>
            <div>
                <FileUpload
                fileName={"Contest Entries"}
                >
                </FileUpload>
            </div>
            <div>
            <Outlet></Outlet>
            </div>
        </div>
        );
    }
}

export default Splash;