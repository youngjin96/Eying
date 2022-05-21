import { useEffect, useState } from 'react';

import axios from 'axios';

import { Box, Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import { onAuthStateChanged } from 'firebase/auth';

import IsLoading from "./Environment/IsLoading";
import IsLoggedIn from "./Environment/IsLoggedIn";
import { auth } from './Fbase';

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 2, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', flex: 0.7, align: 'center', headerAlign: "center" },
    { field: 'user_name', headerName: '작성자', flex: 0.7, align: 'center', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', flex: 0.5, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', flex: 0.5, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', flex: 0.3, align: 'right', headerAlign: "center" },
];

var dimensionArr = []; // webgazer x, y 좌표가 담길 배열

const Track = () => {
    const webgazer = window.webgazer; // webgazer instance
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const [selectionModel, setSelectionModel] = useState();
    const [userEmail, setUserEmail] = useState(""); // 유저 이메일
    const [ownerEmail, setOwnerEmail] = useState("");
    const [pdfs, setPdfs] = useState([]); // 전체 pdf
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    const [pageNumber, setpageNumber] = useState(0); // pdf 현재 페이지


    useEffect(() => {
        // 유저 정보 가져오는 함수
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserEmail(user.email);
                    setIsLoggedIn(true);
                    // 유저가 로그인했을 때 서버에서 데이터를 가져온다.
                    axios.get('https://eying.ga/pdf/').then(res => {
                        setPdfs(res.data);
                        setIsLoading(false);   
                    })
                } else {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // PDF를 고르고 Track 버튼 누른 경우
    const onClickTrack = async () => {
        setIsTracking(true);
        setIsLoading(true);
        await axios.get('https://eying.ga/pdf/search', {
            params: {
                pdf_id: selectionModel[0],
                view: true
            }
        }).then(res => {
            if (res.status === 200) {
                setImgsUrl(res.data[0].imgs_url);
                setPdfId(res.data[0].id);
                setOwnerEmail(res.data[0].user_email);
                setIsLoading(false);
            }
        });
    };

    const onClickStart = () => {
        webgazer.setRegression('weightedRidge').setTracker('trackingjs').setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([Math.floor(data.x), Math.floor(data.y)]);
        }).begin();
    };

    // webgazer 종료 함수
    const onClickEnd = async () => {
        // 서버에 dataset 보내는 함수
        await axios.post("https://eying.ga/eyetracking/", {
            'user_email': userEmail,
            'owner_email': ownerEmail,
            'rating_time': '00:00:00',
            'page_number': pageNumber,
            'pdf_id': pdfId,
            'coordinate': dimensionArr
        }).then(res => {
            if (res.status === 200) {
                console.log("Success");
                setIsTracking(false);
                dimensionArr = [];
            }
            else {
                console.log("Fail");
            }
            webgazer.end();
            webgazer.showPredictionPoints(false);
            window.location.reload();
        });
    };

    const onClickBack = () => {
        window.location.replace("track");
        alert("저장되었습니다.");
    };

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("https://eying.ga/eyetracking/", {
            'user_email': userEmail,
            'owner_email': ownerEmail,
            'rating_time': '00:00:00',
            'page_number': pageNumber,
            'pdf_id': pdfId,
            'coordinate': dimensionArr,
        }).then(res => {
            if (res.status === 200) {
                console.log("Success");
            }
            else {
                console.log("Fail");
            }
            dimensionArr = [];
        });
    };

    // After swipe silde, update pageNumber
    const onSlideChanged = (e) => {
        setpageNumber(e.item);
    };

    // 로딩 중일 때 보여줄 화면
    if (isLoading) return (
        <IsLoading />
    )

    // 로그인 안 됐을 때 보여줄 화면
    else if (!isLoggedIn) return (
        <IsLoggedIn />
    )

    // Track 버튼 눌렀을 때 보여줄 화면
    else if (isTracking) return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'column',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <Grid
                container
                columns={{ xs: 12, sm: 12, md: 12 }}
                style={{ textAlign: "center" }}
            >
                <Grid item xs={12}>
                    <AliceCarousel
                        animationDuration={1}
                        keyboardNavigation={true}
                        disableButtonsControls={true}
                        onSlideChange={onSlideChange}
                        onSlideChanged={onSlideChanged}
                    >
                        {imgsUrl && imgsUrl.map((e, index) => (
                            <img
                                key={index}
                                src={e}
                                style={{ width: "100%", height: "75vh" }}
                            />
                        ))}
                    </AliceCarousel>
                    <Button onClick={onClickStart}>시작하기</Button>
                    <Button onClick={onClickEnd}>종료하기</Button>
                    <Button onClick={onClickBack}>돌아가기</Button>
                </Grid>
            </Grid>
        </Box>
    )

    // 전체 PDF 데이터
    else return (
        <>
            <div style={{ height: 630, width: '80%', margin: "auto", marginTop: 50 }}>
                <DataGrid
                    rows={pdfs}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                        console.log(newSelectionModel)
                    }}
                    style={{ align: "center" }}
                />
            </div>
            <div style={{ marginTop: 10, textAlign: "center" }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClickTrack}
                >
                    TRACK
                </Button>
            </div>
        </>
    )
}

export default Track;