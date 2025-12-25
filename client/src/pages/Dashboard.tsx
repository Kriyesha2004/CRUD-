import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>
                        {user?.role! === 'ADMIN' ? 'Admin Portal' : 'User Dashboard'}
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                        Welcome back, <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{user?.username}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/profile')} className="btn btn-primary">
                        My Profile
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary">
                        Logout
                    </button>
                </div>
            </div>

            {/* Role-Based Content Rendering */}
            {user?.role === 'ADMIN' ? (
                // If ADMIN, render the separate Admin Dashboard component
                <AdminDashboard />
            ) : (
                // If USER, render the User Welcome View
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2b2d42' }}>We're glad you're here!</h2>
                    <p style={{ color: '#6c757d', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        You can view and update your personal details in the Profile section.
                    </p>
                    <button onClick={() => navigate('/profile')} className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                        Go to My Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
