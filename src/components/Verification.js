import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const quantity = location.state?.quantity || 1;
    const orderId = location.state?.orderId || 1;
    const [loading, setLoading] = useState(true);
    const [emailSent, setEmailSent] = useState(false);
    const pollIntervalRef = useRef(null);
    const mounted = useRef(true);

    // Función para enviar el correo de verificación
    const sendVerificationEmail = async () => {
        if (!mounted.current) return;

        try {
            const formData = new FormData();
            formData.append("email", email);
            await fetch("http://localhost/zeroday/zeroday/send_verification_email", {
                method: "POST",
                body: formData
            });
            setEmailSent(true);
        } catch (error) {
            console.error("Error al enviar correo de verificación:", error);
        }
    };

    // Función para verificar el estado del correo
    const checkVerificationStatus = async () => {
        if (!mounted.current) return;

        try {
            const response = await fetch(`http://localhost/zeroday/zeroday/get_email?email=${email}`);
            const data = await response.json();

            if (data.order && data.order.result_object && data.order.result_object.length > 0) {
                const is_verified = data.order.result_object[0].is_verified;

                if (is_verified === "1") {
                    // Si está verificado, navegamos a la página de pago
                    if (mounted.current) {
                        stopPolling();
                        navigate("/payment", { state: { quantity, orderId, email } });
                    }
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error al verificar estado:", error);
            return false;
        }
    };

    // Función para iniciar el polling
    const startPolling = () => {
        // Primera verificación inmediata
        checkVerificationStatus();

        // Establecer el intervalo de polling
        pollIntervalRef.current = setInterval(async () => {
            const verified = await checkVerificationStatus();
            if (verified) {
                stopPolling();
            }
        }, 10000); // Verificar cada 20 segundos
    };

    // Función para detener el polling
    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    useEffect(() => {
        // Marcar componente como montado
        mounted.current = true;

        // Enviar correo de verificación solo una vez al principio
        sendVerificationEmail().then(() => {
            // Iniciar el polling después de enviar el correo
            startPolling();
            setLoading(false);
        });

        // Función de limpieza
        return () => {
            mounted.current = false;
            stopPolling();
        };
    }, []);

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                {loading ? (
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                ) : (
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Verificando...</span>
                    </div>
                )}
                <h3>Se ha enviado un enlace de verificación a su correo.</h3>
                <p>Por favor, revise su bandeja de entrada y confirme su correo para continuar con el pago.</p>
                <p className="text-muted small">Verificando automáticamente cada 20 segundos...</p>
            </div>
        </div>
    );
};

export default Verification;