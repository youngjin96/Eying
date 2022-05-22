import { Grid } from '@mui/material';

import ReactPlayer from 'react-player/lazy';

const IntroduceVideo = ({playList, index}) => {
    return (
        <Grid container columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 20 }}>
            <Grid item xs={3} sm={6} md={12}>
                <ReactPlayer
                    className='react-player'
                    url={'https://youtu.be/Qwk2XAd6FpI'}    // 플레이어 url
                    width='80%'         // 플레이어 크기 (가로)
                    height= '400px'        // 플레이어 크기 (세로)
                    playing={false}        // 자동 재생 on
                    muted={false}          // 자동 재생 on
                    controls={true}       // 플레이어 컨트롤 노출 여부
                    light={false}         // 플레이어 모드
                    pip={true}            // pip 모드 설정 여부
                    style={{margin: "auto"}}
                />
            </Grid>
        </Grid>
    )
}

export default IntroduceVideo;