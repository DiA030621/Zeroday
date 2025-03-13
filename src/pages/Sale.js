import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleContinue = () => {
        navigate('/checkout', { state: { quantity } });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-75 p-5 text-center shadow-lg p-4 bg-transparent border-light" >
                <div className="col-md-6 mb-4 mb-md-0">
                    <img src="https://www.bleepstatic.com/content/hl-images/2024/06/10/deeper-connect-air.jpg" alt="Producto" className="w-100 h-auto rounded-md" />
                </div>
                <div className="col-md-6">
                    <h2 className="text-2xl font-semibold mb-4">Compra</h2>
                    <div className="mb-4">
                        <label htmlFor="quantity" className="form-label">Cantidad</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={handleChange}
                            className="form-control"
                            min="1"
                        />
                    </div>
                    <button onClick={handleContinue} className="w-100 mt-4">
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sales;
