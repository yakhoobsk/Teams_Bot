// src/ChannelsPage.tsx
import React, { useEffect, useState } from "react";
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
    DeleteOutlined,
    BellOutlined,
    TeamOutlined,
    AlertOutlined,
} from "@ant-design/icons";
import ChannelsPage from "../components/channelcreate";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ChannelsDelete, ChannelsUser } from "../redux/Services/connectersServices";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);
const { Option } = Select;

interface ChannelData {
    key: string;
    teamName: string;
    channelName: string;
    notificationType: string;
    Type: string;
    members?: string[];
    groups?: string[];
    alerts: string[];
    schedule: string;
}





const Channels: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useAppDispatch()
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<ChannelData[]>([]);
    const channelsget = useAppSelector((state) => state.connecters?.ChannelsUsers) || [];
    console.log(channelsget)
    useEffect(() => {
        dispatch(ChannelsUser({}));
    }, [dispatch]);

    useEffect(() => {
        if (channelsget?.Response?.length) {
            const weekDays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];

            const mappedData: ChannelData[] = channelsget.Response.map((item: any) => {
                // UTC -> IST
                const istTime = dayjs
                    .utc(
                        `2000-01-01 ${String(item.schedule_hours).padStart(2, "0")}:${String(item.schedule_minutes).padStart(2, "0")}`,
                        "YYYY-MM-DD HH:mm"
                    )
                    .tz("Asia/Kolkata")
                    .format("hh:mm A");

                const scheduleParts: string[] = [];

                if (item.schedule_days_of_month) {
                    scheduleParts.push(`Day ${item.schedule_days_of_month}`);
                }

                if (item.schedule_days_of_week !== undefined && item.schedule_days_of_week !== null) {
                    scheduleParts.push(
                        weekDays[Number(item.schedule_days_of_week)] ?? item.schedule_days_of_week
                    );
                }

                scheduleParts.push(istTime);

                return {
                    key: item.id,
                    teamName: item.team_display_name,
                    channelName: item.channel_display_name,
                    notificationType: item.membership_type,
                    Type: item.type,

                    members:
                        item.group_members?.map(
                            (m: any) => `${m.userId} (${m.role})`
                        ) || [],

                    groups: item.group_name ? [item.group_name] : [],

                    alerts: item.channel_alert
                        ? JSON.parse(item.channel_alert)
                        : [],

                    schedule: scheduleParts.join(" • "),
                };
            });

            setTableData(mappedData);
        }
    }, [channelsget]);


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
            title: "Type",
            dataIndex: "Type",
            key: "Type",
            responsive: ["sm", "md", "lg"],
        },

        {
            title: "Members",
            key: "membersGroups",
            responsive: ["sm", "md", "lg"],
            render: (_, record) => {
                if (record.members) {
                    const shown = record.members.slice(0, 2);
                    const hidden = record.members.length - shown.length;

                    return (
                        <Space wrap>
                            {shown.map((m) => {
                                const isOwner = m.toLowerCase().includes("(owner)");

                                return (
                                    <Tag
                                        key={m}
                                        color={isOwner ? "volcano" : "geekblue"}
                                    >
                                        {m}
                                    </Tag>
                                );
                            })}

                            {hidden > 0 && (
                                <Tooltip title={record.members.slice(2).join(", ")}>
                                    <Tag color="purple">+{hidden}...</Tag>
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
                                <Tag color="cyan" key={g}>
                                    {g}
                                </Tag>
                            ))}

                            {hidden > 0 && (
                                <Tooltip title={record.groups.slice(2).join(", ")}>
                                    <Tag color="cyan">+{hidden}...</Tag>
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

                    <Popconfirm
                        title="Are you sure to delete this channel?"
                        onConfirm={() =>
                            dispatch(
                                ChannelsDelete({
                                    id: Number(record.key),
                                })
                            )
                        }
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
                dataSource={tableData}
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
