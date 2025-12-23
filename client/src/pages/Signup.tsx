import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        age: '',
        password: '',
        role: 'USER' // Default role
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Age</label>
                    <input name="age" type="number" value={formData.age} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
