import React from 'react';
import UserRow from '../UserRow';
import { Grid, Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';
import URL from '../../api/api-calls';

export default function AdminUserSettings() {
    const [elementType, setElementType] = React.useState('note');
    const [elements, setElements] = React.useState([]);
    const [friends, setFriends] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(null);
    const { state } = useLocation();
    const userId = state.userId;
    React.useEffect(() => {
        (async () => {
            await searchNotes();
            const request = await fetch(URL + `/admin/getAllUsers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            setFriends(response.users ?? []);
        })();
    }, []);

    const searchNotes = async () => {
        const request = await fetch(URL + `/admin/getAllUserNotes/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        setElements(response.notes ?? []);
        setElementType('note');
    }

    const searchCollections = async () => {
        const request = await fetch(URL + `/admin/getAllUserCollections/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        console.log(response.collections);
        setElements(response.collections ?? []);
        setElementType('collection');
    };

    const searchFriends = async () => {
        const request = await fetch(URL + `/admin/getAllUserFriends/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        let list = [];
        response.friends.map((friend) => {
            friend.friends.map((friend) => {
                list.push(friend);
            });
        })
        setElements(list);
        setElementType('friends');
    };

    const handleClick = () => {
        if (elementType === 'note') {
            createNote();
        } else if (elementType === 'collection') {
            createCollection();
        } else {
            createFriend();
        }
    }

    const handleDelete = (userId) => {
        if (elementType === 'note') {
            deleteNote(userId);
        } else if (elementType === 'collection') {
            deleteCollection(userId);
        } else {
            deleteFriend(userId);
        }
    }

    const createNote = async () => {
        let title = prompt('Set a title for the new Note');
        if (title) {
            const request = await fetch(URL + `/admin/createNote/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title }),
                credentials: 'include',
            });
            await request.json();
            await searchNotes();
        }
    };

    const deleteNote = async (id) => {
        const request = await fetch(URL + `/admin/removeNote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        await request.json();
        await searchNotes();
    };

    const createCollection = async () => {
        let title = prompt('Set a title for the new Collection');
        if (title) {
            const request = await fetch(URL + `/admin/createCollection/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: title }),
                credentials: 'include',
            });
            await request.json();
            await searchCollections();
        }
    };

    const deleteCollection = async (id) => {
        const request = await fetch(URL + `/admin/removeCollection/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        await request.json();
        await searchCollections();
    };

    const createFriend = async () => {
        setOpen(true);
    };

    const deleteFriend = async (id) => {
        const request = await fetch(URL + `/admin/removeFriends/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friendId: id }),
            credentials: 'include',
        });
        await request.json();
        await searchFriends();
    };

    const handleClose = async (value) => {
        setOpen(false);
        if (value) {
            const request = await fetch(URL + `/admin/addFriends/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: value.user, id: value._id }),
                credentials: 'include',
            });
            await request.json();
            await searchFriends();
        }
        setSelectedValue(value);
    };

    return (
        <Grid style={{ margin: "30px 250px" }}>
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
                        <FormControlLabel value="notes" control={<Radio onClick={searchNotes} />} label="Manage Notes" />
                        <FormControlLabel value="collections" control={<Radio onClick={searchCollections} />} label="Manage Collections" />
                        <FormControlLabel value="friends" control={<Radio onClick={searchFriends} />} label="Manage Friendships" />
                    </RadioGroup>
                </FormControl>
                {elements.map(element => (
                    <UserRow
                        key={element._id}
                        title={element.title}
                        type={element.type}
                        userId={element._id}
                        showEdit={false}
                        handleDelete={handleDelete}
                    />
                ))}
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleClick}> New </Button>
                </Grid >
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                    elements={friends}
                />
            </Grid>
        </Grid>
    );
};

function SimpleDialog(props) {
    const { onClose, selectedValue, open, elements } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle> Choose a user </DialogTitle>
            <List sx={{ pt: 0 }}>
                {elements.map((note) => (
                    <ListItem disableGutters key={note._id}>
                        <ListItemButton onClick={() => handleListItemClick(note)}>
                            <ListItemText primary={note.user} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disableGutters>
                </ListItem>
            </List>
        </Dialog>
    );
}