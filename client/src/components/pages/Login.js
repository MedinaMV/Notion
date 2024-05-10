import React from 'react';
import { useNavigate } from "react-router-dom";
import { Paper, Grid, Avatar, Button, Typography, Link, Alert, AlertTitle } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';
import url from '../../api/api-calls.js';

export default function Login({ setLoggedIn, setAdmin }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();

    async function login() {
        setError(null);
        const request = await fetch(url + '/user/logIn', {
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({email,password})
        });
        const response = await request.json();
        if(response.ok) {
            Cookies.set('userId', response.user);
            setLoggedIn(true);
            setAdmin(response.role === 'ADMIN' ? true : false);
            window.sessionStorage.setItem('role', response.role);
            response.role === 'ADMIN' ? navigate('/admin') : navigate('/');
        } else {
            setError(response.message);
        }
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    return (
        <Grid>
            <Paper elevation={10} style={{padding: 20, height: '500px', width: 500, margin: "40px auto"}}>
                <Grid align = 'center'>
                    <Avatar style={{backgroundColor: '#008fe6'}}><LockOutlinedIcon></LockOutlinedIcon></Avatar>
                    <h2>Log In</h2>
                </Grid>
                {
                    error ? <Grid>
                        <Alert severity="error"> <AlertTitle>Error</AlertTitle>{error}</Alert>
                    </Grid> : <></>
                }
                <Grid style={{marginTop: '25px'}} align = 'center' >
                    <TextField onChange={handleEmail} style={{margin: "10px auto"}} id="outlined-basic" label="Email" variant="outlined" type='email' fullWidth required/>
                    <TextField onChange={handlePassword} style={{margin: "20px auto"}} id="outlined-basic" label="Password" variant="outlined" type='password' fullWidth/>
                    <Button onClick={login} style={{backgroundColor: '#008fe6', margin: "10px auto"}} variant="contained" type='submit' fullWidth>Log In</Button>
                    <Typography>
                        Do you have an account?<Link href='/register'>Register</Link>
                    </Typography>
                </Grid>
            </Paper>
        </Grid>
    );
}; 