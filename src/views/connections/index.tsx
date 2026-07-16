import { Tabs } from "antd";
import { useEffect, useState } from "react";
import DatabaseConnectors from "./DatabaseConnecters";
import { motion, AnimatePresence } from "framer-motion";
import RestApiManagement from "./restapiconnecters";


const SettingsView = () => {

    const [activeTab, setActiveTab] = useState("Database");

    const items = [


        { key: "Database", label: "Database Connectors", children: <DatabaseConnectors activeTab={activeTab} type="Datahub" /> },
        { key: "RestAPI", label: "REST API Connectors", children: <RestApiManagement activeTab={activeTab} type="Datahub" /> },
        // { key: "TeamsConfiguration", label: "Teams Configuration", children: <TeamConfiguration activeTab={activeTab} /> },
    ];

    useEffect(() => {
        const hash = window.location.hash;

        const queryString = hash.split("?")[1];

        if (queryString) {
            const params = new URLSearchParams(queryString);
            const tab = params.get("tab");

            if (tab) {
                setActiveTab(tab);
            }
        }
    }, []);

    const handleTabChange = (key: string) => {
        setActiveTab(key);

        const path = window.location.hash.split("?")[0];

        window.location.hash = `${path}?tab=${key}`;
    };


    return (
        <div>
            <Tabs
                items={items.map((item) => ({
                    ...item,
                    children: null,
                }))}
                tabPlacement="top"
                tabBarGutter={40}
                activeKey={activeTab}
                onChange={handleTabChange}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: -20,
                        scale: 0.98,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                >
                    {
                        items.find(
                            (item) => item.key === activeTab
                        )?.children
                    }
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default SettingsView;