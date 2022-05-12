import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';

import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "./Fbase";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            console.log(value);
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onClickLogin = () => {
        setPersistence(auth, browserSessionPersistence).then(() => {
            return signInWithEmailAndPassword(auth, email, password).then(() => {
                navigate("/home");
            });
        }).catch((error) => {
            alert(error.message);
        });
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        signInWithPopup(auth, provider).then(() => {
            navigate("/home");
        }).catch((error) => {
            console.log(error);
        });
    }

    const onClickEnroll = () => {
        navigate("/enroll");
    }

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            onClickLogin();
        }
    }

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '79vh' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid
                    container
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    spacing={2}
                    style={{ textAlign: "center" }}
                >
                    <Grid item xs={12}>
                        <TextField
                            label="Email Address"
                            name="email"
                            onChange={onChange}
                            style={{ width: "50%" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            onChange={onChange}
                            onKeyPress={onKeyPress}
                            style={{ width: "50%" }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            onClick={onClickLogin}
                            style={{ color: "black", borderColor: "#a8a9a8", width: "50%" }}
                        >
                            로그인
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={signInWithGoogle}
                            style={{ color: 'black', textTransform: "none" }}
                        >
                            Continue With Google
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={onClickEnroll}
                            style={{ color: 'black', marginLeft: 10 }}
                        >
                            회원가입
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;