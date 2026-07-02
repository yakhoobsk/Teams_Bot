import React, { useState, type ReactNode } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    ApiOutlined,
    TeamOutlined,
    RobotOutlined,
    DownOutlined,
    RightOutlined,
    SettingOutlined,
    DatabaseOutlined,
    DeploymentUnitOutlined,
    NotificationOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logocomany.png";
import { LogoutUser } from "../redux/Services/connectersServices";
import { useAppDispatch } from "../redux/hooks";
const { Header, Sider, Content } = Layout;

interface Props {
    children: ReactNode;
}
export default function MainLayout({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch()
    const [openMenu, setOpenMenu] = useState("Connector Settings");


    const menus = [
        {
            icon: <RobotOutlined />,
            label: "Teams Bot Configurations",
            path: "/connectionsboomi",
        },
        {
            icon: <SettingOutlined />,
            label: "Connector Settings",
            key: "connector-settings",
            children: [
                {
                    key: "/genralconnections",
                    icon: <DatabaseOutlined />,
                    label: "General Connections",
                    path: "/genralconnections",
                },
                {
                    key: "/connections",
                    icon: <ApiOutlined />,
                    label: "DataHub Connections",
                    path: "/connections",
                },
                {
                    key: "/integrationconnections",
                    icon: <DeploymentUnitOutlined />,
                    label: "Integration Connections",
                    path: "/integrationconnections",
                },
            ],
        },
        {
            icon: <NotificationOutlined />,
            label: "Channels & Alerts",
            path: "/channelspage",
        },
        {
            icon: <TeamOutlined />,
            label: "User Management",
            path: "/user-mangement",
        },
    ];
    const selectedMenu = React.useMemo(() => {
        for (const menu of menus) {
            // Parent menu
            if (menu.path === location.pathname) {
                return menu.label;
            }

            // Child menu
            if (menu.children) {
                const child = menu.children.find(
                    (c) => c.path === location.pathname
                );

                if (child) {
                    return child.label;
                }
            }
        }

        return "No Page Found";
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await dispatch(LogoutUser({})).unwrap();

            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("persist:auth");
            localStorage.removeItem("persist:root");

            localStorage.clear();
            sessionStorage.clear();

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
                            <div key={item.label}>
                                <motion.div
                                    whileHover={{ x: 8 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (item.children) {
                                            setOpenMenu(
                                                openMenu === item.label ? "" : item.label
                                            );
                                        } else {
                                            navigate(item.path);
                                        }
                                    }}
                                    style={{
                                        marginBottom: 12,
                                        borderRadius: 14,
                                        cursor: "pointer",
                                        color: "#fff",
                                        padding: "14px 18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background:
                                            location.pathname === item.path
                                                ? "rgba(255,255,255,0.15)"
                                                : "transparent",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 15,
                                        }}
                                    >
                                        <span style={{ fontSize: 18 }}>
                                            {item.icon}
                                        </span>

                                        {!collapsed && <span>{item.label}</span>}
                                    </div>

                                    {!collapsed &&
                                        item.children &&
                                        (openMenu === item.label ? (
                                            <DownOutlined />
                                        ) : (
                                            <RightOutlined />
                                        ))}
                                </motion.div>

                                {!collapsed &&
                                    item.children &&
                                    openMenu === item.label && (
                                        <div
                                            style={{
                                                marginLeft: 30,
                                                marginBottom: 10,
                                            }}
                                        >
                                            {item.children.map((child) => (
                                                <motion.div
                                                    key={child.path}
                                                    whileHover={{ x: 6 }}
                                                    onClick={() =>
                                                        navigate(child.path)
                                                    }
                                                    style={{
                                                        padding: "10px 16px",
                                                        marginBottom: 6,
                                                        borderRadius: 10,
                                                        cursor: "pointer",
                                                        color:
                                                            location.pathname === child.path
                                                                ? "#fff"
                                                                : "rgba(255,255,255,.8)",
                                                        background:
                                                            location.pathname === child.path
                                                                ? "rgba(255,255,255,.15)"
                                                                : "transparent",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 10,
                                                    }}
                                                >
                                                    {child.icon}
                                                    <span>{child.label}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                            </div>
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

                            borderRadius: 18,
                            padding: 16,
                            backdropFilter: "blur(20px)",
                        }}
                    >


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

                    {/* <div
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
                    </div> */}
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

