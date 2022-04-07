import { Card, CardActionArea, CardMedia } from "@mui/material";

const Track = () => {
    const onClickimg = () => {
        console.log("click")
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="500"
                    image="/img/example.jpg"
                    alt="green iguana"
                    onClick={onClickimg}
                />
            </CardActionArea>
        </Card>
    )
}

export default Track;