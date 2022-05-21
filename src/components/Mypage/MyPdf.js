import { useEffect, useState } from "react";

import { Button, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import axios from 'axios';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import { onAuthStateChanged } from "firebase/auth";

import IsLoading from "../Environment/IsLoading";
import { auth } from '../Fbase'

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 2, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', flex: 0.7, align: 'center', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', flex: 0.5, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', flex: 0.5, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', flex: 0.3, align: 'right', headerAlign: "center" },
];

const stepTwoColumns = [
    { field: 'user_name', headerName: '평가자', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job', headerName: '직업', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'position', headerName: '계급', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'gender', headerName: '성별', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'create_date', headerName: '날짜', flex: 1, align: 'center', headerAlign: "center" },
];

var userId = 0;
var pdfId = 0;
var trackedEmail = "";

const MyPdf = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isClickedCell, setIsClickedCell] = useState(false); // 테이블 셀 클릭 여부
    const [step, setStep] = useState(1); // 테이블 순서
    const [showedPdfs, setShowedPdfs] = useState([]); // 테이블에 보여줄 pdfs
    const [firstPdfs, setFirstPdfs] = useState([]); // 첫 번째 pdfs
    const [secondPdfs, setSecondPdfs] = useState([]); // 두 번째 pdfs
    const [visualType, setVisualType] = useState("distribution"); // 시각화 종류
    const [trackedImages, setTrackedImages] = useState(""); // 시각화한 이미지들
    const [userEmail, setUserEmail] = useState("");
    const [userTrackedImages, setUserTrackedImages] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('https://eying.ga/pdf/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    setFirstPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                }).catch(error => {
                    alert(error.response.data.error_message);
                    setIsLoading(false);
                })
            }
        });
    }, [])

    const onClickContinue = () => {
        // PDF를 선택하지 않고 continue 버튼 눌렀을 때
        if (!isClickedCell) {
            return alert("PDF를 선택해주세요");
        }
        // PDF 선택 후 continue 버튼 눌렀을 때
        else {
            // 첫 번째 step에서 continue 눌렀을 때
            if (step === 1) {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('https://eying.ga/eyetracking/user/', {
                    params: {
                        pdf_id: pdfId,
                    }
                }).then(res => {
                    setSecondPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                    setIsClickedCell(false);
                })
            }
            // 두 번째 step에서 continue 눌렀을 때 
            else {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('https://eying.ga/eyetracking/visualization/', {
                    params: {
                        pdf_id: userId,
                        visual_type: visualType,
                        user_email: trackedEmail
                    }
                }).then(res => {
                    setTrackedImages(res.data.visual_img);
                }).then(() => {
                    axios.get('https://eying.ga/eyetracking/visualization/', {
                        params: {
                            pdf_id: userId,
                            visual_type: visualType,
                            user_email: userEmail
                        }
                    }).then(res => {
                        setUserTrackedImages(res.data.visual_img);
                        setIsLoading(false);
                    });
                });
            }
        }
    }

    // 뒤로 가기 버튼 눌렀을 때 step 조정, 테이블 row 조정
    const onClickBack = () => {
        if (step === 1) {
            setStep(1);
        } else if (step === 2) {
            setStep(step - 1);
            setShowedPdfs(firstPdfs);
        } else {
            setStep(step - 1);
            setShowedPdfs(secondPdfs);
        }
    }

    // 시각화 종류 버튼 눌렀을 때 시각화 종류 조정
    const onClickVisualType = () => {
        setIsLoading(true);
        var type = "";
        if (visualType === "distribution") {
            setVisualType("flow");
            type = "flow";
        }
        else {
            setVisualType("distribution");
            type = "distribution";
        }
        axios.get('https://eying.ga/eyetracking/visualization/', {
            params: {
                pdf_id: userId,
                visual_type: type,
                user_email: trackedEmail
            }
        }).then(res => {
            setTrackedImages(res.data.visual_img);
        }).then(() => {
            axios.get('https://eying.ga/eyetracking/visualization/', {
                params: {
                    pdf_id: userId,
                    visual_type: type,
                    user_email: userEmail
                }
            }).then(res => {
                setUserTrackedImages(res.data.visual_img);
                setIsLoading(false);
            })
        })
    }

    return (
        <>
            {isLoading ? (
                <IsLoading />
            ) : (
                    step === 1 ? (
                        <>
                            <div style={{ height: 630, width: '80%', margin: "auto" }}>
                                <DataGrid
                                    rows={showedPdfs}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    onCellClick={(params) => {
                                        setIsClickedCell(true);
                                        pdfId = params.row.id;
                                        trackedEmail = params.row.user_email;
                                    }}
                                    style={{ align: "center" }}
                                />
                            </div>
                            <Button 
                                size="large"
                                onClick={onClickContinue}
                                style={{ color: "black" }}
                            >
                                NEXT
                            </Button>
                        </>
                    ) : (
                            step === 2 ? (
                                <>
                                    <div style={{ height: 630, width: '80%', margin: "auto" }}>
                                        <DataGrid
                                            rows={showedPdfs}
                                            columns={stepTwoColumns}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            onCellClick={(params) => {
                                                setIsClickedCell(true);
                                                userId = params.row.pdf_id;
                                                trackedEmail = params.row.user_email;
                                            }}
                                            style={{ align: "center" }}
                                        />
                                    </div>
                                    <Button 
                                        size="large"
                                        onClick={onClickBack}
                                        style={{ color: "black" }}
                                    >
                                        BACK
                                    </Button>
                                    <Button 
                                        size="large"
                                        onClick={onClickContinue}
                                        style={{ color: "black" }}
                                    >
                                        NEXT
                                    </Button>
                                </>
                            ) : (
                                    <Grid container columns={{ xs: 6, sm: 12, md: 12 }}>
                                        <Grid item xs={6}>
                                            <AliceCarousel
                                                animationDuration={1}
                                                keyboardNavigation={true}
                                                disableButtonsControls={true}
                                            >
                                                {userTrackedImages && userTrackedImages.map((e, index) => (
                                                    <img
                                                        key={index}
                                                        src={e}
                                                        style={{ width: "95%", height: 500 }}
                                                    />
                                                ))}
                                            </AliceCarousel>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <AliceCarousel
                                                animationDuration={1}
                                                keyboardNavigation={true}
                                                disableButtonsControls={true}
                                            >
                                                {trackedImages && trackedImages.map((e, index) => (
                                                    <img
                                                        key={index}
                                                        src={e}
                                                        style={{ width: "95%", height: 500 }}
                                                    />
                                                ))}
                                            </AliceCarousel>
                                        </Grid>
                                        <Grid item xs={12}>

                                            {visualType === "distribution" ?
                                                (
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        onClick={onClickVisualType}
                                                    >
                                                        시선 흐름 보기
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        onClick={onClickVisualType}
                                                    >
                                                        분포도 보기
                                                    </Button>
                                                )
                                            }
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={onClickBack}
                                                style={{ marginLeft: 20 }}
                                            >
                                                BACK
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )
                        )
                )
            }
        </>
    )
}

export default MyPdf;