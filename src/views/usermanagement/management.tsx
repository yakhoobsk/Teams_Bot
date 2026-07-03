import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserManagement from ".";
import GroupManagement from "./groups";


const Management = () => {

    const [activeTab, setActiveTab] = useState("usermanagemnt");

    const items = [


        { key: "usermanagemnt", label: "User Management", children: <UserManagement /> },
        { key: "GroupManagement", label: "Group Management", children: <GroupManagement /> },
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

export default Management;