import { Grid, Paper, Avatar, IconButton, Tooltip } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import URL from "../api/api-calls";

export default function Request({ title, requestId, onClose }) {
    const avatar = <GroupIcon />;

    const handleRequest = async (flag) => {
        const request = await fetch(URL + `/user/manageFriendRequest`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ requestId, flag }),
            credentials: 'include',
        });
        const response = await request.json();
        onClose();
    }

    return (
        <Paper elevation={10} style={{ padding: 15, height: '70px', width: 'auto', margin: "15px auto", display: 'flex', alignItems: 'center' }}>
            <Grid container alignItems="center" justifyContent="space-between" style={{ flex: 1 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <Avatar style={{ backgroundColor: '#008fe6' }}>{avatar}</Avatar>
                    <p style={{ margin: 'auto 10px' }}>{title}</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Deny Request'>
                        <IconButton onClick={() => handleRequest(0)}>
                            <DoDisturbIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Approve Request'>
                        <IconButton onClick={() => handleRequest(1)}>
                            <CheckCircleOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
};