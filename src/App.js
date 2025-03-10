import './App.scss';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Purchase from "./pages/Purchase";
import Checkout from "./components/Checkout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            {/* Contenedor Principal */}
            <div className="app-background">
                <div className="flex relative z-10">
                    <Sidebar />
                    <div className="w-100">
                        <div className="container  w-100">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/sale" element={<Sale />} />
                                <Route path="/purchase" element={<Purchase />} />
                                <Route path="/checkout" element={<Checkout />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}


export default App;
