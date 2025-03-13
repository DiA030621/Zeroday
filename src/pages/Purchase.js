import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Purchase = () => {

    const [orderId, setOrderId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderId.trim()) {
            alert("Por favor, ingrese un número de orden válido.");
            return;
        }
        navigate("/order-details", { state: { orderId } });
    };
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card text-center shadow-lg p-4 bg-transparent border-light">
                <h2 className="text-center mb-4">Consultar Orden</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Número de Orden</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese su número de orden"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-100">Consultar</button>
                </form>
            </div>
        </div>
    );
};

export default Purchase;
