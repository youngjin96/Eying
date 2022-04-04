import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
    //const fileType = ["application/pdf"];
    const handlePdfFileChange = (e) => {
        var frm = new FormData();
        frm.append("data", e.target.files[0]);
        axios.post('http://54.180.126.190:8000/pdf/', frm);
    }

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
                <hr style={{marginTop: 40}} />
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 20}}>
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
                            1. Click This Button
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
                            To Prevent Shaking Of The Gaze Point
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            style={{ marginTop: 5, color: "black" }}
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
                <hr style={{marginTop: 40}} />
                <Grid container container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 20 }}>
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