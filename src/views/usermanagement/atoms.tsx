import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { CloudServerOutlined, DatabaseOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AtomStatusGet, AtomStatusUpdate } from "../../redux/Services/connectersServices";
import { ATOM_LIST } from "../../constants/atomList";

const { Title, Text } = Typography;

interface AtomData {
    id: number;
    atomName: string;
    status: "online" | "offline";
    active: boolean;
}

export default function AtomManagement({ activeTab }: { activeTab: string }): React.ReactElement {
    console.log(activeTab);
    const dispatch = useAppDispatch();
    const atomStatusGet = useAppSelector((state) => state.connecters?.AtomStatusGets);
    const [atoms, setAtoms] = useState<AtomData[]>([]);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(AtomStatusGet({}));
    }, [dispatch]);

    useEffect(() => {
        if (atomStatusGet?.Response?.length) {
            const mapped: AtomData[] = atomStatusGet.Response.map((item: any) => {
                const name = item.atom_name || item.atomName || item.name || "";

                // Online/offline health isn't part of this API yet - fall back to the
                // known static Atom list (matched by name) for that indicator.
                const staticMatch = ATOM_LIST.find(
                    (atom) => atom.atomName.toLowerCase() === String(name).toLowerCase()
                );

                return {
                    id: item.id,
                    atomName: name,
                    status: staticMatch?.status || "online",
                    active:
                        String(item.action ?? item.status ?? "")
                            .toLowerCase() === "active",
                };
            });

            setAtoms(mapped);
        }
    }, [atomStatusGet]);

    const onlineCount = atoms.filter((item) => item.status === "online").length;
    const activeAtom = atoms.find((item) => item.active);

    const handleToggle = async (record: AtomData, checked: boolean) => {
        setTogglingId(record.id);

        try {
            // Only one Atom can be Active at a time, activating one deactivates the rest.
            await dispatch(
                AtomStatusUpdate({
                    payload: { id: record.id, action: checked ? "Active" : "InActive" },
                })
            ).unwrap();

            if (checked) {
                const others = atoms.filter((atom) => atom.id !== record.id && atom.active);

                for (const other of others) {
                    await dispatch(
                        AtomStatusUpdate({
                            payload: { id: other.id, action: "InActive" },
                        })
                    ).unwrap();
                }
            }

            dispatch(AtomStatusGet({}));
        } catch (error) {
            console.error(error);
        } finally {
            setTogglingId(null);
        }
    };

    const columns: ColumnsType<AtomData> = [
        {
            title: "Atom Name",
            dataIndex: "atomName",
            key: "atomName",
            render: (atomName: string) => (
                <Space>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DatabaseOutlined />
                    </div>

                    <Text strong style={{ color: "#111827" }}>
                        {atomName}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Atom Status",
            dataIndex: "status",
            key: "status",
            render: (status: "online" | "offline") => (
                <Tag
                    style={{
                        backgroundColor: status === "online" ? "#ecfdf5" : "#fef2f2",
                        color: status === "online" ? "#047857" : "#dc2626",
                        border: status === "online" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        borderRadius: 999,
                        fontWeight: 600,
                        padding: "4px 12px",
                        textTransform: "capitalize",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            marginRight: 6,
                            background: status === "online" ? "#22c55e" : "#ef4444",
                        }}
                    />
                    {status}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space orientation="vertical" size={4} align="center">
                    <Switch
                        checked={record.active}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        loading={togglingId === record.id}
                        onChange={(checked) => handleToggle(record, checked)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div
            className="atom-management-page"
            style={{
                minHeight: "100vh",
                padding: 32,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .atom-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 500 !important;
          }

          .atom-management-card {
            animation: fadeUp 0.45s ease both;
          }

          .summary-card {
            animation: fadeUp 0.35s ease both;
            transition: all 0.25s ease;
          }

          .summary-card:hover,
          .atom-management-card:hover {
            transform: translateY(-2px);
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .atom-management-page {
              padding: 18px !important;
            }
          }
        `}
            </style>

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} lg={14}>
                        <Tag
                            color="blue"
                            style={{
                                borderRadius: 999,
                                padding: "4px 12px",
                                marginBottom: 10,
                                fontWeight: 600,
                            }}
                        >
                            Atom Management
                        </Tag>

                        <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            Atoms
                        </Title>

                        <Text style={{ color: "#64748b", fontSize: 15 }}>
                            Monitor Atom availability and control which Atom is active. Only one Atom can be active at a time.
                        </Text>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Row gutter={[14, 14]}>
                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #dbeafe",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#2563eb", fontWeight: 600 }}>
                                        Online Atoms
                                    </Text>
                                    <Title level={3} style={{ margin: 0, color: "#1d4ed8" }}>
                                        {onlineCount} / {atoms.length}
                                    </Title>
                                </Card>
                            </Col>

                            <Col xs={12}>
                                <Card
                                    className="summary-card"
                                    variant="borderless"
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #bbf7d0",
                                        boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                                    }}
                                    styles={{ body: { padding: 18 } }}
                                >
                                    <Text style={{ color: "#047857", fontWeight: 600 }}>
                                        Active Atom
                                    </Text>
                                    <Title level={4} style={{ margin: 0, color: "#065f46" }}>
                                        {activeAtom ? activeAtom.atomName : "None"}
                                    </Title>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Card
                    className="atom-management-card"
                    variant="borderless"
                    style={{
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                    }}
                    styles={{ body: { padding: 24 } }}
                >
                    <Row
                        align="middle"
                        justify="space-between"
                        gutter={[16, 16]}
                        style={{ marginBottom: 22 }}
                    >
                        <Col>
                            <Space align="center" size={12}>
                                <div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 12,
                                        background: "#eff6ff",
                                        color: "#2563eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 22,
                                    }}
                                >
                                    <CloudServerOutlined />
                                </div>

                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Atom List
                                    </Title>
                                    <Text type="secondary">
                                        View Atom status and switch the active Atom.
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>

                    <Card
                        styles={{
                            body: {
                                padding: 20,
                                overflow: "hidden",
                            }
                        }}
                    >
                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={atoms}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: 450,
                            }}
                        />
                    </Card>
                </Card>
            </div>
        </div>
    );
}
