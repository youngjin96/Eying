import { useEffect, useState } from "react";

import { Button, Grid } from "@mui/material";

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged, deleteUser } from "firebase/auth";

import { auth } from '../Fbase'

const DeleteUser = () => {
    const [userEmail, setUserEmail] = useState("");
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserEmail(user.email);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const onClickDelete = () => {
        axios.delete("https://eying.ga/user/", {
            data: {
                email: userEmail
            }
        }).then(() => {
            deleteUser(user).then(() => {
                alert("정상적으로 회원탈퇴 되었습니다.")
                navigate("/home");
            }).catch(error => {
                alert(error);
            })
        }).catch(error => {
            alert(error);
        })
    }

    return (
        <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
            <Grid item xs={12}>
                <Button onClick={onClickDelete}>회원 탈퇴</Button>
            </Grid>
        </Grid>
    )
}

export default DeleteUser;