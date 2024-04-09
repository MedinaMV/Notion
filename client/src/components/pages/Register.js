import React from 'react';
import { useNavigate } from "react-router-dom";
import { Paper, Grid, Avatar, Button, Typography, Link, Alert, AlertTitle } from '@mui/material';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import TextField from '@mui/material/TextField';

export default function Register() {
    const [user, setUser] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirm_password, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    async function register() {
        setError(null);
        const request = await fetch('/user/register', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ user, email, password, confirm_password })
        })
        const response = await request.json();
        if (response.ok) {
            navigate('/login');
        } else {
            setError(response.message);
        }
    }

    const handleUser = (event) => {
        setUser(event.target.value);
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    }

    return (
        <Grid>
            <Paper elevation={10} style={{ padding: 20, height: '62vh', width: 500, margin: "40px auto" }}>
                <Grid align='center'>
                    <Avatar style={{ backgroundColor: '#008fe6' }}><AppRegistrationOutlinedIcon></AppRegistrationOutlinedIcon></Avatar>
                    <h2>Register</h2>
                </Grid>
                {
                    error ? <Grid>
                        <Alert severity="error"> <AlertTitle>Error</AlertTitle>{error}</Alert>
                    </Grid> : <></>
                }
                <Grid style={{ marginTop: '20px' }} align='center' >
                    <TextField onChange={handleUser} style={{ margin: "10px auto" }} id="outlined-basic" label="User" variant="outlined" type='' fullWidth required />
                    <TextField onChange={handleEmail} style={{ margin: "10px auto" }} id="outlined-basic" label="Email" variant="outlined" type='email' fullWidth required />
                    <TextField onChange={handlePassword} style={{ margin: "10px auto" }} id="outlined-basic" label="Password" variant="outlined" type='password' fullWidth required />
                    <TextField onChange={handleConfirmPassword} style={{ margin: "10px auto" }} id="outlined-basic" label="Repeat Password" variant="outlined" type='password' fullWidth required />
                    <Button onClick={register} style={{ backgroundColor: '#008fe6', margin: "10px auto" }} variant="contained" type='submit' fullWidth>Register</Button>
                    <Typography>
                        Already have an account?<Link href='/login'>Log In</Link>
                    </Typography>
                </Grid>
            </Paper>
        </Grid>
    );
}; 