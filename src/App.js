import './App.scss';
import Navbar1 from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Purchase from "./pages/Purchase";
import Checkout from "./components/Checkout";
import Payment from "./components/StripeForm";
import Verification from "./components/Verification";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_1234567890abcdef");

function App() {
    return (
        <Router>
            {/* Contenedor Principal */}
            <div className="app-background">
                <div className="flex relative z-10">
                    <Sidebar />
                    <div className="w-100">
                        <div className="container  w-100">
                            <Elements stripe={stripePromise}>
                                <Navbar1/>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/sale" element={<Sale />} />
                                    <Route path="/purchase" element={<Purchase />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/payment" element={<Payment />} />
                                    <Route path="/verification" element={<Verification />} />
                                </Routes>
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}


export default App;
