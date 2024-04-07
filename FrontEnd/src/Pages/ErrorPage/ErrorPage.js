import React from 'react';
import { useNavigate } from 'react-router-dom'
import './ErrorPage.css';

function ErrorPage() {
    let navigate = useNavigate();

    return (
        <div className="err-main">
            <h1>OOPS!</h1>
            <h3>404 - Page not found</h3>
            <p> The page you are looking for does not exist or is temporarily unavailable.</p>
            <button onClick={()=>navigate('/login')}>Go To Login Page</button>
        </div>
    )
}

export default ErrorPage;
