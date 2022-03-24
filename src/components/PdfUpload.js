import React, { forwardRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { AppBar, Button, Dialog, IconButton, Toolbar, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactSlidy from 'react-slidy'
import 'react-slidy/lib/styles.css'


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Apply_exhibition = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const slides = ['img/example.jpg', 'img/example2.png'];

    const createStyles = isActive => ({
        background: 'transparent',
        border: 0,
        color: isActive ? '#333' : '#ccc',
        cursor: 'pointer',
        fontSize: '32px',
    });

    const [actualSlide, setActualSlide] = useState(0)

    const updateSlide = ({currentSlide}) => {
        setActualSlide(currentSlide)
    }

    const theme = createTheme();

    const card = (
        <CardActions>
            <Dropzone onDrop={acceptedFiles => 
                fetch("/pdf/api/").then((response) => response.json()).then((acceptedFiles) => {
                    console.log(acceptedFiles[0].imgs_url)
                    setData(data => [...data, acceptedFiles[0].imgs_url]);
                    // setImage(acceptedFiles[0].imgs_url)
                })}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="#4aa1f3" gutterBottom>
                                    Drog and Drop OR Click for Upload your Files
                                </Typography>
                            </CardContent>
                        </div>
                    </section>
                )}
            </Dropzone>
        </CardActions>
    )

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Box sx={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                    <img alt="" key={src} src={src} style={{ maxHeight: 600, maxWidth: 500 }}/>
                                ))}
                            </ReactSlidy>
                            <div className="Dots" style={{textAlign: 'center'}}>
                                {slides.map((_, index) => {
                                    return (
                                        <button
                                            key={index}
                                            style={createStyles(index === actualSlide) }
                                            onClick={() => updateSlide({currentSlide: index})}
                                        >
                                            &bull;
                                        </button>
                                    )
                                })}
                            </div>
                        </Dialog>
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Apply_exhibition;