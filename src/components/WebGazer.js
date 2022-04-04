import { Box, Button, CircularProgress, Grid } from "@mui/material";
import axios from 'axios';
import { useEffect, useState } from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';


const WebGazer = () => {
    const webgazer = window.webgazer; // webgazer instance
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [imgsUrl, setImgsUrl] = useState([]);
    const [length, setLength] = useState(0);
    const [userId, setUserId] = useState(0);
    const [pdfId, setPdfId] = useState(0);

    useEffect(async () => {
        try {
            const datas = [];
            setLoading(false);
            const response = await axios.get(
                'http://54.180.126.190:8000/pdf/'
            );
            // 데이터는 response.data 안에 들어있습니다.

            datas.push(response.data[0]);
            setImgsUrl(datas[0].imgs_url);
            setLength(datas[0].img_length);
            setUserId(datas[0].user_id);
            setPdfId(datas[0].pdf_id);

        } catch (e) {
            setError(e);
        }
        setLoading(false);
    }, []);

    if (loading) return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={300} style={{ marginTop: "15%" }} />
            </div>
        </Box>
    )
    if (error) return alert("에러가 발생했습니다");

    var dimensionArr = [];

    const onClickStart = () => {
        webgazer.setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([data.x, data.y]);
        }).begin();
    }

    const onClickEnd = async () => {
        await axios.post("http://54.180.126.190:8000/eyetracking/", {
            'user_id': 1,
            'page_number': `${pageNum}`,
            'rating_time': '00:00:00',
            'coordinate': dimensionArr,
            'owner_id': userId,
            'pdf_id': pdfId
        });
        dimensionArr = [];
        webgazer.end();
        webgazer.showPredictionPoints(false);
        window.location.reload();
    }
    var pageNum = 0;
    const onClickArrow = async () => {
        await axios.post("http://54.180.126.190:8000/eyetracking/", {
            'user_id': 1,
            'page_number': `${pageNum}`,
            'rating_time': '00:00:00',
            'coordinate': dimensionArr,
            'owner_id': userId,
            'pdf_id': pdfId
        });
        // TODO post.then(arr = []) arr null 처리 arr boundary 밖 값들 무시
        pageNum = pageNum + 1;
        dimensionArr = [];
    }

    const nextArrow = () => {
        return (
            <Button onClick={onClickArrow}>
                <ArrowForwardOutlinedIcon style={{ justifyContent: "center", right: 0, top: 0, color: "black", fontSize: "50" }} />
            </Button>
        )

    }

    const prevArrow = () => {
        return (
            <Button onClick={onClickArrow}>
                <ArrowBackOutlinedIcon style={{ justifyContent: "center", left: 0, top: 0, color: "black", fontSize: "50" }} />
            </Button>
        )

    }


    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'column',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 12, sm: 12, md: 12 }} justifyContent="center" alignItems="center" style={{ height: "100%", width: "100%" }}>
                    <Grid item xs={6}>
                        <AliceCarousel
                            animationDuration={1}
                            renderNextButton={nextArrow}
                            renderPrevButton={prevArrow}
                        >
                            <img src="/img/s.png" style={{ width: "100%", height: 500 }}>
                            </img>
                            {/* {imgsUrl && imgsUrl.map((e, index) => (
                                <img key={index} src={e} style={{ width: "100%", height: 500 }} />

                            ))} */}
                        </AliceCarousel>
                        <Button onClick={onClickStart}>
                            Start
                        </Button>
                        <Button onClick={onClickEnd}>
                            End
                        </Button>
                    </Grid>
                </Grid>

            </Box>
        </>
    )
}

export default WebGazer;