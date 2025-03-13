import React from "react";
import { useNavigate } from "react-router-dom";
// import productImage from "../assets/vpn-product.jpg";
// import "../styles/Background.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container d-flex justify-content-center align-items-center">
            <div className="card text-center shadow-lg p-4 bg-transparent border-light" style={{ maxWidth: "450px", backdropFilter: "blur(10px)" }}>
                <div className="card-body">
                    <h1 className="card-title fw-bold">VPN 0D4Y</h1>
                    <img src="https://www.bleepstatic.com/content/hl-images/2024/06/10/deeper-connect-air.jpg" alt="VPN 0D4Y" className="img-fluid rounded my-3" />
                    <h5 className="card-text fst-italic">"Tu seguridad digital, nuestra prioridad"</h5>
                    <button className="mt-3 w-100" onClick={() => navigate("/sale")}>
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
