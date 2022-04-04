import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Grid } from '@mui/material';
import AboutUs from './AboutUs';
import Upload from './Upload';

const Home = () => {
    const [value, setValue] = useState(0);
    const [exhibitionId, setExhibitionId] = useState("");
    const [exhibitionComment, setExhibitionComment] = useState("");

    return (
        <>
            <Upload />
            <AboutUs />
        </>
    )
}



export default Home;