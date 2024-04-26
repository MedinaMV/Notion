import React from 'react';
import { Grid, Paper, Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, Button } from '@mui/material';
import UserRow from '../UserRow.js';
import AddIcon from '@mui/icons-material/Add';

export default function AdminPanel() {
    const [editing, setEditing] = React.useState(false);

    const data = [
        { id: 1, title: 'User 1', type: 'user' },
        { id: 2, title: 'User 2', type: 'user' },
        { id: 4, title: 'User 3', type: 'user' },
        { id: 5, title: 'User 4', type: 'user' },
        { id: 7, title: 'User 5', type: 'user' },
        { id: 8, title: 'User 6', type: 'user' },

    ];

    const [users, setData] = React.useState(data);

    const handleEditing = () => {
        setEditing(true);
    };

    const deleteUser = () => {

    };

    return (
        <Grid style={{ margin: "30px 100px" }}>
            {editing ? (
                <UserManagement />
            ) : (
                <Grid >
                    <h1>User Management</h1>
                    {users.map(user => (
                        <UserRow
                            key={user.id}
                            title={user.title}
                            type={user.type}
                            showEdit={true}
                            handleEdit={handleEditing}
                            handleDelete={deleteUser}
                        />
                    ))}
                </Grid>
            )}
        </Grid>

    );
};

function UserManagement({ user }) {
    const data = [
        { id: 3, title: 'Note 1', type: 'note' },
        { id: 6, title: 'Note 2', type: 'note' },
        { id: 9, title: 'Note 3', type: 'note' },
    ];
    const [elements, setElements] = React.useState(data);
    
    const searchNotes = () => {
        const notes = [
            { id: 3, title: 'Note 1', type: 'note' },
            { id: 6, title: 'Note 2', type: 'note' },
            { id: 9, title: 'Note 3', type: 'note' },
        ];
        setElements(notes);
    };

    const searchCollections = () => {
        const collections = [
            { id: 3, title: 'Collection 1', type: 'collection' },
            { id: 6, title: 'Collection 2', type: 'collection' },
            { id: 9, title: 'Collection 3', type: 'collection' },
        ];
        setElements(collections);
    };

    const searchFriends = () => {
        const friends = [
            { id: 3, title: 'Friend 1', type: 'friend' },
            { id: 6, title: 'Friend 2', type: 'friend' },
            { id: 9, title: 'Friend 3', type: 'friend' },
        ];
        setElements(friends);
    };

    const deleteNote = () => {

    };

    return (
        <Grid >
            <h1>User Management</h1>
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Options</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue='notes'
                >
                    <FormControlLabel value="notes" control={<Radio defaultChecked onClick={searchNotes} />} label="Manage Notes" />
                    <FormControlLabel value="collections" control={<Radio onClick={searchCollections}/>} label="Manage Collections" />
                    <FormControlLabel value="friends" control={<Radio onClick={searchFriends}/>} label="Manage Friendships" />
                </RadioGroup>
            </FormControl>
            {elements.map(element => (
                <UserRow
                    key={element.id}
                    title={element.title}
                    type={element.type}
                    showEdit={false}
                    handleDelete={deleteNote}
                />
            ))}
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" startIcon={<AddIcon />}> New </Button>
            </Grid >

        </Grid>
    );
};