import React, { forwardRef, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { AppBar, Button, Dialog, IconButton, Toolbar, Slide, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactSlidy from 'react-slidy'
import 'react-slidy/lib/styles.css'
import axios from 'axios';
import "./Upload.css";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Apply_exhibition = () => {
    const [x, setX] = useState('');
    const [open, setOpen] = useState(false);
    const [datas, setDatas] = useState([]);
    const [isClickStart, setIsClickStart] = useState(false);
    const webgazer = window.webgazer;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    };

    const arr = [];

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
        setActualSlide(currentSlide)
        console.log(datas);
    }



    const card = (
        <CardActions
            sx={{
                boxShadow: 1,
                borderRadius: 2,
                p: 5,
                minWidth: 50,
                bgcolor: '#fbefe7',
                justifyContent: "center"
            }}
        >
            <Dropzone>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="black" gutterBottom>
                                    Drog and Drop OR Click for Upload your Files
                                </Typography>
                            </CardContent>
                        </div>
                    </section>
                )}
            </Dropzone>
        </CardActions>
    )

    const font = "'Roboto', sans-serif";
    const theme = createTheme({
        typography: {
            fontFamily: font,
            button: {
                textTransform: "none"
            },
        }
    });

    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: 400,
                    backgroundColor: '#fbefe7',
                    display: 'column',
                    
                }}
            >
                <Card variant="outlined">
                    {card}
                </Card>
                <div>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Open full-screen dialog
                        </Button>
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
            </Box>
            <Box 
                sx={{
                    width: '100vw',
                    height: 300,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                hi
            </Box>
        </>
    )
}

export default Apply_exhibition;