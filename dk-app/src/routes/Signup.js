import React from 'react';
import SignupForm from '../components/SignupForm';
class Signup extends React.Component {
    render() {
        return (
            <div className=''>
                <div className=''>
                    <p>Signup Route Render</p>
                </div>
                <div className=''>
                    <div className=''>
                       
                    </div>
                    <div className=''>
                        <SignupForm handleCookiesUpdate={this.props.handleCookiesUpdate}></SignupForm>
                    </div>
                    <div className=''>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;