import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        age: '',
        password: '',
        role: 'USER'
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/users/signup', {
                ...formData,
                age: Number(formData.age)
            });
            alert('Signup successful! Please login.');
            navigate('/');
        } catch (err: any) {
            console.error('Signup Error:', err);
            setError(err.response?.data?.message || 'Signup failed. Please check your data.');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <button onClick={() => navigate('/')} className="btn-link" style={{ marginBottom: '1rem' }}>
                    &larr; Back to Login
                </button>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>Create Account</h2>

                {error && <div style={{ background: '#ffe5e5', color: '#d32f2f', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="0" />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#f8f9fa' }}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
