import React, { forwardRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { AppBar, Button, Dialog, IconButton, Slide, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SimpleImageSlider from "react-simple-image-slider";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Apply_exhibition = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const theme = createTheme();

    const card = (
        <CardActions>
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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

    const itemData = [
        {
            url: "img/example.jpg"
        },
        {
            url: "img/example2.png"
        }
    ]

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
                            
                                    <SimpleImageSlider
                                    width={400}
                                    height={400}
                                    images={itemData}
                                    showBullets={true}
                                    showNavs={true}
                                    />
                            
                            
                            {/* <ImageList sx={{ width: '100%', height: '100vh' }} cols={1}>
                                {itemData.map((item) => (
                                    <ImageListItem key={item.img}>
                                        <img
                                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList> */}
                        </Dialog>
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Apply_exhibition;