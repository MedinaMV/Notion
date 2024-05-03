import { Grid, Paper, Avatar, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import NoteIcon from '@mui/icons-material/Note';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useNavigate } from "react-router-dom";

export default function FriendRow({ title, handleDelete, userId }) {
    const avatar = <GroupIcon />;
    const navigate = useNavigate();

    const handleNotes = () => {
        navigate('/friends/sharedNotes', {state: {friend: userId}});
    }

    const handleCollections = () => {
        navigate('/friends/sharedCollections');
    }

    return (
        <Paper elevation={10} style={{ padding: 15, height: '70px', width: 'auto', margin: "15px auto", display: 'flex', alignItems: 'center' }}>
            <Grid container alignItems="center" justifyContent="space-between" style={{ flex: 1 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <Avatar style={{ backgroundColor: '#008fe6' }}>{avatar}</Avatar>
                    <p style={{ margin: 'auto 10px' }}>{title}</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='View friend notes'>
                        <IconButton onClick={() => handleNotes(userId)}>
                            <NoteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='View friend collections'>
                        <IconButton onClick={() => handleCollections(userId)}>
                            <CollectionsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete friend'>
                        <IconButton onClick={() => handleDelete(title)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
};