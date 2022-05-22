import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { Button, Grid, Box, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { Link } from 'react-router-dom';

import IsLoading from "./Environment/IsLoading";
import IsLoggedIn from "./Environment/IsLoggedIn";
import IsUploading from "./Environment/IsUploading";
import IntroduceVideo from "./Environment/IntroduceVideo";
import { auth } from './Fbase';
import { onAuthStateChanged } from "firebase/auth";

const jobFields = [
    "Art",
    "Education",
    "Fashion",
    "Food",
    "Insurance",
    "IT",
    "Law",
    "Marketing",
    "Medical",
    "Sports",
    "Student",
    "Other"
];

const Upload = () => {
    const [isLoading, setIsLoading] = useState(true); // 로그인 판별을 위한 로딩 변수
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 유무 판별 변수
    const [isUploading, setIsUploading] = useState(false);

    const [email, setEmail] = useState(""); // 유저 이메일 변수
    const [jobField, setJobField] = useState(""); // PDF 올릴 때 종류 변수

    // 처음 렌더링 후 유저가 로그인이 되어있는지 확인 로그인한 상태가 아니라면 로그인 페이지로 이동
    useEffect(() => {
        // 유저 정보 가져오는 함수
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setEmail(user.email);
                    setIsLoggedIn(true);
                }
                setIsLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // PDF 업로드 함수
    const handlePdfFileChange = (e) => {
        setIsUploading(true);
        var frm = new FormData();
        frm.append("pdf", e.target.files[0]);
        frm.append("email", email);
        frm.append("job_field", jobField);
        axios.post('https://eying.ga/pdf/', frm).then(res => {
            setIsUploading(false);
            alert("업로드가 완료되었습니다.");
        }).catch(error => {
            setIsUploading(false);
            alert(error.response.data.error_message);
        })
    };

    // PDF 종류 골랐을 때
    const handleChange = (event) => {
        setJobField(event.target.value);
    };

    // 로딩 중일 때 보여줄 화면
    if (isLoading) return (
        <IsLoading />
    )

    // 로그인이 안 되어 있을 때 보여줄 다이얼로그
    else if (!isLoggedIn) return (
        <IsLoggedIn />
    )

    else if (isUploading) return (
        <IsUploading />
    )
    // 본 페이지
    else return (
        <>
            <Box
                sx={{
                    marginTop: 4,
                    width: '100%',
                    height: '100%',
                    display: 'column',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }}>
                    <Grid item xs={3} style={{ textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            P r o c e s s
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Follow The Prearranged Procedure
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 10 }}>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <UploadFileOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            1. Upload
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Upload your PDF
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <VisibilityOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            2. Prediction
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Collect your gaze
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <PersonSearchOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            3. Collect
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Collect your gaze
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <DifferenceOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            4. Compare
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Compare your gaze with others
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <ArticleOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            5. Show
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Show you compared results
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <RecommendOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            6. Recommendation
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Recommend you how to arrange
                        </Typography>
                    </Grid>
                </Grid>
                <hr style={{ marginTop: 40 }} />
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 20 }}>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            U s e
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Follow Left To Right
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 5 }}>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            1. Choose Job Field & Click This Button
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            To Upload Your PDF
                        </Typography>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            required
                            onChange={handlePdfFileChange}
                        />
                        <FormControl style={{ width: "80%" }}>
                            <InputLabel id="demo-simple-select-label">Job Field</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={jobField}
                                label="JobField"
                                onChange={handleChange}
                            >
                                {jobFields.map((field) => (
                                    <MenuItem
                                        key={field}
                                        value={field}
                                    >
                                        {field}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <label htmlFor="contained-button-file">
                            <Button
                                variant="outlined"
                                color="primary"
                                component="span"
                                style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8" }}
                            >
                                Upload
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            2. Click This Button
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            To Prevent Shaking Of The Gaze
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8" }}
                            onClick={() => window.open('https://webgazer.cs.brown.edu/calibration.html?', '_blank')}
                        >
                            Continue
                        </Button>
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            3. Click This Button
                        </Typography>
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            To Collect Your Gaze
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8" }}
                        >
                            <Link to="/track" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                                CONTINUE
                            </Link>
                        </Button>
                    </Grid>
                </Grid>
                <hr style={{ marginTop: 40 }} />
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 20 }}>
                    <Grid item xs={3} style={{ textAlign: "center" }}>
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            E x a m p l e
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Show How To Use
                        </Typography>
                    </Grid>
                    <IntroduceVideo />
                </Grid>
            </Box>
        </>
    )
}

export default Upload;