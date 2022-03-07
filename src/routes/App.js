import Router from "./Router"
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useState } from "react";
import { Grid } from "@mui/material";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Grid>
      <Button variant="text">
        <Link to="/home" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
          Home
        </Link>
      </Button>

      <Button variant="text" style={{ marginLeft: 200 }}>
        <Link to="/how_to_use" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
          이용방법
        </Link>
      </Button>
    
      <Button variant="text" style={{ marginLeft: 200 }}>
        <Link to="/gallery" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
          갤러리
        </Link>
      </Button>

      <Button variant="text" style={{ marginLeft: 200 }}>
        <Link to="/apply_exhibition" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
          전시신청
        </Link>
      </Button>

      <Button variant="text" style={{ marginLeft: 200 }}>
        <Link to="/service_center" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
          고객센터
        </Link>
      </Button>

      {isAdmin ? (
        <span>
          <Button variant="text" style={{ marginLeft: 200 }}>
            <Link to="/admin" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
              관리자
            </Link>
          </Button>
        </span>
      ) : (
        <span></span>
        )
      }

      {isLoggedIn ? (
        <span>
          <Button variant="text" style={{ float: 'right', textTransform: 'none', color: "black" }}>
            Logout
          </Button>
          <Button style={{ float: "right" }}>
            <Link to="/mypage" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
              My Page
            </Link>
          </Button>
        </span>
      ) : (
          <Button variant="text" style={{ float: 'right' }}>
            <Link to="/login" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
              Login
            </Link>
          </Button>
          )
      }
      <Router />
  </Grid >
  
  )
}
export default App;
