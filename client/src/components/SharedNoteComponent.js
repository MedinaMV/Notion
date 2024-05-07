import { Grid, Paper, Avatar, IconButton, Tooltip } from "@mui/material";
import NoteIcon from '@mui/icons-material/Note';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import URL from "../api/api-calls";

export default function SharedNoteComponent({ title, noteId, type }) {
    const avatar = <NoteIcon />;
    const navigate = useNavigate();

    const viewNote = async () => {
        console.log(type);
        if (type === 'Collection') {
            const request = await fetch(URL + `/collection/${noteId}/getNotesByCollection`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const response = await request.json();
            navigate('/friends/editSharedNotes', { state: { rows: response.notes } });
        } else {
            navigate('/friends/editSharedNotes', { state: { rows: [{ id: noteId, title: title }] } });
        }
    }

    return (
        <Paper elevation={10} style={{ padding: 15, height: '70px', width: 'auto', margin: "15px auto", display: 'flex', alignItems: 'center' }}>
            <Grid container alignItems="center" justifyContent="space-between" style={{ flex: 1 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <Avatar style={{ backgroundColor: '#008fe6' }}>{avatar}</Avatar>
                    <p style={{ margin: 'auto 10px' }}>{title}</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='View friend collections'>
                        <IconButton onClick={viewNote}>
                            <RemoveRedEyeIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
}

