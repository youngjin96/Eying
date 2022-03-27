import Router from "./Router"
import NavBar from "../components/NavBar"
import Footer from "./Footer"
import { CssBaseline } from "@mui/material"

function App() {
  return (
    <>
      <CssBaseline/>
      <NavBar />
      <Router />
      <Footer />
    </>
  )
}


export default App;
