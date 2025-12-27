import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        age: '',
        profilePicture: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user?.userId) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/users/${user?.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Profile Data Fetched:', res.data);
            setFormData({
                username: res.data.username || '',
                email: res.data.email || '',
                age: res.data.age || '',
                profilePicture: res.data.profilePicture || ''
            });
        } catch (e) {
            console.error(e);
            setMsg('Failed to load profile. Please re-login.');
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('age', formData.age);
            if (selectedFile) {
                data.append('profilePicture', selectedFile);
            }

            await axios.put(`http://localhost:3000/users/${user?.userId}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Profile Updated Successfully!');
            setIsEditing(false); // Switch back to view mode
            fetchProfile(); // Refresh to get the actual URL from server
        } catch (error) {
            console.error(error);
            setMsg('Update Failed');
        }
    };

    if (!user) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading User... (If stuck, try logging out and back in)</div>;
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn-link" style={{ fontSize: '1rem' }}>
                        &larr; Back
                    </button>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                            Edit Profile
                        </button>
                    )}
                </div>

                {msg && <div style={{
                    padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center',
                    background: msg.includes('Failed') ? '#ffe5e5' : '#d4edda',
                    color: msg.includes('Failed') ? '#c0392b' : '#155724'
                }}>{msg}</div>}

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="profile-img-container">
                        {formData.profilePicture ? (
                            <img src={formData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>No Photo</div>
                        )}
                    </div>
                    {isEditing && (
                        <div style={{ marginTop: '1rem' }}>
                            <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                Change Photo
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    )}
                    <h2 style={{ marginTop: '1.5rem', fontSize: '2rem' }}>{formData.username || 'User'}</h2>
                    <p style={{ color: 'var(--text-light)' }}>{user?.role}</p>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Username</label>
                        {isEditing ? (
                            <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                        ) : (
                            <div style={{ padding: '0.85rem 1rem', background: '#f8f9fa', borderRadius: '8px', color: '#555' }}>
                                {formData.username || 'N/A'}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        {isEditing ? (
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        ) : (
                            <div style={{ padding: '0.85rem 1rem', background: '#f8f9fa', borderRadius: '8px', color: '#555' }}>
                                {formData.email || 'N/A'}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Age</label>
                        {isEditing ? (
                            <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                        ) : (
                            <div style={{ padding: '0.85rem 1rem', background: '#f8f9fa', borderRadius: '8px', color: '#555' }}>
                                {formData.age || 'N/A'}
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                            <button type="button" onClick={() => { setIsEditing(false); fetchProfile(); }} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
