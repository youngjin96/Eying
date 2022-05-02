import { useEffect, useState } from "react";

import axios from 'axios';

import { Box, Button, CircularProgress, Grid } from "@mui/material";

import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';

import { useNavigate } from "react-router-dom";

import Loading from "./Loading";
import IsLoggedIn from "./IsLoggedIn";
import { auth } from './Fbase'
import { onAuthStateChanged } from 'firebase/auth';

const WebGazer = () => {
    const webgazer = window.webgazer; // webgazer instance
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // pdf 가져올 때 까지 로딩
    const [error, setError] = useState(); // pdf 가져올 때 에러
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    const [email, setEmail] = useState("");
    var pageNum = 0;
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열

    useEffect(() => {
        const fetchUser = () => {
            try {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setIsLoggedIn(true);
                        setEmail(user.email);
                    } else {
                        setIsLoggedIn(false);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        const fetchData = async () => {
            try {
                await axios.get('http://3.36.95.29:8000/pdf/').then(res => {
                    if (res.status === 200){
                        setImgsUrl(res.data[0].imgs_url);
                        setPdfId(res.data[0].id);
                        setIsLoading(false);
                    } else {
                        setIsLoading(true);
                    }
                });
            } catch (e) {
                setError(e);
            }
        }
        fetchUser();
        fetchData();
        
    }, []);

    // loadng 중 일 때 보여줄 화면 (loading == true)
    if (isLoading) return (
        <Loading />
    )

    // error가 있을 때 alert
    if (error) {
        navigate("/upload");
    }

    // webgazer 시작 함수
    const onClickStart = () => {
        webgazer.setRegression('weightedRidge').setTracker('trackingjs').setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([Math.floor(data.x), Math.floor(data.y)]);
        }).begin();
        webgazer.applyKalmanFilter(true);
    }

    // webgazer 종료 함수
    const onClickEnd = async () => {
        // 서버에 dataset 보내는 함수
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_email': "kimc980106@naver.com",
            'owner_email': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr,
        });
        dimensionArr = [];
        webgazer.end();
        webgazer.showPredictionPoints(false);
        window.location.reload();
    }

    const onClickBack = () => {
        window.location.replace("upload");
    }

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_email': "kimc980106@naver.com",
            'owner_email': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr,
        });
        dimensionArr = [];
    }

    // After swipe silde, pageNum setting
    const onSlideChanged = (e) => {
        pageNum = e.item;
        console.log(pageNum);
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
                <Grid container columns={{ xs: 12, sm: 12, md: 12 }} style={{ textAlign: "center" }}>
                    <Grid item xs={12}>
                        <AliceCarousel
                            animationDuration={1}
                            keyboardNavigation={true}
                            onSlideChange={onSlideChange}
                            onSlideChanged={onSlideChanged}
                            disableButtonsControls={true}
                        >
                            {/* <img src="/img/s.png" style={{ width: "90%", height: 800 }}>
                            </img>
                            <img src="/img/example2.png" style={{ width: "90%", height: 500 }}>
                            </img> */}
                            {imgsUrl && imgsUrl.map((e, index) => (
                                <img key={index} src={e} style={{ width: "90%", height: "80vh" }} />
                                
                            ))}
                        </AliceCarousel>
                        <Button variant="contained" size="large" onClick={onClickStart}>
                            Start
                        </Button>
                        <Button variant="contained" size="large" onClick={onClickEnd} style={{marginLeft: 10}}>
                            End
                        </Button>
                        <Button variant="contained" size="large" onClick={onClickBack} style={{marginLeft: 10}}>
                            Back
                        </Button>
                    </Grid>
                </Grid>

            </Box>
        </>
    )
}

export default WebGazer;