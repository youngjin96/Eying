import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from './Fbase'
import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
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
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Upload = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [email, setEmail] = useState("");
    const [jobField, setJobField] = useState("");
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    // 처음 렌더링 후 유저가 로그인이 되어있는지 확인 로그인한 상태가 아니라면 로그인 페이지로 이동
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        })
    }, []);

    const onClickLogin = () => {
        setOpen(false);
        navigate("/login");
    };

    // pdf 업로드 함수
    const handlePdfFileChange = (e) => {
        var frm = new FormData();
        frm.append("pdf", e.target.files[0]);
        frm.append("email", email);
        frm.append("job_field", jobField);
        axios.post('http://3.36.95.29:8000/pdf/', frm);
    };

    const handleChange = (event) => {
        setJobField(event.target.value);
    };

    if (!isLoggedIn) return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'column',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <Dialog
                open={open}
                onClose={onClickLogin}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Did You Logged In?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        이 페이지는 로그인 후 이용이 가능합니다.
                        로그인 페이지로 가서 로그인해주시기 바랍니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickLogin} autoFocus>
                        로그인
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

    return (
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
                                <MenuItem value={"IT"}>IT</MenuItem>
                                <MenuItem value={"ART"}>ART</MenuItem>
                                <MenuItem value={"SPORTS"}>SPORTS</MenuItem>
                                <MenuItem value={"ETC"}>ETC</MenuItem>
                            </Select>
                        </FormControl>
                        <label htmlFor="contained-button-file">
                            <Button
                                variant="outlined"
                                color="primary"
                                component="span"
                                style={{ marginTop: 5, color: "black" }}

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
                            style={{ marginTop: 5, color: "black" }}
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
                            style={{ marginTop: 5, color: "black" }}
                        >
                            <Link to="/webgazer" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
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
                </Grid>
            </Box>
        </>
    )
}

export default Upload;