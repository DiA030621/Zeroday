import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const StripeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const quantity = location.state?.quantity || 1;
    const orderId = location.state?.orderId || 1;
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const totalPrice = quantity * 300;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            alert("Stripe no está listo todavía.");
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        const formData= new FormData();
        formData.append('order_id', orderId);
        try {
            const response = await fetch('http://localhost/zeroday/zeroday/payment', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!data.resultado) {
                alert(data.mensaje);
            } else {
                alert(`✅ Pago exitoso`);
                navigate('/purchase', { state: { quantity, orderId } });
            }

        } catch (error) {
            alert('Error al realizar la solicitud');
            console.error('Error al realizar la solicitud:', error);
        }



        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-50 p-5 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
                <div className="col-md-12">
                    <h2 className="text-center mb-4">Pago con Tarjeta</h2>
                    <div className="mb-3 p-3 border rounded">
                        <h3>Total a pagar {totalPrice}</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 p-3 border rounded">
                            <CardElement
                                options={{ hidePostalCode: true }}
                                className="form-control p-2"
                            />

                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={!stripe || loading}>
                            {loading ? "Procesando..." : "Pagar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StripeForm;
