import { Grid, Paper, Avatar, Button, IconButton } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import GroupIcon from '@mui/icons-material/Group';

export default function UserRow({ type, title, showEdit, handleEdit, handleDelete, userId }) {
    let avatar;
    if(type === 'user') {
        avatar = <PersonIcon />;
    }else if(type === 'note'){
        avatar = <DescriptionIcon />
    }else if(type === 'friend') {
        avatar = <GroupIcon />
    }else {
        avatar = <CollectionsIcon />
    }

    return (
        <Paper elevation={10} style={{ padding: 15, height: '70px', width: 'auto', margin: "15px auto", display: 'flex', alignItems: 'center' }}>
            <Grid container alignItems="center" justifyContent="space-between" style={{ flex: 1 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <Avatar style={{ backgroundColor: '#008fe6' }}>{avatar}</Avatar>
                    <p style={{ margin: 'auto 10px' }}>{title}</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    {showEdit ? <IconButton onClick={() => handleEdit(userId)}>
                        <EditIcon />
                    </IconButton> : <></>}
                    <IconButton onClick={() => handleDelete(userId)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};