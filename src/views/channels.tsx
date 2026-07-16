// src/ChannelsPage.tsx
import React, { useState } from "react";
import {
    Table,
    Button,
    Tag,
    Space,
    Tooltip,
    Popconfirm,
    Form,
    Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    EditOutlined,
    DeleteOutlined,
    BellOutlined,
    TeamOutlined,
    AlertOutlined,
} from "@ant-design/icons";
import ChannelsPage from "../components/channelcreate";
const { Option } = Select;

interface ChannelData {
    key: string;
    teamName: string;
    channelName: string;
    notificationType: string;
    members?: string[];
    groups?: string[];
    alerts: string[];
    schedule: string;
}

const data: ChannelData[] = [
    {
        key: "1",
        teamName: "Team Alpha",
        channelName: "General",
        notificationType: "Individual",
        members: ["Alice", "Bob", "Charlie", "David"],
        alerts: ["MDM", "Tickets", "Atom"],
        schedule: "Weekly",
    },
    {
        key: "2",
        teamName: "Team Beta",
        channelName: "Ops",
        notificationType: "Group",
        groups: ["OpsGroup", "SupportGroup", "InfraGroup"],
        alerts: ["Longrun", "Atom"],
        schedule: "Daily",
    },
];



const Channels: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();

    const showModal = (record?: ChannelData) => {
        if (record) {
            form.setFieldsValue({
                teamDisplayName: record.teamName,
                channelDisplayName: record.channelName,
                notificationType: record.notificationType,
                alerts: record.alerts,
                scheduleType: record.schedule,
            });
        } else {
            form.resetFields();
        }

        setIsModalVisible(true);
    };




    const columns: ColumnsType<ChannelData> = [
        {
            title: "Team Name",
            dataIndex: "teamName",
            key: "teamName",
            responsive: ["xs", "sm", "md", "lg"],
            render: (text) => (
                <Space>
                    <TeamOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: "Channel Name",
            dataIndex: "channelName",
            key: "channelName",
            responsive: ["sm", "md", "lg"],
        },

        {
            title: "Members ",
            key: "membersGroups",
            responsive: ["sm", "md", "lg"],
            render: (_, record) => {
                if (record.members) {
                    const shown = record.members.slice(0, 2);
                    const hidden = record.members.length - shown.length;
                    return (
                        <Space wrap>
                            {shown.map((m) => (
                                <Tag key={m}>{m}</Tag>
                            ))}
                            {hidden > 0 && (
                                <Tooltip title={record.members.slice(2).join(", ")}>
                                    <Tag>+{hidden}...</Tag>
                                </Tooltip>
                            )}
                        </Space>
                    );
                }
                if (record.groups) {
                    const shown = record.groups.slice(0, 2);
                    const hidden = record.groups.length - shown.length;
                    return (
                        <Space wrap>
                            {shown.map((g) => (
                                <Tag color="blue" key={g}>
                                    {g}
                                </Tag>
                            ))}
                            {hidden > 0 && (
                                <Tooltip title={record.groups.slice(2).join(", ")}>
                                    <Tag color="blue">+{hidden}...</Tag>
                                </Tooltip>
                            )}
                        </Space>
                    );
                }
                return null;
            },
        },
        {
            title: "Alerts",
            dataIndex: "alerts",
            key: "alerts",
            responsive: ["sm", "md", "lg"],
            render: (alerts: string[]) => {
                const shown = alerts.slice(0, 2);
                const hidden = alerts.length - shown.length;
                return (
                    <Space wrap>
                        {shown.map((a) => (
                            <Tag color="green" key={a}>
                                <BellOutlined /> {a}
                            </Tag>
                        ))}
                        {hidden > 0 && (
                            <Tooltip title={alerts.slice(2).join(", ")}>
                                <Tag color="green">+{hidden}...</Tag>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
        {
            title: "Schedule",
            dataIndex: "schedule",
            key: "schedule",
            responsive: ["md", "lg"],
        },
        {
            title: "Actions",
            key: "actions",
            responsive: ["xs", "sm", "md", "lg"],
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit Channel">
                        <Button
                            shape="circle"
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Are you sure to delete this channel?"
                        onConfirm={() => console.log("Delete", record.key)}
                    >
                        <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                            size="middle"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Space>
                        <AlertOutlined style={{ color: "#14a9fa" }} />
                        Channels
                    </Space>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}  >
                    <Form.Item
                        name="datahubIntegration"
                    >
                        <Select placeholder="Select Datahub / Integration" size="large" style={{ width: 250 }} >
                            <Option value="Public">Datahub</Option>
                            <Option value="Private">Integration</Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" onClick={() => showModal()}>
                        + Create Channel
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="key"
                scroll={{ x: "max-content" }}
            />
            <ChannelsPage
                open={isModalVisible}
                form={form}
                onCancel={() => setIsModalVisible(false)}

            />
        </div>

    );
};

export default Channels;
