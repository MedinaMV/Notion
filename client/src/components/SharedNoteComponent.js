import { Grid, Paper, Avatar, IconButton, Tooltip } from "@mui/material";
import NoteIcon from '@mui/icons-material/Note';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function SharedNoteComponent({ title, noteId }) {
    const avatar = <NoteIcon />;

    const viewNote = () => {
        console.log(noteId);
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

