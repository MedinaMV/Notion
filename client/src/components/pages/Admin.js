import React from 'react';
import { Grid } from '@mui/material';
import UserRow from '../UserRow.js';
import { useNavigate } from "react-router-dom";
import url from '../../api/api-calls.js'

export default function AdminPanel() {
    const [users, setData] = React.useState([]);
    const navigation = useNavigate();

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure about deleting this user?')) {
            const request = await fetch(url + `/admin/removeUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            if (response.ok) {
                await getAllUsers();
            }
        }
    };

    const getAllUsers = async () => {
        const request = await fetch(url + `/admin/getAllUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        setData(response.users ?? [])
    }

    React.useEffect(() => {
        (async () => {
            await getAllUsers();
        })();
    }, []);

    const handleEditing = (userId) => {
        navigation('/admin/userSettings', { state: { userId: userId } });
    };

    return (
        <Grid style={{ margin: "30px 250px" }}>
            <Grid >
                <h1>User Management</h1>
                {users.map(user => (
                    <UserRow
                        key={user._id}
                        title={user.user}
                        userId={user._id}
                        type={'user'}
                        showEdit={true}
                        handleEdit={handleEditing}
                        handleDelete={deleteUser}
                    />
                ))}
            </Grid>
        </Grid>

    );
};