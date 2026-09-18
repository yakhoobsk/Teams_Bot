import React, { useEffect, useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
} from "antd";
import {
    MailOutlined,
    SafetyOutlined,
    RobotOutlined,
    BarChartOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import FeatureCard from "../../components/feturecard";
import { Loginotp, LoginUser } from "../../redux/Services/authService";
import { useAppDispatch } from "../../redux/hooks";

const featureCards = [
    {
        title: "Workflow Automation",
        desc:
            "Automate repetitive business workflows.",
        icon: <ThunderboltOutlined />,
    },
    {
        title: "AI Assistant",
        desc:
            "ChatGPT powered intelligent responses.",
        icon: <RobotOutlined />,
    },
    {
        title: "Analytics Dashboard",
        desc:
            "Real-time monitoring and reporting.",
        icon: <BarChartOutlined />,
    },
    {
        title: "Enterprise Security",
        desc:
            "Secure access and governance.",
        icon: <SafetyOutlined />,
    },
    {
        title: "Smart Notifications",
        desc:
            "Receive instant Teams alerts.",
        icon: <MailOutlined />,
    },
    {
        title: "Copilot Integration",
        desc:
            "Connect ChatGPT, Gemini and Copilot.",
        icon: <RobotOutlined />,
    },
];

const { Title, Text } = Typography;

const emailSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),
});

const otpSchema = Yup.object({
    otp: Yup.string()
        .matches(/^\d{4}$/, "OTP must be 4 digits")
        .required("OTP is required"),
});

