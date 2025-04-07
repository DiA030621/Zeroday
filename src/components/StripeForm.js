import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StripeForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const quantity = location.state?.quantity || 1;
    const orderId = location.state?.orderId || 1;
    const email = location.state?.email || "";
    const [loading, setLoading] = useState(false);

    // Estados para los campos del formulario
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    // Estados para errores
    const [errors, setErrors] = useState({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardHolderName: ""
    });

    const unitPrice = 1000;
    const subtotal = (unitPrice / 1.16) * quantity;
    const iva = (unitPrice - unitPrice / 1.16) * quantity;
    const totalPrice = unitPrice * quantity;

    // Función para formatear el número de tarjeta con espacios cada 4 dígitos
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(" ");
        } else {
            return value;
        }
    };

    // Función para formatear la fecha de expiración (MM/AA)
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

        if (v.length > 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }

        return v;
    };

    // Validación de campos
    const validateCardNumber = (number) => {
        const regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
        return regex.test(number.replace(/\s/g, ""));
    };

    const validateExpiryDate = (date) => {
        if (!date || date.length !== 5) return false;

        const [month, year] = date.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10);

        if (expMonth < 1 || expMonth > 12) return false;
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    };

    const validateCVC = (cvc) => {
        return /^\d{3,4}$/.test(cvc);
    };

    const validateName = (name) => {
        return name.trim().length > 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Realizar validaciones
        const newErrors = {
            cardNumber: validateCardNumber(cardNumber) ? "" : "Número de tarjeta inválido",
            expiryDate: validateExpiryDate(expiryDate) ? "" : "Fecha de expiración inválida",
            cvc: validateCVC(cvc) ? "" : "CVC inválido",
            cardHolderName: validateName(cardHolderName) ? "" : "Nombre requerido"
        };

        setErrors(newErrors);

        // Verificar si hay errores
        if (Object.values(newErrors).some(error => error !== "")) {
            setLoading(false);
            return;
        }

        // Integración con tu backend
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('email', email);

        try {
            const response = await fetch('https://zer0d4y.store/zeroday/zeroday/payment', {
                method: 'POST',
                redirect: 'follow',
                body: formData
            });

            const data = await response.json();
            if (!data.resultado) {
                alert(data.mensaje);
            } else {
                alert(`✅ Pago exitoso, se ha enviado un correo número de orden`);
                navigate('/purchase', { state: { quantity, orderId } });
            }
        } catch (error) {
            alert('Error al realizar la solicitud');
            console.error('Error al realizar la solicitud:', error);
        }

        setLoading(false);
    };

    return (
        <div id="payment-container" className="d-flex justify-content-center align-items-start min-vh-100 py-4">
            <div id="payment-box" className="row p-4 rounded-lg shadow-lg bg-transparent border-light rounded-4">
                <div className="col-md-12">
                    <h2 id="payment-title" className="text-center mb-4">Pago con Tarjeta</h2>

                    <div id="payment-summary" className="mb-3 p-3 border rounded">
                        <h4>Detalle de la Venta</h4>
                        <p><strong>Cantidad:</strong> {quantity}</p>
                        <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                        <p><strong>IVA (16%):</strong> ${iva.toFixed(2)}</p>
                        <h3><strong>Total a pagar:</strong> ${totalPrice.toFixed(2)}</h3>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div id="card-element-wrapper" className="mb-3">
                            <label htmlFor="cardHolderName" className="form-label">Nombre del titular</label>
                            <input
                                type="text"
                                className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
                                id="cardHolderName"
                                value={cardHolderName}
                                onChange={(e) => setCardHolderName(e.target.value)}
                                placeholder="Como aparece en la tarjeta"
                            />
                            {errors.cardHolderName && <div className="invalid-feedback">{errors.cardHolderName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">Número de tarjeta</label>
                            <input
                                type="text"
                                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                id="cardNumber"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength="19"
                                placeholder="1234 5678 9012 3456"
                            />
                            {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="expiryDate" className="form-label">Fecha de expiración</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                    maxLength="5"
                                    placeholder="MM/AA"
                                />
                                {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="cvc" className="form-label">CVC/CVV</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                                    id="cvc"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                    maxLength="4"
                                    placeholder="123"
                                />
                                {errors.cvc && <div className="invalid-feedback">{errors.cvc}</div>}
                            </div>
                        </div>

                        <button
                            id="payment-button"
                            type="submit"
                            className="btn btn-primary w-100 mt-3 mb-3"
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Pagar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StripeForm;