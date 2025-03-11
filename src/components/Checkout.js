import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Checkout = message => {
    const location = useLocation();
    const navigate = useNavigate();
    const quantity = location.state?.quantity || 1;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const total_price = quantity * 300;
        const formData= new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('email', email);
        formData.append('quantity', quantity);
        formData.append('total_price', total_price);

        try {
            const response = await fetch('http://localhost/zeroday/zeroday/get_email?email='+email, {
                method: 'get'
            });
            const data = await response.json();

            console.log(email)
            const isDuplicated = data.order[0].is_verified;

            if (data.resultado) {
                Swal.fire({
                    title: "El correo registrado ya existe",
                    text: "¿Deseas actualizar tus datos?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sí, actualizar",
                    cancelButtonText: "Mantener datos anteriores",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        formData.append('isDuplicated', 1);
                        console.log('hoola')
                    } else {
                        formData.append('isDuplicated', 2);
                    }
                    try{
                        const response = await fetch('http://localhost/zeroday/zeroday/customer_purchase', {
                            method: 'POST',
                            body: formData
                        });
                        const data1 = await response.json();
                        console.log(data1)
                        if (!data1.resultado) {
                            console.log(data1)
                        } else {
                            Swal.fire("Enviado", "Tu compra se ha procesado correctamente", "success");
                            const orderId = data.orderId
                            console.log("aaaaaa");
                            console.log(data.orderId);
                            console.log(orderId);
                            navigate('/payment', {state: {quantity, orderId}});
                        }

                    } catch (error) {
                    alert('Error al realizar la solicitud');
                    console.error('Error al realizar la solicitud:', error);
                }
                });
            }else{
                try {
                    const response = await fetch('http://localhost/zeroday/zeroday/customer_purchase', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    if (!data.resultado) {
                        alert(data.mensaje);
                    } else {
                        const orderId=data.orderId
                        console.log("aaaaaa");
                        console.log(data.orderId);
                        console.log(orderId);
                        alert(`Orden confirmada con ${quantity} items para ${data.id}`);
                        navigate('/payment', { state: { quantity, orderId } });
                    }

                } catch (error) {
                    alert('Error al realizar la solicitud');
                    console.error('Error al realizar la solicitud:', error);
                }
            }

        } catch (error) {
            alert('Error al realizar la solicitud');
            console.error('Error al realizar la solicitud:', error);
        }

    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-75 p-5 rounded-4 text-light" style={{ backgroundColor: 'rgba(36, 73, 120, 0.8)' }}>
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
                            <input type="email" name="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-success w-100 mt-3">
                            Confirmar Compra
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
