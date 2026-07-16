import React, { useState } from "react";
import { Table, Checkbox, Space, Form, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BellOutlined } from "@ant-design/icons";
const { Option } = Select;

interface UserPermission {
    key: string;
    name: string;
    email: string;
    mdm: boolean;
    longrun: boolean;
    atom: boolean;
    tickets: boolean;
}

const initialData: UserPermission[] = [
    {
        key: "1",
        name: "John David",
        email: "john@example.com",
        mdm: true,
        longrun: false,
        atom: true,
        tickets: false,
    },
    {
        key: "2",
        name: "Rahul Kumar",
        email: "rahul@example.com",
        mdm: false,
        longrun: true,
        atom: false,
        tickets: true,
    },
    {
        key: "3",
        name: "Peter Smith",
        email: "peter@example.com",
        mdm: true,
        longrun: true,
        atom: false,
        tickets: false,
    },
];

const UserAlertsTable: React.FC = () => {
    const [data, setData] = useState(initialData);

    const handleCheckbox = (
        key: string,
        field: keyof Omit<UserPermission, "key" | "name" | "email">,
        checked: boolean
    ) => {
        setData((prev) =>
            prev.map((item) =>
                item.key === key
                    ? {
                        ...item,
                        [field]: checked,
                    }
                    : item
            )
        );
    };

    const columns: ColumnsType<UserPermission> = [
        {
            title: "User",
            dataIndex: "name",
            key: "name",
            width: 180,
        },
        {
            title: "User Email",
            dataIndex: "email",
            key: "email",
            width: 250,
        },
        {
            title: "MDM",
            dataIndex: "mdm",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.mdm}
                    onChange={(e) =>
                        handleCheckbox(record.key, "mdm", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "LongRun",
            dataIndex: "longrun",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.longrun}
                    onChange={(e) =>
                        handleCheckbox(record.key, "longrun", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Atom",
            dataIndex: "atom",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.atom}
                    onChange={(e) =>
                        handleCheckbox(record.key, "atom", e.target.checked)
                    }
                />
            ),
        },
        {
            title: "Tickets",
            dataIndex: "tickets",
            align: "center",
            render: (_, record) => (
                <Checkbox
                    checked={record.tickets}
                    onChange={(e) =>
                        handleCheckbox(record.key, "tickets", e.target.checked)
                    }
                />
            ),
        },
    ];

    return (
        <>
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
                        <BellOutlined style={{ color: "#14a9fa" }} />
                        Individual Alerts
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

                </div>
            </div>
            <Table
                bordered
                rowKey="key"
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 900 }}
            />
        </>
    );
};

export default UserAlertsTable;