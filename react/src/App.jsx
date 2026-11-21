import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./login.jsx";
import Frontmain from "./frontmain.jsx";
import "./header.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/frontmain" element={<Frontmain />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;