import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [myProfile, setMyProfile] = useState<any>({});
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
        }
        // In a real app we would fetch the full profile here, 
        // using the ID from the token `user.userId`.
        // For simplicity, reusing the token data or fetching if needed.
        setNewName(user?.username || '');
    }, [user]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleUpdateName = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/users/${user?.userId}`, {
                username: newName
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Name updated!');
            // Ideally update context or force re-login
        } catch (error) {
            console.error(error);
            alert('Update failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard</h1>
                <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </div>

            <h3>Welcome, {user?.username} ({user?.role})</h3>

            {user?.role === 'USER' && (
                <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
                    <h4>Update Profile</h4>
                    <p>You can only update your name.</p>
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New Username"
                    />
                    <button onClick={handleUpdateName} style={{ marginLeft: '10px' }}>Update Name</button>
                </div>
            )}

            {user?.role === 'ADMIN' && (
                <div style={{ marginTop: '20px' }}>
                    <h4>All Users</h4>
                    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u._id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.age}</td>
                                    <td>{u.role}</td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}</td>
                                    <td>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : 'N/A'}</td>
                                    <td>
                                        <button onClick={() => handleDelete(u._id)} style={{ color: 'red' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
