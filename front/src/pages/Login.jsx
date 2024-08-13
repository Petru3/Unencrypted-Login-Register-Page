import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from '../features/account/accountSlice';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/data'); // Changed endpoint for clarity
            const data = await response.json();

            const account = data.find(acc => 
                acc.username === username && acc.password === password
            );

            if (account) {
                dispatch(loginSuccess(account));
                console.log("Login successful");

                navigate('/home')
            } else {
                dispatch(loginFailure());
                setError("Invalid username or password");
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
            setError("An error occurred while logging in");
        }
    }

    return (
        <div className={'login page'}>
            <form onSubmit={handleSubmit}>
                <h1>Login Page</h1>
                <input 
                    type="text" 
                    placeholder="Username..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}

                <Link to={'/register'}>You don&apos;t have already anm account , Please Register here</Link>
            </form>
        </div>
    );
}

export default Login;
