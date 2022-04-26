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
    const [loading, setLoading] = useState(true); // pdf 가져올 때 까지 로딩
    const [error, setError] = useState(); // pdf 가져올 때 에러
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [length, setLength] = useState(0); // pdf 갯수
    const [userId, setUserId] = useState(0); // 유저 고유 아이디 값
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    var pageNum = 0; // pdf 현재 페이지
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열
    const datas = []; // get 받아올 배열
    
    useEffect(async () => {
        var datas = [];
        const response = await axios.get('http://54.180.156.83:8000/pdf/');
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
        const response = await axios.get('http://54.180.156.83:8000/pdf/search', {
            params: {
                pdf_id : selectionModel[0]
            }
        });
        datas.push(response.data[0]);
        setImgsUrl(datas[0].imgs_url);
        setLength(datas[0].img_length);
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
        await axios.post("http://54.180.156.83:8000/eyetracking/", {
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
    
    // 화살표 오른쪽 함수
    const onClickRightArrow = async () => {
        await axios.post("http://54.180.156.83:8000/eyetracking/", {
            'user_id': 1,
            'page_number': `${pageNum}`,
            'rating_time': '00:00:00',
            'coordinate': dimensionArr,
            'owner_id': userId,
            'pdf_id': pdfId
        });
        //TODO post.then(arr = []) arr null 처리 arr boundary 밖 값들 무시
        if(pageNum === length){
            pageNum = length;
        } else{
            pageNum = pageNum + 1;
        }
        dimensionArr = [];
    }

    // 화살표 왼쪽 함수
    const onClickLeftArrow = async () => {
        await axios.post("http://54.180.156.83:8000/eyetracking/", {
            'user_id': 1,
            'page_number': `${pageNum}`,
            'rating_time': '00:00:00',
            'coordinate': dimensionArr,
            'owner_id': userId,
            'pdf_id': pdfId
        });
        // TODO post.then(arr = []) arr null 처리 arr boundary 밖 값들 무시
        if(pageNum === 0){
            pageNum = 0;
        } else {
            pageNum = pageNum - 1;
        }
        dimensionArr = [];
    }

    const nextArrow = () => {
        return (
            <Button onClick={onClickRightArrow}>
                <ArrowForwardOutlinedIcon style={{ justifyContent: "center", right: 0, top: 0, color: "black", fontSize: "50" }} />
            </Button>
        )

    }

    const prevArrow = () => {
        return (
            <Button onClick={onClickLeftArrow}>
                <ArrowBackOutlinedIcon style={{ justifyContent: "center", left: 0, top: 0, color: "black", fontSize: "50" }} />
            </Button>
        )
    }

    const onClickBack = () => {
        window.location.reload();
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
                            renderNextButton={nextArrow}
                            renderPrevButton={prevArrow}
                            
                        >
                            {/* <img src="/img/s.png" style={{ width: "100%", height: 500 }}> 
                            </img>
                            <img src="/img/example2.png" style={{ width: "100%", height: 500 }}> 
                            </img> */}
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