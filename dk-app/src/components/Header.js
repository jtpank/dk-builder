import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/styles.css';
class Header extends React.Component {
    render() {
        return(
            <>
            {
                this.props.is_logged_in ? (
                    <div className='splash-header'>
                        <div className='link-header-div'>
                            <Link className='link-header-button' to="/">Home</Link>
                        </div>
                        <div className='link-header-div'>
                            <Link className='link-header-button' to="/team-builder">Team Builder</Link>
                        </div>
                        <div className='link-header-div'>
                        <Link className='link-header-button' to="/charts">Charts</Link>
                        </div>
                        <div className='link-header-div'>
                        <Link className='link-header-button' to="/groups">Groups</Link>
                        </div>
                        <div className='link-header-div'>
                            <Link to="/logout"><button onClick={this.props.handleLogout}>Logout</button> </Link>
                        </div>
                    </div>
                ) : (
                    <div className='splash-header'>
                        <div className='link-header-div'>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                        </div>
                        <div className='link-header-div'>
                            <Link to="/signup">
                                <button>Signup</button>
                            </Link>
                        </div>
                    </div>
                )
            }   
            </>
    
        );
    }
}

export default Header;