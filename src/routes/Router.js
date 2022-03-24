import { Routes, Route } from 'react-router-dom'
import Home from "../components/Home"
import Login from "../components/Login"
import Gallery from "../components/Gallery"
import How_to_use from "../components/How_to_use"
import Service_center from "../components/Service_center"
import PdfUpload from "../components/PdfUpload"
import Enroll from "../components/Enroll"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="PdfUpload" element={<PdfUpload />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="how_to_use" element={<How_to_use />} />
            <Route path="service_center" element={<Service_center />} />
            <Route path="login" element={<Login />} />
            <Route path="login/enroll" element={<Enroll />} />
        </Routes>
    );
};

export default Router