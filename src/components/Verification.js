import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Verification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const quantity = location.state?.quantity || 1;
    const orderId = location.state?.orderId || 1;
    const [verified, setVerified] = useState(false);
    const validationRequestedRef = useRef(false);
    const timeoutRef = useRef(null);
    const isNavigatingRef = useRef(false); // Add a ref to track navigation status

    const checkEmailVerification = async () => {
        // Don't proceed if we're already navigating away
        if (isNavigatingRef.current) return;

        try {
            const response = await fetch(`http://localhost/zeroday/zeroday/get_email?email=${email}`);
            const data = await response.json();
            const is_verified = data.order.result_object[0].is_verified;

            if (is_verified === "1") {
                setVerified(true);
                isNavigatingRef.current = true; // Set flag before navigation

                // Clear the timeout immediately before navigating
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }

                navigate("/payment", { state: { quantity, orderId } });
                return;
            }

            // Only send email if not requested before
            if (is_verified === "0" && !validationRequestedRef.current) {
                validateEmail();
            }

            console.log("Correo no verificado, reintentando en 20 segundos...");

            // Only set a new timeout if we're not navigating
            if (!isNavigatingRef.current) {
                timeoutRef.current = setTimeout(checkEmailVerification, 20000);
            }
        } catch (error) {
            console.error("Error al verificar el email:", error);

            // Only set a new timeout if we're not navigating
            if (!isNavigatingRef.current) {
                timeoutRef.current = setTimeout(checkEmailVerification, 20000);
            }
        }
    };

    const validateEmail = async () => {
        try {
            validationRequestedRef.current = true;
            const formData = new FormData();
            formData.append("email", email);
            const response = await fetch("http://localhost/zeroday/zeroday/send_verification_email", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            console.log("✅ Correo de verificación enviado:", data);
        } catch (error) {
            console.error("❌ Error al enviar el correo:", error);
        }
    };

    useEffect(() => {
        // Start the initial check
        checkEmailVerification();

        // Clean up function
        return () => {
            // Make sure to set the navigation flag to true when unmounting
            isNavigatingRef.current = true;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);  // Remove dependencies to avoid re-triggering the effect

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <h3>Se ha enviado un enlace de verificación a su correo.</h3>
                <p>Por favor, revise su bandeja de entrada y confirme su correo para continuar con el pago.</p>
            </div>
        </div>
    );
};

export default Verification;