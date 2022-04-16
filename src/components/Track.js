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

const Track = () => {
    const [selectionModel, setSelectionModel] = useState();
    const [pdfs, setPdfs] = useState(() => []);

    // TODO 모든 파일 get요청 후 테이블에 뿌리기
    useEffect(async() => {
        let datas = [];
        const response = await axios.get('http://52.79.198.166:8000/pdf/');
        datas.push(response.data);
        setPdfs(datas[0]);
    }, []);

    const onClickTrack = async () => {
        console.log(selectionModel[0]);
        const response = await axios.get('http://52.79.198.166:8000/pdf/search', {
            params: {
                pdf_id : selectionModel[0]
            }
        });
        console.log(response.data[0].imgs_url);
    }


    return (
        <>
            <Button style={{marginTop: 100}} onClick={onClickTrack}>
                TRACK
            </Button>
            <div style={{ height: 400, width: '100%', margin: "auto" }}>
                <DataGrid
                    rows={pdfs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                />
            </div>
        </>
    )
}

export default Track;