import React from 'react';
import LoginForm from '../components/LoginForm';
class Login extends React.Component {
    render() {
        return (
            <div className=''>
                <div className=''>
                    <p>Login Route Render</p>
                </div>
                <div className=''>
                    <div className=''>
                       
                    </div>
                    <div className=''>
                        <LoginForm handleCookiesUpdate={this.props.handleCookiesUpdate}></LoginForm>
                    </div>
                    <div className=''>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;