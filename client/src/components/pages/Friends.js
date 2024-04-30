import React from 'react';
import { Grid, Badge, IconButton, TextField, Tooltip, Snackbar, Dialog, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";
import url from '../../api/api-calls.js';
import FriendRow from '../FriendRow.js';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import Request from '../Request.js';

export default function Friends() {
    const [friends, setFriends] = React.useState([]);
    const [friendsRequests, setFriendsRequests] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [friend, setFriend] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState(null);
    const navigation = useNavigate();

    const handleSearchFriend = (event) => {
        setFriend(event.target.value);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = (value) => {
        setOpenDialog(false);
        setSelectedValue(value);
        handleMethodCall();
    };

    const deleteFriend = () => {
        alert('Borrado de amigo');
    }

    const sendFriendRequest = async () => {
        const request = await fetch(url + '/user/addFriend', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ friend: friend }),
            credentials: 'include',
        });
        const response = await request.json();
        setMessage(response.message);
        setOpen(true);
    }

    const handleMethodCall = React.useCallback(async () => {
        const request = await fetch(url + `/user/getAllFriends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        setFriends(response.friends ?? []);
        const request1 = await fetch(url + `/user/getAllFriendRequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response1 = await request1.json();
        setFriendsRequests(response1.mailbox ?? []);
    }, []);

    React.useEffect(() => {
        (async () => {
            handleMethodCall();
        })();
    }, []);

    return (
        <Grid style={{ margin: "30px 210px" }}>
            <h1>Friends</h1>
            <Grid container justifyContent="flex-end">
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={open}
                    autoHideDuration={3500}
                    onClose={handleClose}
                    message={message}
                />
                <SimpleDialog
                    selectedValue={setSelectedValue}
                    open={openDialog}
                    onClose={handleCloseDialog}
                    requests={friendsRequests}
                />
                <TextField onChange={handleSearchFriend}
                    id="standard-search"
                    label="Search for new friends"
                    type="search"
                    variant="standard"
                />
                <Tooltip title='Search friend'>
                    <IconButton onClick={sendFriendRequest}>
                        <SearchIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Friend Requests'>
                    <IconButton onClick={handleClickOpen} aria-label="mailbox">
                        <Badge badgeContent={friendsRequests.length} color="secondary">
                            <MailIcon color="action" />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid>
                {friends.map(friend => (
                    <FriendRow
                        key={friend._id}
                        title={friend.title}
                        userId={friend._id}
                        handleDelete={deleteFriend}
                    />
                ))}
            </Grid>
        </Grid>

    );
}

function SimpleDialog(props) {
    const { onClose, selectedValue, open, requests } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle> Mailbox </DialogTitle>
            <List sx={{ pt: 0 }}>
                {requests.map((request) => (
                    <ListItem disableGutters key={request._id}>
                        <Request
                            title={request.sender}
                            requestId={request._id}
                            onClose={handleClose}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}