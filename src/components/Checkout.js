import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const quantity = location.state?.quantity || 1;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    // Validar correo electrónico
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!validateEmail(value)) {
            setEmailError("Formato de correo no válido");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setEmailError("Formato de correo no válido");
            return;
        }
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula una espera
        setLoading(false);

        const total_price = quantity * 300;
        const formData= new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('email', email);
        formData.append('quantity', quantity);
        formData.append('total_price', total_price);

        try {
            const response = await fetch(` https://snapper-finer-boa.ngrok-free.app/zeroday/zeroday/get_email?email=${email}`, {
                method: 'get'
            });
            const data = await response.json();

            if (data.order.result_object[0]) {
                await Swal.fire({
                    title: "El correo registrado ya existe",
                    text: "¿Deseas actualizar tus datos?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, actualizar",
                    cancelButtonText: "Mantener datos anteriores",
                }).then(async (result) => {
                    formData.append('isDuplicated', result.isConfirmed ? 1 : 2);
                });
            } else {
                formData.append('isDuplicated', 0);
            }

            try {
                const response = await fetch(' https://snapper-finer-boa.ngrok-free.app/zeroday/zeroday/customer_purchase', {
                    method: 'POST',
                    body: formData
                });

                const data1 = await response.json();
                if (!data1.resultado) {
                    alert('Error en la compra');
                } else {
                    const orderId = data1.orderId;
                    alert(`Orden confirmada con ${quantity} items para ${orderId}`);
                    navigate('/Verification', { state: { quantity, orderId, email } });
                }

            } catch (error) {
                alert('Error al realizar la solicitud');
                console.error('Error al realizar la solicitud:', error);
            }

        } catch (error) {
            alert('Error al realizar la solicitud');
            console.error('Error al realizar la solicitud:', error);
        }

    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card text-center shadow-lg p-4 bg-transparent border-light">
                <div className="col-md-12">
                    <h2 className="text-2xl font-semibold mb-4">Detalles de Compra</h2>
                    <p className="mb-3">Cantidad: <strong>{quantity}</strong></p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" name="name" className="form-control" onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="tel" name="phone" className="form-control" onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input type="text" name="address" className="form-control" onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Correo Electrónico</label>
                            <input type="email" name="email" className="form-control" onChange={handleEmailChange} required />
                            {emailError && <p className="text-danger">{emailError}</p>}
                        </div>
                        <button type="submit" className="w-100 mt-3" disabled={loading || emailError}>
                            {loading ? "Cargando..." : "Confirmar Compra"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
