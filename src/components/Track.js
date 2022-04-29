import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from 'react-alice-carousel';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Fbase'

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'user_name', headerName: '작성자', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
];


const Track = () => {
    const [selectionModel, setSelectionModel] = useState();
    const [email, setEmail] = useState(""); // 유저 이메일
    const [pdfs, setPdfs] = useState(() => []); // 전체 pdf
    const [isTracking, setIsTracking] = useState(false);
    const webgazer = window.webgazer; // webgazer instance
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [userId, setUserId] = useState(0); // 유저 고유 아이디 값
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    var pageNum = 0; // pdf 현재 페이지
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열
    const datas = []; // get 받아올 배열
    
    useEffect(async () => {
        var datas = [];
        const response = await axios.get('http://3.38.250.195:8000/pdf/');
        datas.push(response.data);
        setPdfs(datas[0]);
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setEmail(user);
              console.log(email);
            } else {
              console.log("유저 없음");
            }
        });
    }, []);

    const onClickTrack = async () => {
        setIsTracking(true);
        const response = await axios.get('http://3.38.250.195:8000/pdf/search', {
            params: {
                pdf_id : selectionModel[0]
            }
        });
        datas.push(response.data[0]);
        setImgsUrl(datas[0].imgs_url);
        setUserId(datas[0].user_id);
        setPdfId(datas[0].id);
    }

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
        await axios.post("http://3.38.250.195:8000/eyetracking/", {
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
        setIsTracking(false);
    }

    const onClickBack = () => {
        window.location.reload();
    }

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("http://3.38.250.195:8000/eyetracking/", {
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

    if(isTracking) return (
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
                        >
                            {/* <img src="/img/s.png" style={{ width: "100%", height: 500 }}> 
                            </img>
                            <img src="/img/example2.png" style={{ width: "100%", height: 500 }}> 
                            </img> */}
                            {imgsUrl && imgsUrl.map((e, index) => (
                                <img key={index} src={e} style={{ width: "90%", height: 800 }} />

                            ))} 
                        </AliceCarousel>
                        <Button onClick={onClickStart}>
                            Start
                        </Button>
                        <Button onClick={onClickEnd}>
                            End
                        </Button>
                        <Button onClick={onClickBack}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

    else return (
        <>
            <Button style={{marginTop: 100}} onClick={onClickTrack}>
                CONTINUE
            </Button>
            <div style={{ height: 400, width: '80%', margin: "auto" }}>
                <DataGrid
                    rows={pdfs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                        console.log(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    style={{align: "center"}}
                />
            </div>
        </>
    )
}

export default Track;