import { useEffect, useState } from "react";

import { auth } from '../Fbase'

import axios from 'axios';

import { Button, Grid, Typography, TextField } from "@mui/material"

import { useNavigate } from "react-router-dom"

import { onAuthStateChanged, updateEmail } from "firebase/auth";

var userUpdateEmail = "";

const ChangeUserInformation = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('http://13.125.233.170:8000/user/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {

                }).catch((error) => {
                    console.log(error);
                });
            }
        });

    }, []);


    const onClickChangeEmail = () => {
        const user = auth.currentUser;
        updateEmail(user, userUpdateEmail).then(() => {
            axios.put('http://13.125.233.170:8000/user/', {
                email: userEmail,
                new_email: userUpdateEmail
            })
        }).catch((error) => {
            alert("재로그인 후 시도해주세요.")
        })
    }

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            userUpdateEmail = value;
        }
    }

    return (
        <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Typography>이메일</Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                {userEmail}
            </Grid>
            <Grid item xs={3} style={{ marginTop: 30 }}>
                <TextField
                    variant="standard"
                    name="email"
                    label="Email"
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3} style={{ marginTop: 50 }}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeEmail}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    변경하기
                </Button>
            </Grid>
        </Grid>
    )
}

export default ChangeUserInformation;