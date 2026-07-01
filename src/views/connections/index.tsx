import { Tabs, Segmented, Card } from "antd";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import TeamConfiguration from "./settings";
import ITSMConnectors from "./itsmConnecters";
import DatabaseConnectors from "./DatabaseConnecters";
import AIAgentConnectors from "./Aiagent";
import DataHubAgent from "./boomiagent";

const SettingsView = () => {
    const [activeTab, setActiveTab] = useState("Database");

    // Toggle between Custom Agent & Boomi Agent
    const [agentType, setAgentType] = useState<"Boomi" | "Custom">("Custom");

    const items = [
        {
            key: "Database",
            label: "Database Connectors",
            children: <DatabaseConnectors activeTab={activeTab} />,
        },
        {
            key: "AIAgents",
            label: "AI Agent Connectors",
            children: <AIAgentConnectors activeTab={activeTab} />,
        },
        {
            key: "Tickets",
            label: "Ticket Connectors",
            children: <ITSMConnectors activeTab={activeTab} />,
        },
        {
            key: "TeamsConfiguration",
            label: "Teams Configuration",
            children: <TeamConfiguration activeTab={activeTab} />,
        },
    ];

    useEffect(() => {
        const hash = window.location.hash;
        const queryString = hash.split("?")[1];

        if (queryString) {
            const params = new URLSearchParams(queryString);

            const tab = params.get("tab");
            const type = params.get("type");

            if (tab) setActiveTab(tab);

            if (type === "Boomi" || type === "Custom") {
                setAgentType(type);
            }
        }
    }, []);

    const handleTabChange = (key: string) => {
        setActiveTab(key);

        const path = window.location.hash.split("?")[0];

        window.location.hash = `${path}?type=${agentType}&tab=${key}`;
    };

    const handleAgentChange = (value: string) => {
        const type = value as "Boomi" | "Custom";

        setAgentType(type);

        const path = window.location.hash.split("?")[0];

        if (type === "Boomi") {
            window.location.hash = `${path}?type=Boomi`;
        } else {
            window.location.hash = `${path}?type=Custom&tab=${activeTab}`;
        }
    };

    return (
        <div>
            {/* Toggle */}

            <Card
                style={{
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "center",
                }}
                bodyStyle={{ display: "flex", justifyContent: "center" }}
            >
                <Segmented
                    size="large"
                    value={agentType}
                    onChange={handleAgentChange}
                    options={[
                        {
                            label: "Boomi Agent",
                            value: "Boomi",
                        },
                        {
                            label: "Custom Agent",
                            value: "Custom",
                        },
                    ]}
                />
            </Card>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${agentType}-${activeTab}`}
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: -20,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                >
                    {agentType === "Boomi" ? (
                        <DataHubAgent />
                    ) : (
                        <>
                            <Tabs
                                items={items.map((item) => ({
                                    ...item,
                                    children: null,
                                }))}
                                activeKey={activeTab}
                                onChange={handleTabChange}
                                tabBarGutter={40}
                            />

                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {
                                    items.find(
                                        (item) => item.key === activeTab
                                    )?.children
                                }
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default SettingsView;