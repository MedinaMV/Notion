import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Snackbar } from '@mui/material';
import url from '../api/api-calls.js';
import React from 'react';

export default function NoteRow({ noteRow, manageNoteRows, setNoteSelected }) {
  const [friends, setFriends] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const request = await fetch(url + `/user/getAllFriends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const response = await request.json();
      setFriends(response.friends ?? []);
    })();
  }, []);

  async function handleClick() {
    const request = await fetch(url + `/notes/${noteRow._id}/getNote`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const response = await request.json();
    setNoteSelected({ title: noteRow.title, paragraphs: response.elements, noteId: noteRow._id });
  }

  const handleCloseDialog = (value) => {
    setOpenDialog(false);
    setSelectedValue(value);
  };

  const shareNote = async (friendId) => {
    const request = await fetch(url + `/notes/shareNote`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ noteId: noteRow._id, userId: friendId }),
      credentials: 'include',
    });
    const response = await request.json();
    setMessage(response.message);
    setOpen(true);
    handleCloseDialog();
  }

  const handleShare = async () => {
    setOpenDialog(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  async function deleteNote() {
    if (window.confirm('Are you sure about deleting this note?')) {
      const request = await fetch(url + `/notes/${noteRow._id}/deleteNote`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include'
      });
      await request.json();
      manageNoteRows(noteRow, true);
      setNoteSelected(null);
    }
  }

  return (
    <div onClick={handleClick} className="noteRow">
      <p className="noteRowTitle"> {noteRow.title} </p>
      <button onClick={handleShare} className='noteRowButton'> 🔗 </button>
      <button onClick={deleteNote} className='noteRowButton'> ❌ </button>
      <SimpleDialog
        selectedValue={setSelectedValue}
        open={openDialog}
        onClose={handleCloseDialog}
        friends={friends}
        shareNote={shareNote}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
}

function SimpleDialog(props) {
  const { onClose, selectedValue, open, friends, shareNote } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle> Choose a friend to share the note </DialogTitle>
      <List sx={{ pt: 0 }}>
        {friends.map((friend) => (
          <ListItem disableGutters key={friend._id}>
            <ListItemButton onClick={() => shareNote(friend.friendId)}>
              <ListItemText primary={friend.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}