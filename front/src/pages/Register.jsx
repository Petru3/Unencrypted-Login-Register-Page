import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createAccount } from '../features/account/accountSlice';
import { useState } from 'react';

function generateUniqueId() {
    return (Math.random() + 1).toString(36).substring(2);
}

function Register() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newAccount = {
            id: generateUniqueId(),
            username,
            password
        };

        try {
            const response = await fetch('http://localhost:3000/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const createdAccount = await response.json();
            dispatch(createAccount(createdAccount));
            setUsername(''); // Clear the form after submission
            setPassword('');
            setError(''); // Clear any previous error messages
        } catch (error) {
            console.error('Error creating account:', error);
            setError('Failed to register. Please try again.'); // Provide user feedback
        }
    };

    return (
        <div className='page register'>
            <form onSubmit={handleSubmit}>
                <h1>Register Page</h1>
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
                <button type="submit">Register</button>

                {error && <p className="error">{error}</p>} {/* Display error message if any */}

                <Link to='/'>Already have an account? Login here</Link> {/* Corrected link to point to login page */}
            </form>
        </div>
    );
}

export default Register;
