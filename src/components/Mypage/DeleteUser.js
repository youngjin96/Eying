import { useEffect, useState } from "react";

import { Button, Grid } from "@mui/material";

import axios from 'axios';

import Swal from 'sweetalert2'

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
        deleteUser(user).then(() => {
            axios.delete("https://eying.ga/user/", {
                data: {
                    email: userEmail
                }
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '회원 탈퇴',
                    html: '회원 탈퇴되었습니다.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                }).then(() => {
                    navigate("/home");
                });
            })
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: '회원 탈퇴',
                html: '회원 탈퇴를 위해 로그아웃 후 재로그인해주세요.',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
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