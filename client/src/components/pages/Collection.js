import { Grid, Paper, Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import url from '../../api/api-calls.js';

export default function Collection() {
    const [collections, setCollections] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            const request = await fetch(url + `/collection/getAllCollections`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            setCollections(response.collections ?? [])
        })();
    }, []);

    async function createCollection() {
        let input = prompt('Set a name for your new collection');
        if (input) {
            const request = await fetch(url + '/collection/createCollection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: input }),
                credentials: 'include',
            });
            const response = await request.json();
            const newCollection = { _id: response._id, name: input };
            setCollections([...collections, newCollection]);
        }
    }

    async function deleteCollection(element) {
        const request = await fetch(url + `/collection/${element._id}/deleteCollection`, {
            method: 'DELETE'
        });
        await request.json();
        setCollections(collections.filter(elemento => elemento !== element));
    }

    return (
        <div style={{ display: 'inline', flexDirection: 'row', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {collections.map(element => (
                    <CollectionElement
                        key={element._id}
                        collection={element}
                        deleteCollection={deleteCollection}
                    />
                ))}
                {
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', margin: "70px 20px", }}>
                        <button style={{ padding: 10, height: '200px', width: '200px', borderRadius: '30%', backgroundColor: 'white', fontSize: '40px' }} onClick={createCollection}> New </button>
                    </div>
                }
            </div>
        </div>

    );
}

function CollectionElement({ collection, deleteCollection }) {
    const [notes, setNotes] = React.useState([]);
    const [collectionNotes, setCollectionNotes] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const request = await fetch(url + `/notes/getAllNotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            setNotes(response.notes ?? [])
        })();
    }, []);

    const [selectedValue, setSelectedValue] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    const handleClose1 = (value) => {
        setOpen1(false);
        setSelectedValue(value);
    };

    function deleteCollec() {
        deleteCollection(collection);
    }

    const handleClickOpenViewNotes = async () => {
        const request = await fetch(url + `/collection/${collection._id}/getNotesByCollection`);
        const response = await request.json();
        setCollectionNotes(response.notes);
        setOpen1(true);
    };

    return (
        <>
            <Grid >
                <Paper elevation={10} style={{ padding: 10, height: '300px', width: '300px', margin: "20px 20px" }}>
                    <Grid align='center'>
                        <h2>{collection.name}</h2>
                    </Grid>
                    <Grid style={{ marginTop: '100px' }}>
                        <Button onClick={handleClickOpenViewNotes} style={{ backgroundColor: '#0005d7', margin: "5px auto" }} variant="contained" type='submit' fullWidth>View Notes</Button>
                        <Button onClick={handleClickOpen} style={{ backgroundColor: '#008fe6', margin: "5px auto" }} variant="contained" type='submit' fullWidth>Add Note</Button>
                        <Button onClick={deleteCollec} style={{ backgroundColor: '#ff0018', margin: "5px auto" }} variant="contained" type='submit' fullWidth>Remove Collection</Button>
                    </Grid>
                </Paper>
            </Grid>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                notes={notes}
                collectionId={collection._id}
                show={true}
            />
            <SimpleDialog
                selectedValue={selectedValue}
                open={open1}
                onClose={handleClose1}
                notes={collectionNotes}
                collectionId={collection._id}
                show={false}
            />
        </>
    );
}

function SimpleDialog(props) {
    const { onClose, selectedValue, open, notes, collectionId, show } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = async (value) => {
        const request = await fetch(url + `/collection/${collectionId}/addNote/${value._id}`, {
            method: 'POST'
        });
        await request.json();
        onClose(value);
    };

    const handleListItemClick1 = async (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle> Choose a note </DialogTitle>
            <List sx={{ pt: 0 }}>
                {notes.map((note) => (
                    (show ?
                        (
                            <ListItem disableGutters key={note._id}>
                                <ListItemButton onClick={() => handleListItemClick(note)}>
                                    <ListItemText primary={note.title} />
                                </ListItemButton>
                            </ListItem>
                        ) :
                        (
                            <ListItem disableGutters key={note._id}>
                                <ListItemButton onClick={() => handleListItemClick1(note)}>
                                    <ListItemText primary={note.title} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )

                ))}
                <ListItem disableGutters>
                </ListItem>
            </List>
        </Dialog>
    );
}