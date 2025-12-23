import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * AdminDashboard Component
 * ========================
 * This component is strictly for users with the 'ADMIN' role.
 * It fetches all users from the database but filters to show only standard 'USER' accounts
 * for management purposes (as requested).
 */
const AdminDashboard = () => {
    // State to store the list of users fetched from the backend
    const [users, setUsers] = useState<any[]>([]);

    // State to handle loading or error messages
    const [msg, setMsg] = useState('');

    /**
     * useEffect Hook
     * -------------
     * Runs once when the component mounts.
     * Triggers the `fetchUsers` function to populate the table.
     */
    useEffect(() => {
        fetchUsers();
    }, []);

    /**
     * fetchUsers Function
     * -------------------
     * Connects to the Backend API (GET http://localhost:3000/users).
     * Requires a valid JWT token in the Authorization header.
     */
    const fetchUsers = async () => {
        try {
            // 1. Get the JWT token from local storage
            const token = localStorage.getItem('token');

            // 2. Make the API call
            const res = await axios.get('http://localhost:3000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 3. Filter data: The user requested to see "only the role users".
            // So we filter the response to exclude other ADMINs.
            const onlyUsers = res.data.filter((u: any) => u.role === 'USER');

            // 4. Update state
            setUsers(onlyUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMsg('Failed to load users.');
        }
    };

    /**
     * handleDelete Function
     * ---------------------
     * Deletes a specific user by their ID.
     * @param id The ID of the user to delete
     */
    const handleDelete = async (id: string) => {
        // Confirmation dialog to prevent accidental deletion
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');

            // Call DELETE http://localhost:3000/users/:id
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh the list after successful deletion
            fetchUsers();
            alert('User deleted successfully.');
        } catch (error) {
            console.error(error);
            alert('Failed to delete user.');
        }
    };

    return (
        <div className="card" style={{ padding: '0.5rem', marginTop: '20px' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>User Management</h3>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Admin Control Panel - Manage Registered Users
                </p>
            </div>

            {msg && <p style={{ color: 'red', padding: '1rem' }}>{msg}</p>}

            <div className="table-container" style={{ boxShadow: 'none' }}>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u._id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.9em', color: '#666' }}>
                                        {u._id.slice(-6)}...
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{u.username}</td>
                                    <td>{u.email || 'N/A'}</td>
                                    <td>{u.age || '-'}</td>
                                    <td>
                                        {/* Status Badge */}
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
                                            background: '#e0f7fa', color: '#006064', fontWeight: 600,
                                            border: '1px solid #b2ebf2'
                                        }}>
                                            ACTIVE
                                        </span>
                                    </td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="btn-danger"
                                            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                    No 'USER' accounts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
