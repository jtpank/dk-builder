import React from 'react';
import { Navigate } from "react-router-dom";
class Logout extends React.Component {
    render() {
        return (
            <Navigate to="/" replace={true} />
        );
    }
}

export default Logout;