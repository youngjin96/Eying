import { Box, Button, CircularProgress, Grid } from "@mui/material";
import axios from 'axios';
import { useEffect, useState } from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Fbase'


const WebGazer = () => {
    const webgazer = window.webgazer; // webgazer instance
    const [loading, setLoading] = useState(true); // pdf 가져올 때 까지 로딩
    const [error, setError] = useState(); // pdf 가져올 때 에러
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [userId, setUserId] = useState(0); // 유저 고유 아이디 값
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    var email = "";
    var pageNum = 0;
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열
    const datas = []; // get 받아올 배열
    
    useEffect(async () => {
        try {
            const response = await axios.get('http://54.180.156.83:8000/pdf/'); // get 함수
            datas.push(response.data[0]); // 데이터는 response.data 안에 들어있습니다.
            setImgsUrl(datas[0].imgs_url);
            setUserId(datas[0].user_id);
            setPdfId(datas[0].id);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                email = user.email;
            } else {
              console.log("유저 없음");
            }
        });
    }, [imgsUrl]);

    // loadng 중 일 때 보여줄 화면 (loading == true)
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
    
    // error가 있을 때 alert
    if (error) {
        window.location.replace("upload");
    }
    
    // webgazer 시작 함수
    const onClickStart = () => {
        webgazer.setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([Math.floor(data.x), Math.floor(data.y)]);
        }).begin();
    }

    // webgazer 종료 함수
    const onClickEnd = async () => {
        // 서버에 dataset 보내는 함수
        await axios.post("http://54.180.156.83:8000/eyetracking/", {
            'user_id': "kimc980106@naver.com",
            'owner_id': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': 42,
            'coordinate': dimensionArr,
        });
        dimensionArr = [];
        webgazer.end();
        webgazer.showPredictionPoints(false);
        window.location.reload();
    }

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("http://54.180.156.83:8000/eyetracking/", {
            'user_id': "kimc980106@naver.com",
            'owner_id': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': 42,
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
                <Grid container columns={{ xs: 12, sm: 12, md: 12 }} justifyContent="center" alignItems="center" style={{ height: "100%", width: "100%" }}>
                    <Grid item xs={6}>
                        <AliceCarousel
                            animationDuration={1}
                            keyboardNavigation={true}
                            onSlideChange={onSlideChange}
                            onSlideChanged={onSlideChanged}
                            disableButtonsControls={true}
                            disableDotsControls={true}
                        >
                            {/* <img src="/img/s.png" style={{ width: "100%", height: 500 }}> 
                            </img>
                            <img src="/img/example2.png" style={{ width: "100%", height: 500 }}> 
                            </img>  */}
                            {imgsUrl && imgsUrl.map((e, index) => (
                                <img key={index} src={e} style={{ width: "100%", height: 500 }} />

                            ))} 
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