import { useEffect, useState } from "react";

import { auth } from '../Fbase'

import axios from 'axios';

import { Button, Grid, Typography } from "@mui/material"

import { onAuthStateChanged } from "firebase/auth";

const UserInformation = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userAge, setUserAge] = useState();
    const [userGender, setUserGender] = useState("");
    const [userJobField, setUserJobField] = useState("");
    const [userJob, setUserJob] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [userPdfCount, setUserPdfCount] = useState("");
    const [userCredit, setUserCredit] = useState();
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('http://52.78.155.2:8000/user/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    console.log(res);
                    setUserName(res.data[0].username);
                    setUserAge(res.data[0].age);
                    setUserGender(res.data[0].gender);
                    setUserJobField(res.data[0].job_field);
                    setUserJob(res.data[0].job);
                    setUserPosition(res.data[0].position);
                    setUserPdfCount(res.data[0].upload_count);
                    setUserCredit(res.data[0].credit);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }, []);

    const onClickBuyPoint = () => {
        console.log("Buy Point");
    }

    return (
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 5 }} columns={{ xs: 3, sm: 6, md: 12 }}>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>이메일 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userEmail}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>이름 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userName}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>나이 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userAge}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>성별 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userGender}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>분야 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userJobField}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>직업 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userJob}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>계급 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userPosition}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>PDF 업로드 횟수 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userPdfCount}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "end" }}>
                <Typography>포인트 :</Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50, textAlign: "start" }}>
                {userCredit}
            </Grid>
            <Grid item xs={12} style={{ marginTop: 50, textAlign: "center" }}>
                <Button 
                    variant="outlined" 
                    onClick={onClickBuyPoint}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    포인트 구매
                </Button>
            </Grid>
        </Grid>
    )
}
export default UserInformation;