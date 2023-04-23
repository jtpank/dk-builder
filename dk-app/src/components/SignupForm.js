import React from 'react';
import { Navigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import '../styles/styles.css';
class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _registered: false,
            _error_message: "none",
            _is_error: false,
            _email_address: "",
            _username: "",
            _password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signupUser = this.signupUser.bind(this);
    }
    //async function loginUser(credentials)
    //  then fetch('/api/login) as a POST
    async signupUser(credentials) {
        const base_url = 'http://127.0.0.1:8000/api/signup'
        fetch(base_url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin" : "*"
                    },
                    body: JSON.stringify({credentials})
                })
        .then(response => response.json())
        .then(data => {
            if(data.msg) {
                this.setState({ 
                _error_message: data.msg.toString(), 
                _is_error: true });
            }
            if(data.success) {
                this.setState({ 
                _is_error: false,
                _registered: true });
            }
            const base_url_2 = 'http://127.0.0.1:8000/api/login'
            return fetch(base_url_2, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin" : "*"
                },
                body: JSON.stringify({credentials})
            }).then(response => response.json())
            .then(data => {
                const newData = {
                    email: this.state._email_address,
                    jwt_token: data.access_token,
                    is_logged_in: true
                }
                this.props.handleCookiesUpdate(newData);
                this.setState({
                    _password: "",
                })
            });
        });

    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log("set state in handleChange")
        this.setState({
            [name]: value
        });
    }
    async handleSubmit(event) {
        event.preventDefault();
        const email = this.state._email_address;
        const username = this.state._username;
        const password = this.state._password;
        await this.signupUser({
            email,
            username,
            password
        });
    }
    render() {
        return (
            <div className='container-fluid signup-form'>
            {this.state._registered && (
                <Navigate to="/" replace={true} />
            )}
            <form onSubmit={this.handleSubmit}>
                
                <Alert show={this.state._is_error} variant='danger'>
                    <Alert.Heading>Oops, there was an error:</Alert.Heading>
                    <p>{this.state._error_message}</p>
                </Alert>
                <h3>Sign Up</h3>
                <div className="mb-3">
                <label>Email address</label>
                    <input
                        type="email"
                        name="_email_address"
                        className="form-control"
                        placeholder="Enter email"
                        defaultValue={this.state._email_address}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="mb-3">
                <label>Username</label>
                    <input
                        type="text"
                        name="_username"
                        className="form-control"
                        placeholder="Enter Username"
                        defaultValue={this.state._username}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="mb-3">
                <label>Password</label>
                    <input
                        type="password"
                        name="_password"
                        className="form-control"
                        placeholder="Enter password"
                        defaultValue={this.state._password}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="mb-3">
                {/* <div className="custom-control custom-checkbox">
                    <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customCheck1"
                    />
                    <label className="custom-control-label" htmlFor="customCheck1">
                    Remember me
                    </label>
                </div> */}
                </div>
                <div className="d-grid">
                <button className="kave-btn" type='submit'>
                    <span className="kave-line"></span>
                    <span className="button-text">Sign In!</span>
                </button>
                </div>
            </form>
            </div>
        );
    }
}

export default SignupForm;
