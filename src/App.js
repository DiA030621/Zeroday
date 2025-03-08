import './App.scss';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Sales from "./pages/Sales";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="content w-100">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/sales" element={<Sales />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
