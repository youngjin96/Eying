import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import axios from 'axios';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import { onAuthStateChanged } from "firebase/auth";

import Loading from "../Loading";
import { auth } from '../Fbase'

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
];

const stepTwoColumns = [
    { field: 'user_name', headerName: '평가자', flex: 1, width: 150, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'center', headerAlign: "center" },
    { field: 'job', headerName: '직업', width: 150, align: 'center', headerAlign: "center" },
    { field: 'position', headerName: '계급', width: 150, align: 'center', headerAlign: "center" },
    { field: 'gender', headerName: '성별', width: 160, align: 'center', headerAlign: "center" },
    { field: 'create_date', headerName: '날짜', width: 160, align: 'center', headerAlign: "center" },
];

const MyPdf = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [userEmail, setUserEmail] = useState("");
    const [showedPdfs, setShowedPdfs] = useState([]); // 테이블에 보여줄 pdfs
    const [firstPdfs, setFirstPdfs] = useState([]); // 첫 번째 pdfs
    const [secondPdfs, setSecondPdfs] = useState([]); // 두 번째 pdfs
    const [visualType, setVisualType] = useState("distribution");
    const [trackedImages, setTrackedImages] = useState("");
    
    var userId = 0;
    var pdfId = 0;
    var trackedEmail = "";
    var selectionModel = [];

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('http://52.78.155.2:8000/pdf/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    setFirstPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                })
            }
        });
    }, [])

    const onClickContinue = () => {
        // PDF를 선택하지 않고 continue 버튼 눌렀을 때
        if (selectionModel === undefined || selectionModel.length === 0) {
            return alert("PDF를 선택해주세요");
        }
        // PDF 선택 후 continue 버튼 눌렀을 때
        else {
            // 첫 번째 step에서 continue 눌렀을 때
            if (step === 1) {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('http://52.78.155.2:8000/eyetracking/user/', {
                    params: {
                        pdf_id: pdfId,
                    }
                }).then(res => {
                    console.log(res.data);
                    setSecondPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                })
            }
            // 두 번째 step에서 continue 눌렀을 때 
            else {
                setIsLoading(true);
                setStep(step + 1);
                console.log(userId);
                axios.get('http://52.78.155.2:8000/eyetracking/visualization/', {
                    params: {
                        pdf_id: userId,
                        visual_type: visualType,
                        user_email: trackedEmail
                    }
                }).then(res => {
                    setTrackedImages(res.data.visual_img);
                    setIsLoading(false);
                })
            }
        }
    }

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
        console.log(userId);
        // TODO 파라미터 오류
        axios.get('http://52.78.155.2:8000/eyetracking/visualization/', {
            params: {
                pdf_id: userId,
                visual_type: type,
                user_email: trackedEmail
            }
        }).then(res => {
            setTrackedImages(res.data.visual_img);
            setIsLoading(false);
        })
    }

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                    step === 1 ? (
                        <>
                            <div style={{ height: 630, width: '80%', margin: "auto" }}>
                                <DataGrid
                                    rows={showedPdfs}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    selectionModel={selectionModel}
                                    onSelectionModelChange={(newSelectionModel) => {
                                        selectionModel = newSelectionModel;
                                    }}
                                    onCellClick={(params) => {
                                        pdfId = params.row.id;
                                        trackedEmail = params.row.user_email;
                                    }}
                                    style={{ align: "center" }}
                                />
                            </div>
                            <Button size="large" onClick={onClickContinue} style={{ color: "black" }}>
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
                                            selectionModel={selectionModel}
                                            onSelectionModelChange={(newSelectionModel) => {
                                                selectionModel = newSelectionModel;
                                            }}
                                            onCellClick={(params) => {
                                                console.log(params);
                                                userId = params.row.pdf_id;
                                                console.log(userId);
                                                trackedEmail = params.row.user_email;
                                            }}
                                            style={{ align: "center" }}
                                        />
                                    </div>
                                    <Button size="large" onClick={onClickBack} style={{ color: "black" }}>
                                        BACK
                                    </Button>
                                    <Button size="large" onClick={onClickContinue} style={{ color: "black" }}>
                                        NEXT
                                    </Button>
                                </>
                            ) : (
                                    <>
                                        <AliceCarousel
                                            animationDuration={1}
                                            keyboardNavigation={true}
                                            disableButtonsControls={true}
                                        >
                                            {trackedImages && trackedImages.map((e, index) => (
                                                <img
                                                    key={index}
                                                    src={e}
                                                    style={{ width: "80%", height: 500 }}
                                                />
                                            ))}
                                        </AliceCarousel>
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
                                    </>
                                )
                        )
                )
            }
        </>
    )
}

export default MyPdf;