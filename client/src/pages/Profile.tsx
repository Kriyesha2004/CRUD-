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
            await axios.put(`http://localhost:3000/users/${user?.userId}`, {
                username: formData.username,
                email: formData.email,
                age: Number(formData.age),
                profilePicture: formData.profilePicture
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Profile Updated Successfully!');
            setIsEditing(false); // Switch back to view mode
        } catch (error) {
            console.error(error);
            setMsg('Update Failed');
        }
    };

    if (!user) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading User... (If stuck, try logging out and back in)</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '16px' }}>&larr; Back to Dashboard</button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>My Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {msg && <p style={{ color: msg.includes('Failed') ? 'red' : 'green', textAlign: 'center', fontWeight: 'bold' }}>{msg}</p>}

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#f0f0f0',
                    margin: '0 auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {formData.profilePicture ? (
                        <img src={formData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#888' }}>No Photo</span>
                    )}
                </div>
                {isEditing && (
                    <div style={{ marginTop: '15px' }}>
                        <label style={{ cursor: 'pointer', color: '#007bff', fontWeight: 500 }}>
                            Change Photo
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                )}
            </div>

            <form onSubmit={handleUpdate}>
                {/* Username Field */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Username</label>
                    {isEditing ? (
                        <input
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    ) : (
                        <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', color: '#333' }}>{formData.username || 'Not set'}</div>
                    )}
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    ) : (
                        <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', color: '#333' }}>{formData.email || 'Not set'}</div>
                    )}
                </div>

                {/* Age Field */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Age</label>
                    {isEditing ? (
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    ) : (
                        <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', color: '#333' }}>{formData.age || 'Not set'}</div>
                    )}
                </div>

                {isEditing && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); fetchProfile(); }} style={{ flex: 1, padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
