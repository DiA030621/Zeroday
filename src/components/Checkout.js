import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Checkout = message => {
    const location = useLocation();
    const navigate = useNavigate();
    const quantity = location.state?.quantity || 1;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData= new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('email', email);

        try {
            const response = await fetch('http://localhost/zeroday/zeroday/customer_purchase', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log(data);
            if (!data.resultado) {
                alert(data.mensaje);
                setName('');
                setPhone('');
                setAddress('');
                setEmail('');
                setId('');
            } else {
                setId(data.id);
                alert(`Orden confirmada con ${quantity} items para ${formData.name}`);
                navigate('/checkout', { state: { quantity, id } });
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
