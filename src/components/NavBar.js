import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './Fbase'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    })
  }, []);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onClickLogout = () => {
    signOut(auth).then(() => {
      navigate("/home")
    }).catch((error) => {
      alert(error.message);
    });
  }
  const font = "'Roboto', sans-serif";
  const theme = createTheme({
    typography: {
      fontFamily: font,
      button: {
        textTransform: "none"
      },
    }
  });

  return (
    <AppBar position="sticky" style={{backgroundColor: "white", height: 80}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ThemeProvider theme={theme}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Link to="home" style={{ textDecoration: 'none', textTransform: 'none', color:'black' }}>
                EYING
              </Link>
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                style={{color: "black"}}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to="about_us" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      ABOUT US
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to="contact" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      CONTACT
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to="upload" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      UPLOAD
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to="track" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      TRACK
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to="FAQ" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      FAQ
                    </Link>
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              <Link to="home" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                EYING
              </Link>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 15, gap: 14 }}>
              <Typography
                component="div"
                noWrap
                sx={{ my:4 }}
              >
                <Link to="about_us" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                  ABOUT US
                </Link>
              </Typography>
              <Typography
                component="div"
                noWrap
                sx={{ my:4 }}
              >
                <Link to="upload" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                  UPLOAD
                </Link>
              </Typography>
              <Typography
                component="div"
                noWrap
                sx={{ my:4 }}
              >
                <Link to="track" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                  TRACK
                </Link>
              </Typography>
              <Typography
                component="div"
                noWrap
                sx={{ my:4 }}
              >
                <Link to="contact" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                  CONTACT
                </Link>
              </Typography>
              <Typography
                component="div"
                noWrap
                sx={{ my:4 }}
              >
                <Link to="FAQ" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                  FAQ
                </Link>
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="../img/example.jpg" />
                  </IconButton>
                </Tooltip>
              ) : (
                    <Typography
                      component="div"
                      noWrap
                      sx={{ my:4 }}
                    >
                      <Link to="login" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                        LOGIN
                      </Link>
                    </Typography>
                  )
              }
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <Link to="mypage" style={{ textDecoration: 'none', textTransform: 'none', color: "black" }}>
                      마이페이지
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <Button style={{ textDecoration: 'none', textTransform: 'none', color: "black" }} onClick={onClickLogout}>
                      로그아웃
                    </Button>
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </ThemeProvider>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
