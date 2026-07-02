import { motion } from "framer-motion";
import logo from "../assets/logocomany.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const WelcomeScreen = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/connectionsboomi", { replace: true });
        }, 2500);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg,#464775 0%,#6264A7 50%,#7B83EB 100%)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: "center",
                    background: "#fff",
                    padding: "60px 80px",
                    borderRadius: 24,
                    boxShadow: "0 20px 50px rgba(0,0,0,.2)",
                }}
            >
                <motion.img
                    src={logo}
                    alt="EasyStepIn"
                    width={220}
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.8 }}
                />

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        marginTop: 30,
                        marginBottom: 10,
                        color: "#464775",
                        fontSize: 38,
                        fontWeight: 700,
                    }}
                >
                    Welcome to
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        color: "#6264A7",
                        fontSize: 34,
                        marginBottom: 20,
                    }}
                >
                    EasyStepIn Teams Bot
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    style={{
                        color: "#666",
                        fontSize: 18,
                    }}
                >
                    Intelligent Automation Platform
                </motion.p>
            </motion.div>
        </div>
    );
};

export default WelcomeScreen;