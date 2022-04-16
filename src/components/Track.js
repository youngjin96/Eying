import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from 'axios';

const columns = [
    { field: 'id', headerName: '번호', width: 100 },
    { field: 'pdf_name', headerName: '제목', width: 300 },
    { field: 'job', headerName: '업종', width: 130 },
    { field: 'user_name', headerName: '작성자', width: 130 },
    { field: 'upload_at', headerName: '등록일', width: 160 },
    { field: 'deadline', headerName: '마감일', width: 160 },
    { field: 'views', headerName: '조회수', width: 90}
];

const rows = [
    {   id: 1, 
        title: "발표 준비 자세와 연습", 
        job: 'Snow', 
        nickName: 'Jon', 
        uploadTime: "2022-04-23", 
        deadline: "2022-04-23", 
        view: "43" 
    },
    {   id: 2, 
        title: "2", 
        job: 'Lannister', 
        nickName: 'Cersei', 
        uploadTime: "2022-04-23", 
        deadline: "2022-04-23", 
        view: "43" 
    },
    {   id: 3, 
        title: "2", 
        job: 'Lannister', 
        nickName: 'Jaime', 
        uploadTime: "2022-04-23", 
        deadline: "2022-04-23", 
        view: "43" 
    },
];

const Track = () => {
    const [isClickedTrack, setIsClickedTrack] = useState(false);
    const [selectionModel, setSelectionModel] = useState();
    
    let datas = [];
    let dataa = [];

    // TODO 모든 파일 get요청 후 테이블에 뿌리기
    useEffect(async() => {
        const response = await axios.get('http://52.79.198.166:8000/pdf/');
        
        datas.push(response.data);
        dataa = datas[0];
        console.log(dataa);
        console.log(rows);
    }, []);

    const onClickTrack = async () => {
        const response = await axios.get('http://52.79.198.166:8000/pdf/', {
            params: {
                // TODO pdfId로 가져오기
                id : selectionModel[0]
            }
        });
    }

    return (
        <>
            <div style={{ height: 400, width: '100%', margin: "auto", marginTop: 100 }}>
                <DataGrid
                    rows={dataa}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                />
            </div>
            <Button onClick={onClickTrack}>
                TRACK
            </Button>
        </>
    )
}

export default Track;