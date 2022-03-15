import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Grid } from '@mui/material';


const Home = () => {
    const [value, setValue] = useState(0);
    const [exhibitionId, setExhibitionId] = useState("");
    const [exhibitionComment, setExhibitionComment] = useState("");

    return (
        <div style={{position: 'relative', paddingBottom: "10%"}}>
            <Grid container spacing={10} style={{ paddingLeft: "5%", paddingRight: "5%", marginTop: "0" }} >
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardMedia
                            component="img"
                            height="300"
                            image="img/example.jpg"
                            alt="ape"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {exhibitionId}
                        </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {exhibitionComment}
                        </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button size="middle" variant="text">입장하기</Button>
                            <Rating style={{ marginLeft: "auto" }} name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardMedia
                            component="img"
                            height="300"
                            image="img/example2.png"
                            alt="ape"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                전시회 제목
                        </Typography>
                            <Typography variant="body2" color="text.secondary">
                                전시회 설명 원숭이 엉덩이는 빨개 빨갛면 사과 사과는 맛있어.
                        </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button size="middle" variant="text">입장하기</Button>
                            <Rating style={{ marginLeft: "auto" }} name="half-rating-read" defaultValue={3.5} precision={0.5} readOnly />
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardMedia
                            component="img"
                            height="300"
                            image="img/example2.png"
                            alt="ape"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                전시회 제목
                        </Typography>
                            <Typography variant="body2" color="text.secondary">
                                전시회 설명 원숭이 엉덩이는 빨개 빨갛면 사과 사과는 맛있어.
                        </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button size="middle" variant="text">입장하기</Button>
                            <Rating style={{ marginLeft: "auto" }} name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardMedia
                            component="img"
                            height="300"
                            image="img/example2.png"
                            alt="ape"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                전시회 제목
                        </Typography>
                            <Typography variant="body2" color="text.secondary">
                                전시회 설명 원숭이 엉덩이는 빨개 빨갛면 사과 사과는 맛있어.
                        </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button size="middle" variant="text">입장하기</Button>
                            <Rating style={{ marginLeft: "auto" }} name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <div style={{bottom: 0, position: 'relative', width:"100%", marginTop: "10%"}}>
                <footer>
                    <hr />
                    <Typography variant="h3" component="div">
                        ㅇㅇ
                    </Typography>
                </footer>
            </div>
        </div>
    )
}



export default Home;