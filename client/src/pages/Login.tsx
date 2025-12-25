import React, { useState, useContext, type FormEvent } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/users/login', { username, password });
            // [SECURITY] Storing the token in localStorage. 
            // Note: For higher security, consider HttpOnly cookies to prevent XSS.
            // However, localStorage is acceptable for this demo if XSS is mitigated elsewhere.
            login(response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>Welcome Back</h2>
                {error && <div style={{ background: '#ffe5e5', color: '#d32f2f', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Log In
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6c757d' }}>
                    Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