const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [slideIndex, setSlideIndex] = useState(0);
    const [emailId, setEmailId] = useState("");
    useEffect(() => {
        const timer = setInterval(() => {
            setSlideIndex((prev) =>
                prev >= featureCards.length - 3
                    ? 0
                    : prev + 1
            );
        }, 2500);

        return () => clearInterval(timer);
    }, []);
    const handleEmailSubmit = async () => {
        try {
            const values = await form.validateFields();

            await emailSchema.validate(values);

            setLoading(true);

            const payload = {
                Email_ID: values.email,
            };

            const response = await dispatch(
                LoginUser(payload)
            ).unwrap();

            if (
                response?.["Status code"] === "200" &&
                response?.["Status Response"] === "Success"
            ) {
                setEmailId(values.email);
                setStep("otp");
            }

            setLoading(false);
        } catch (err: any) {
            setLoading(false);

        }
    };

    const handleOtpSubmit = async () => {
        try {
            const values = await form.validateFields();

            await otpSchema.validate(values);

            setLoading(true);

            const payload = {
                Email_id: emailId,
                Otp: values.otp,
            };

            const response = await dispatch(Loginotp(payload)).unwrap();

            console.log("OTP Response:", response);

            const statusCode = String(response?.["Status code"] ?? "").trim();
            const statusResponse = String(
                response?.["Status_Response"] ?? ""
            )
                .trim()
                .toLowerCase();


            if (
                statusCode === "200" &&
                statusResponse === "success"
            ) {
                localStorage.setItem("isAuthenticated", "true");

                setLoading(false);

                navigate("/WelcomeScreen", {
                    replace: true,
                });

                return;
            }

            setLoading(false);


        } catch (err: any) {
            setLoading(false);


        }
    };
    return (
        <div
            className="login-page"
            style={{
                minHeight: "100vh",
                display: "flex",
                overflow: "hidden",
                background: "#fff",
            }}
        >
            <style>
                {`
          .login-left {
            overflow: hidden;
          }

          @media (max-width: 992px) {
            .login-page {
              flex-direction: column !important;
            }

            .login-left {
              padding: 32px 24px !important;
            }

            .login-hero-logo {
              width: 140px !important;
            }

            .login-hero-title {
              font-size: 32px !important;
              margin-top: 16px !important;
            }

            .login-hero-subtitle {
              font-size: 15px !important;
            }

            .login-feature-carousel {
              display: none !important;
            }

            .login-right {
              width: 100% !important;
              padding: 24px 16px 40px !important;
            }

            .login-card-wrapper {
              width: 100% !important;
              display: flex !important;
              justify-content: center !important;
            }

            .login-card {
              width: 100% !important;
              max-width: 480px !important;
            }
          }

          @media (max-width: 480px) {
            .login-left {
              padding: 24px 16px !important;
            }

            .login-hero-logo {
              width: 120px !important;
            }

            .login-hero-title {
              font-size: 26px !important;
            }

            .login-card {
              border-radius: 20px !important;
            }

            .login-card-header {
              padding: 28px 18px !important;
            }
          }
        `}
            </style>

            {/* LEFT SIDE */}
            <div
                className="login-left"
                style={{
                    flex: 1,
                    background:
                        "linear-gradient(135deg,#464775 0%,#6264A7 50%,#7B83EB 100%)",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "60px",
                    color: "#fff",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        top: -120,
                        right: -120,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        width: 350,
                        height: 350,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        bottom: -80,
                        left: -80,
                    }}
                />

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        maxWidth: 550,
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: "12px 20px",
                            borderRadius: 16,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            className="login-hero-logo"
                            src={logo}
                            width={190}
                            alt="Logo"
                        />
                    </div>

                    <Title
                        className="login-hero-title"
                        style={{
                            color: "#fff",
                            fontSize: 56,
                            marginTop: 25,
                            marginBottom: 10,
                        }}
                    >
                        Teams Bot
                    </Title>

                    <Text
                        className="login-hero-subtitle"
                        style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: 22,
                            display: "block",
                        }}
                    >
                        Intelligent Automation Platform for Teams
                    </Text>

                    <div
                        className="login-feature-carousel"
                        style={{
                            marginTop: 50,
                            width: "100%",
                            maxWidth: 940,
                            overflow: "hidden",
                        }}
                    >
                        <motion.div
                            animate={{
                                x: -(slideIndex * 400),
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            style={{
                                display: "flex",
                                gap: 20,
                                width: "max-content",
                            }}
                        >
                            {[...featureCards, ...featureCards].map(
                                (item, index) => (
                                    <FeatureCard
                                        key={index}
                                        icon={item.icon}
                                        title={item.title}
                                        desc={item.desc}
                                    />
                                )
                            )}
                        </motion.div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 8,
                                marginTop: 20,
                            }}
                        >
                            {featureCards.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width:
                                            slideIndex === index
                                                ? 24
                                                : 8,
                                        height: 8,
                                        borderRadius: 20,
                                        background:
                                            slideIndex === index
                                                ? "#fff"
                                                : "rgba(255,255,255,.4)",
                                        transition: "all .3s",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT SIDE */}
            <div
                className="login-right"
                style={{
                    width: 650,
                    background: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 40,
                }}
            >
                <motion.div
                    className="login-card-wrapper"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <Card
                        className="login-card"
                        variant="borderless"
                        style={{
                            width: 480,
                            borderRadius: 32,
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.98)",
                            backdropFilter: "blur(20px)",
                            boxShadow:
                                "0 30px 80px rgba(15,23,42,0.18)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="login-card-header"
                            style={{
                                background:
                                    "linear-gradient(135deg,#464775 0%,#6264A7 50%,#7B83EB 100%)",
                                margin: "-24px -24px 32px",
                                padding: "40px 30px",
                                textAlign: "center",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    width: 180,
                                    height: 180,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,.08)",
                                    top: -80,
                                    right: -50,
                                }}
                            />

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        margin: "0 auto 20px",
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    {step === "email" ? (
                                        <MailOutlined
                                            style={{
                                                fontSize: 34,
                                                color: "#fff",
                                            }}
                                        />
                                    ) : (
                                        <SafetyOutlined
                                            style={{
                                                fontSize: 34,
                                                color: "#fff",
                                            }}
                                        />
                                    )}
                                </div>

                                <Title
                                    level={2}
                                    style={{
                                        color: "#fff",
                                        marginBottom: 6,
                                    }}
                                >
                                    {step === "email"
                                        ? "Welcome Back"
                                        : "Verify OTP"}
                                </Title>

                                <Text
                                    style={{
                                        color: "rgba(255,255,255,.85)",
                                        fontSize: 15,
                                    }}
                                >
                                    {step === "email"
                                        ? "Sign in securely to continue"
                                        : "Enter the verification code sent to your email"}
                                </Text>
                            </motion.div>
                        </div>

                        <Form form={form} layout="vertical">
                            <AnimatePresence mode="wait">
                                {step === "email" ? (
                                    <motion.div
                                        key="email"
                                        initial={{
                                            opacity: 0,
                                            x: -30,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: 30,
                                        }}
                                    >
                                        <Form.Item
                                            label={
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Email Address
                                                </span>
                                            }
                                            name="email"
                                        >
                                            <Input
                                                size="large"
                                                prefix={
                                                    <MailOutlined
                                                        style={{
                                                            color: "#6264A7",
                                                            fontSize: 18,
                                                            marginTop: 8,
                                                        }}
                                                    />
                                                }
                                                placeholder="name@company.com"
                                                style={{
                                                    height: 58,
                                                    borderRadius: 16,
                                                    background: "#F8F9FD",
                                                }}
                                            />
                                        </Form.Item>

                                        <Button
                                            block
                                            type="primary"
                                            loading={loading}
                                            onClick={handleEmailSubmit}
                                            style={{
                                                height: 58,
                                                borderRadius: 16,
                                                fontWeight: 700,
                                                fontSize: 16,
                                                background:
                                                    "linear-gradient(135deg,#6264A7,#7B83EB)",
                                                border: "none",
                                                boxShadow:
                                                    "0 12px 30px rgba(98,100,167,.35)",
                                            }}
                                        >
                                            Send OTP →
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="otp"
                                        initial={{
                                            opacity: 0,
                                            x: 30,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -30,
                                        }}
                                    >
                                        <Form.Item
                                            label={
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    OTP Verification
                                                </span>
                                            }
                                            name="otp"
                                        >
                                            <Input.Password
                                                maxLength={4}
                                                prefix={
                                                    <SafetyOutlined
                                                        style={{
                                                            color: "#6264A7",
                                                        }}
                                                    />
                                                }
                                                placeholder="Enter OTP"
                                                visibilityToggle={false}
                                                style={{
                                                    height: 58,
                                                    borderRadius: 16,
                                                    background: "#F8F9FD",
                                                    textAlign: "center",
                                                    fontSize: 24,
                                                    letterSpacing: 8,
                                                    border: "1px solid #E5E7EB",
                                                }}
                                            />
                                        </Form.Item>

                                        <Button
                                            block
                                            type="primary"
                                            loading={loading}
                                            onClick={handleOtpSubmit}
                                            style={{
                                                height: 58,
                                                borderRadius: 16,
                                                fontWeight: 700,
                                                fontSize: 16,
                                                background:
                                                    "linear-gradient(135deg,#6264A7,#7B83EB)",
                                                border: "none",
                                                boxShadow:
                                                    "0 12px 30px rgba(98,100,167,.35)",
                                            }}
                                        >
                                            Verify & Login
                                        </Button>

                                        <Button
                                            type="link"
                                            block
                                            style={{
                                                marginTop: 14,
                                                fontWeight: 600,
                                            }}
                                            onClick={() =>
                                                setStep("email")
                                            }
                                        >
                                            ← Change Email
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Form>


                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;