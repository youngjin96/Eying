import React, { forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppBar, Button, Dialog, IconButton, Toolbar, Slide, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactSlidy from 'react-slidy'
import 'react-slidy/lib/styles.css'
import axios from 'axios';
import "./Upload.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Upload = () => {
    const [open, setOpen] = useState(false);
    const [isClickStart, setIsClickStart] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileError, setPdfFileError] = useState("");
    const webgazer = window.webgazer;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    };

    const onClickStart = () => {
        setIsClickStart(true);
        webgazer.setGazeListener(function (data, elapsedTime) {
            if (data == null) {
                return;
            }
            axios.post("https://capstone-backend-f73d3.web.app", {
                xPosition: data.x,
                yPosition: data.y
            });
        }).begin();
    }

    const onClickEnd = () => {
        webgazer.end();
        webgazer.showPredictionPoints(false);
    }

    const slides = ['img/example.jpg', 'img/example2.png'];

    const createStyles = isActive => ({
        background: 'transparent',
        border: 0,
        color: isActive ? '#333' : '#ccc',
        cursor: 'pointer',
        fontSize: '32px',
    });

    const [actualSlide, setActualSlide] = useState(0)

    const updateSlide = ({ currentSlide }) => {
        setActualSlide(currentSlide);
    }

    const fileType = ["application/pdf"];
    const handlePdfFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        if (selectedFile) {
            if (selectedFile && fileType.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onloadend = (e) => {
                    setPdfFile(e.target.result);
                    setPdfFileError("");
                }
            } else {
                setPdfFile(null);
                setPdfFileError("Please select valid PDF file");
            }
        } else {
            console.log("select your file");
        }
    }

    return (
        <>
            <Box
                sx={{
                    marginTop: 4,
                    width: '100vw',
                    height: '100vh',
                    display: 'column',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >   
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }}>
                    <Grid item xs={3} style={{textAlign: "center", alignItems: "center"}}>
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            P r o c e s s
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Follow The Prearranged Procedure
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{marginTop:10}}>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <UploadFileOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            1. Upload
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Upload your PDF
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <VisibilityOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            2. Prediction
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Collect your gaze
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <PersonSearchOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            3. Collect
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Collect your gaze
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <DifferenceOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            4. Compare
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Compare your gaze with others
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <ArticleOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            5. Show
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Show you compared results
                        </Typography>
                    </Grid>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <RecommendOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle1" style={{ color: "#636261" }}>
                            6. Recommendation
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Recommend you how to arrange
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{marginTop:100}}>
                    <Grid item xs={3} style={{textAlign: "center"}}>   
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            U s e
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Follow Left To Right
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{marginTop:5}}>
                    <Grid item xs={3} style={{textAlign: "center"}}>
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
                    <Grid item xs={3} style={{textAlign: "center"}}>
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
                    <Grid item xs={3} style={{textAlign: "center"}}>
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
                            onClick={handleClickOpen}
                        >
                            Continue
                            </Button>
                    </Grid>
                </Grid>
                <Grid container container spacing={{ xs: 2, md: 4 }} columns={{ xs: 3, sm: 6, md: 12 }} style={{marginTop:100}}>
                    <Grid item xs={3} style={{textAlign: "center"}}>
                        <Typography variant="h5" style={{ color: "#636261" }}>
                            E x a m p l e
                        </Typography>
                        <Typography variant="caption" style={{ color: "#636261" }}>
                            Show How To Use
                        </Typography>
                    </Grid>
                    
                </Grid>
            </Box>
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >

                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <ReactSlidy imageObjectFit="contain" doAfterSlide={updateSlide} slide={actualSlide}>
                        {slides.map(src => (
                            <img alt="" key={src} src={src} style={{ maxHeight: 600, maxWidth: 500 }} />
                        ))}
                    </ReactSlidy>
                    <div className="Dots" style={{ textAlign: 'center' }}>
                        {slides.map((_, index) => {
                            return (
                                <button
                                    key={index}
                                    style={createStyles(index === actualSlide)}
                                    onClick={() => updateSlide({ currentSlide: index })}
                                >
                                    &bull;
                                </button>
                            )
                        })}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={onClickStart}>
                            시작
                                </Button>
                        {isClickStart ? (
                            <Button variant="contained" onClick={onClickEnd}>
                                종료
                            </Button>
                        ) : (
                                <Button variant="contained" disabled>
                                    종료
                                </Button>
                            )}

                    </div>
                </Dialog>
            </div>


        </>
    )
}

export default Upload;