import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const OrderDetails = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || "";
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(` https://snapper-finer-boa.ngrok-free.app/zeroday/zeroday/get_order?order_id=${orderId}`);
                const data = await response.json();

                if (data.resultado) {
                    setOrderData(data.order[0]);
                    setCantidad(parseInt(data.order[0].amount, 10) || 0);
                } else {
                    setError("No se encontraron detalles para esta orden.");
                }
            } catch (error) {
                setError("Error al obtener los detalles de la orden.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleGenerateInvoice = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Generar Factura",
            html: '<input id="customer_rfc" class="swal2-input" placeholder="RFC">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Generar",
            preConfirm: () => {
                const rfc = document.getElementById("customer_rfc").value.trim().toUpperCase();

                // Expresión regular para validar RFC (Persona Física y Moral)
                const rfcRegex = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/;

                if (!rfc) {
                    Swal.showValidationMessage("El RFC no puede estar vacío");
                    return false;
                }

                if (!rfcRegex.test(rfc)) {
                    Swal.showValidationMessage("El RFC ingresado no es válido");
                    return false;
                }

                return { rfc };
            }
        });

        if (formValues) {

            const formData = new FormData();
            formData.append("order_id", orderId);
            formData.append("customer_name", orderData.customer_name);
            formData.append("customer_email", orderData.customer_email);
            formData.append("customer_address", orderData.customer_address);
            formData.append("customer_rfc", formValues.rfc);
            formData.append("amount", orderData.amount);
            try {
                const response = await fetch(" https://snapper-finer-boa.ngrok-free.app/zeroday/zeroday/generate_invoice", {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();
                console.log(result);
                if (result.status) {
                    Swal.fire("Éxito", "Factura enviada a su correo correctamente", "success");
                } else {
                    Swal.fire("Error", "Hubo un problema al generar la factura", "error");
                }
            } catch (error) {
                Swal.fire("Error", "No se pudo conectar con el servidor", "error");
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card text-center shadow-lg p-4 bg-transparent border-light">
                <h2 className="text-center mb-4">Detalles de la Orden</h2>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : (
                    <div>
                        <p><strong>Estado de la Orden:</strong> {orderData.order_status}</p>
                        <p><strong>Cliente:</strong> {orderData.customer_name}</p>
                        <p><strong>Email:</strong> {orderData.customer_email}</p>
                        <p><strong>Teléfono:</strong> {orderData.customer_phone}</p>
                        <p><strong>Monto Pagado:</strong> ${orderData.amount * 300}</p>
                        <p><strong>Cantidad comprada:</strong> {parseInt(cantidad)}</p>
                        <p><strong>Estado de Pago:</strong> {orderData.payment_status}</p>
                        <button className="btn btn-primary mt-3" onClick={handleGenerateInvoice}>
                            Generar Factura
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;