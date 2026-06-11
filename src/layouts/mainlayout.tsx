import { useState, type ReactNode } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    RobotOutlined,
    MessageOutlined,
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Avatar } from "antd";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logocomany.png";
const { Header, Sider, Content } = Layout;

interface Props {
    children: ReactNode;
}
export default function MainLayout({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();



    const menus = [
        {
            icon: <HomeOutlined />,
            label: "Dashboard",
            path: "/",
        },
        {
            icon: <RobotOutlined />,
            label: "Bot Management",
            path: "/bot-management",
        },
        {
            icon: <MessageOutlined />,
            label: "Conversations",
            path: "/conversations",
        },
        {
            icon: <BarChartOutlined />,
            label: "Analytics",
            path: "/analytics",
        },
        {
            icon: <SettingOutlined />,
            label: "Settings",
            path: "/settings-page",
        },
    ];

    const selectedMenu =
        menus.find(
            (item) => item.path === location.pathname
        )?.label || "Dashboard";

    const handleLogout = () => {
        // localStorage.clear();
        // sessionStorage.clear();

        navigate("/login");
    };

    return (
        <Layout
            style={{
                minHeight: "100vh",
                background: "#f4f7fc",
            }}
        >
            {/* SIDEBAR */}
            <motion.div
                animate={{
                    width: collapsed ? 90 : 280,
                }}
                transition={{
                    duration: 0.3,
                }}
            >
                <Sider
                    collapsed={collapsed}
                    trigger={null}
                    width={280}
                    collapsedWidth={90}
                    style={{
                        background:
                            "linear-gradient(180deg,#464775,#6264A7)",
                        height: "100vh",
                        position: "fixed",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        overflow: "hidden",
                    }}
                >
                    {/* LOGO */}
                    <div
                        style={{
                            height: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: collapsed
                                ? "center"
                                : "flex-start",
                            paddingLeft: collapsed ? 0 : 30,
                            gap: 12,
                        }}
                    >
                        <motion.img
                            whileHover={{
                                rotate: 10,
                                scale: 1.1,
                            }}
                            src={logo}
                            width={70}
                        />

                        {!collapsed && (
                            <motion.h2
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                style={{
                                    color: "#fff",
                                    margin: 0,
                                }}
                            >
                                Teams Bot
                            </motion.h2>
                        )}
                    </div>

                    {/* MENU */}
                    <div
                        style={{
                            padding: "10px 15px",
                        }}
                    >
                        {menus.map((item) => (
                            <motion.div
                                key={item.label}
                                whileHover={{ x: 8 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(item.path)}
                                style={{
                                    marginBottom: 12,
                                    borderRadius: 14,
                                    cursor: "pointer",
                                    color: "#fff",
                                    padding: "14px 18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 15,
                                    background:
                                        location.pathname === item.path
                                            ? "rgba(255,255,255,0.15)"
                                            : "transparent",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 18,
                                    }}
                                >
                                    {item.icon}
                                </span>

                                {!collapsed && (
                                    <span>{item.label}</span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* USER */}
                    <motion.div
                        whileHover={{
                            scale: 1.03,
                        }}
                        style={{
                            position: "absolute",
                            bottom: 25,
                            left: 15,
                            right: 15,
                            background: "rgba(255,255,255,0.12)",
                            borderRadius: 18,
                            padding: 16,
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <Avatar
                                size={50}
                                icon={<UserOutlined />}
                            />

                            {!collapsed && (
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            color: "#fff",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Admin User
                                    </div>

                                    <div
                                        style={{
                                            color: "rgba(255,255,255,0.7)",
                                            fontSize: 12,
                                        }}
                                    >
                                        Super Admin
                                    </div>
                                </div>
                            )}
                        </div>

                        {!collapsed && (
                            <motion.div
                                whileHover={{
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.95,
                                }}
                                onClick={handleLogout}
                                style={{
                                    marginTop: 14,
                                    cursor: "pointer",
                                    height: 42,
                                    borderRadius: 12,
                                    background:
                                        "linear-gradient(135deg,#EF4444,#DC2626)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 10,
                                    color: "#fff",
                                    fontWeight: 600,
                                    boxShadow:
                                        "0 8px 20px rgba(239,68,68,.35)",
                                }}
                            >
                                <LogoutOutlined />
                                Logout
                            </motion.div>
                        )}

                        {collapsed && (
                            <motion.div
                                whileHover={{
                                    scale: 1.1,
                                }}
                                whileTap={{
                                    scale: 0.9,
                                }}
                                onClick={handleLogout}
                                style={{
                                    marginTop: 12,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background:
                                        "linear-gradient(135deg,#EF4444,#DC2626)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    color: "#fff",
                                }}
                            >
                                <LogoutOutlined />
                            </motion.div>
                        )}
                    </motion.div>

                </Sider>
            </motion.div>

            {/* MAIN */}
            <Layout
                style={{
                    transition: "all .3s",
                }}
            >
                {/* HEADER */}
                <Header
                    style={{
                        margin: 20,
                        height: 80,
                        borderRadius: 24,
                        background:
                            "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(20px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        padding: "0 25px",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,.08)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                        }}
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                cursor: "pointer",
                                fontSize: 22,
                            }}
                        >
                            {collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )}
                        </motion.div>

                        <motion.div
                            key={selectedMenu}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                style={{
                                    margin: 0,
                                    fontSize: 20,
                                    fontWeight: 600,
                                    background:
                                        "linear-gradient(135deg,#6264A7,#8B5CF6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {selectedMenu}
                            </div>
                        </motion.div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 25,
                        }}
                    >


                        <Avatar
                            size={45}
                            icon={<UserOutlined />}
                        />
                    </div>
                </Header>

                {/* CONTENT */}
                <Content
                    style={{
                        padding: 20,
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        style={{
                            background: "#fff",
                            borderRadius: 30,

                            padding: 30,
                            boxShadow:
                                "0 10px 30px rgba(0,0,0,.06)",
                        }}
                    >
                        {children}
                    </motion.div>
                </Content>
            </Layout>
        </Layout>
    );
};

