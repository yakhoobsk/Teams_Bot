import React from "react";
import { motion } from "framer-motion";

interface Props {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

const FeatureCard: React.FC<Props> = ({
    icon,
    title,
    desc,
}) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                y: -8,
            }}
            transition={{
                duration: 0.2,
            }}
            style={{
                marginTop: 18,
                minWidth: 200,
                maxWidth: 280,
                background:
                    "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter:
                    "blur(20px)",
                border:
                    "1px solid rgba(255,255,255,0.15)",
                borderRadius: 24,
                padding: 24,
                minHeight: 190,
                boxShadow:
                    "0 15px 30px rgba(0,0,0,.12)",
            }}
        >
            <div
                style={{
                    width: 65,
                    height: 65,
                    borderRadius: 18,
                    background:
                        "rgba(255,255,255,0.15)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 28,
                    marginBottom: 18,
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "#fff",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color:
                        "rgba(255,255,255,0.85)",
                    lineHeight: 1.6,
                    fontSize: 14,
                }}
            >
                {desc}
            </div>
        </motion.div>
    );
};

export default FeatureCard;