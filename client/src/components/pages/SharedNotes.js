import React from 'react';
import { Grid } from "@mui/material";
import SharedNoteComponent from "../SharedNoteComponent";
import URL from '../../api/api-calls';
import { useLocation } from 'react-router-dom';

export default function SharedNotes() {
    const [notes, setNotes] = React.useState([]);
    const location = useLocation();

    React.useEffect(() => {
        (async () => {
            const request = await fetch(URL + `/notes/getSharedNotes/${location.state.friend}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            setNotes(response.notes ?? []);
        })();
    }, []);


    return (
        <Grid style={{ margin: "30px 210px" }}>
            <h1>Shared Notes</h1>
            <Grid>
                {notes.map(note => (
                    <SharedNoteComponent
                        key={note._id}
                        title={note.title}
                        noteId={note._id}
                        type={"Note"}
                    />
                ))}
            </Grid>
        </Grid>
    );
}