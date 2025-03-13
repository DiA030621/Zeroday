import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
                const response = await fetch(`http://localhost/zeroday/zeroday/get_order?order_id=${orderId}`);
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
                        <p><strong>Monto Pagado:</strong> ${orderData.amount*300}</p>
                        <p><strong>Cantidad comprada:</strong> {parseInt(cantidad)}</p>
                        <p><strong>Estado de Pago:</strong> {orderData.payment_status}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
