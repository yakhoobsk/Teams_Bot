import { useEffect, useState, type Key, type ReactNode } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Tag,
    Typography,
    Input,
    Button,
    Modal,
    Form,
    Space,
    Tooltip,
    Checkbox,
    Select,
    Collapse,
} from "antd";
import {
    EditOutlined,
    KeyOutlined,
    PlusOutlined,
    SafetyOutlined,
    SearchOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { userCreate, UsersGet, UserUpdate, GroupsGet, TeamModuleAccessUpdate } from "../../redux/Services/connectersServices";
import AppPagination from "../../components/AppPagination";
import type { ColumnsType } from "antd/es/table";
import { MODULE_ACCESS_OPTIONS } from "../../constants/moduleAccess";
import type { RoleData } from "../../constants/roles";
import { parseGroupMembers } from "../../utils/groupMembers";

const { Title, Text } = Typography;
const { Panel } = Collapse;

type ModulePermission = { read: boolean; write: boolean };
type ModulePermissions = Record<string, ModulePermission>;

// Maps a module's Read/Write checkboxes to the flat field names the
// create/update User APIs expect (e.g. mdm_read, mdm_write - "0"/"1" strings).
const MODULE_PAYLOAD_KEYS: Record<string, { read: string; write: string }> = {
    MDM: { read: "mdm_read", write: "mdm_write" },
    LongRun: { read: "longRun_read", write: "longRun_write" },
    Atom: { read: "atom_read", write: "atom_write" },
    Tickets: { read: "tickets_read", write: "tickets_write" },
    "Error Handler": { read: "error_handler_read", write: "error_handler_write" },
};

const buildModuleAccessFields = (perms: ModulePermissions): Record<string, string> => {
    const fields: Record<string, string> = {};

    Object.entries(MODULE_PAYLOAD_KEYS).forEach(([module, keys]) => {
        fields[keys.read] = perms[module]?.read ? "1" : "0";
        fields[keys.write] = perms[module]?.write ? "1" : "0";
    });

    return fields;
};

const isTruthyFlag = (value: any) => value === true || value === "true" || value === "1" || value === 1;

// Reverse of buildModuleAccessFields - reads the flat mdm_read/mdm_write/...
// fields a GET user record comes back with into the checkbox grid's shape.
const parseModuleAccessFields = (item: any): ModulePermissions => {
    const perms: ModulePermissions = {};

    Object.entries(MODULE_PAYLOAD_KEYS).forEach(([module, keys]) => {
        perms[module] = {
            read: isTruthyFlag(item?.[keys.read]),
            write: isTruthyFlag(item?.[keys.write]),
        };
    });

    return perms;
};

// Maps a module's Read/Write checkboxes to the nested module_access object
// the team/update API expects (numeric 1/0, not strings).
const TEAM_MODULE_ACCESS_KEYS: Record<string, string> = {
    MDM: "mdm",
    LongRun: "longrun",
    Atom: "atom",
    Tickets: "tickets",
    "Error Handler": "error_handler",
};

const buildTeamModuleAccess = (perms: ModulePermissions) => {
    const access: Record<string, { read: number; write: number }> = {};

    Object.entries(TEAM_MODULE_ACCESS_KEYS).forEach(([module, key]) => {
        access[key] = {
            read: perms[module]?.read ? 1 : 0,
            write: perms[module]?.write ? 1 : 0,
        };
    });

    return access;
};

// Only MDM / LongRun expose separate Read and Write checkboxes. Every other
// module (Atom, Tickets, Error Handler) shows a single Read checkbox that
// grants both read and write.
const READ_WRITE_MODULES = new Set(["MDM", "LongRun"]);

const ModuleAccessGrid = ({
    value,
    onChange,
}: {
    value?: ModulePermissions;
    onChange?: (value: ModulePermissions) => void;
}) => {
    const current = value || {};

    const handleToggle = (module: string, field: "read" | "write", checked: boolean) => {
        let next: ModulePermission;

        if (!READ_WRITE_MODULES.has(module)) {
            // Single Read checkbox for this module - it grants both read and write.
            next = { read: checked, write: checked };
        } else {
            next = {
                read: current[module]?.read || false,
                write: current[module]?.write || false,
                [field]: checked,
            };

            // MDM / LongRun require Read to grant Write - checking Write also checks Read.
            // Unchecking Write leaves Read as-is.
            if (field === "write" && checked) {
                next.read = true;
            }
        }

        onChange?.({
            ...current,
            [module]: next,
        });
    };

    return (
        <Row gutter={[12, 12]}>
            {MODULE_ACCESS_OPTIONS.map((module) => {
                const enabled = current[module]?.read || current[module]?.write;
                const hasWriteCheckbox = READ_WRITE_MODULES.has(module);

                return (
                    <Col xs={24} sm={12} key={module}>
                        <div
                            style={{
                                border: enabled ? "1px solid #93c5fd" : "1px solid #e5e7eb",
                                background: enabled ? "#eff6ff" : "#fff",
                                borderRadius: 10,
                                padding: "12px 14px",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <Text strong style={{ display: "block", marginBottom: 8, color: "#111827" }}>
                                {module}
                            </Text>
                            <Space size={16}>
                                <Checkbox
                                    checked={current[module]?.read || false}
                                    onChange={(e) => handleToggle(module, "read", e.target.checked)}
                                >
                                    <span style={{ color: "#475569" }}>Read</span>
                                </Checkbox>
                                {hasWriteCheckbox && (
                                    <Checkbox
                                        checked={current[module]?.write || false}
                                        onChange={(e) => handleToggle(module, "write", e.target.checked)}
                                    >
                                        <span style={{ color: "#475569" }}>Write</span>
                                    </Checkbox>
                                )}
                            </Space>
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};

const SectionHeader = ({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle?: string;
}) => (
    <Space align="start" size={12} style={{ marginBottom: 18 }}>
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
                fontSize: 16,
                flexShrink: 0,
            }}
        >
            {icon}
        </div>

        <div>
            <Text strong style={{ display: "block", fontSize: 15, color: "#111827" }}>
                {title}
            </Text>
            {subtitle && (
                <Text style={{ fontSize: 12, color: "#64748b" }}>{subtitle}</Text>
            )}
        </div>
    </Space>
);

type UserRow = {
    id: string | number;
    rawId: string;
    userName: string;
    usermail: string;
    role: string;
    active: boolean;
    isBoomiUser: boolean;
    moduleAccess: ModulePermissions;
};

type AddUserFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    active: boolean;
    moduleAccess: ModulePermissions;
    teamAccess: string[];
    atomAccess: string[];
};

const UserManagement = ({ activeTab, roles }: { activeTab: string; roles: RoleData[] }) => {
    const dispatch = useAppDispatch();
    const userspage = useAppSelector((state) => state.connecters?.usersget);
    const groupResponse = useAppSelector((state) => state.connecters.GroupsGets);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [form] = Form.useForm<AddUserFormValues>();
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [search, setSearch] = useState("");
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [teamModulePermissions, setTeamModulePermissions] = useState<Record<string, ModulePermissions>>({});
    const [teamAccessOpen, setTeamAccessOpen] = useState(false);
    const [teamAccessTeams, setTeamAccessTeams] = useState<string[]>([]);
    const [teamAccessModules, setTeamAccessModules] = useState<ModulePermissions>({});
    const [savingTeamAccess, setSavingTeamAccess] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [accessModalOpen, setAccessModalOpen] = useState(false);
    const [accessTargetUser, setAccessTargetUser] = useState<UserRow | null>(null);
    const [accessModules, setAccessModules] = useState<ModulePermissions>({});
    const [savingUserAccess, setSavingUserAccess] = useState(false);

    useEffect(() => {
        if (activeTab === "usermanagemnt") {
            const payload = {
                search_by_filter: "All",
                search: search,
            };
            dispatch(UsersGet({ Payload: payload, pagnation: pagination }));
        }

    }, [dispatch, pagination, search]);

    useEffect(() => {
        if (activeTab === "usermanagemnt") {
            dispatch(GroupsGet({}));
        }
    }, [dispatch]);

    const teamOptions =
        groupResponse?.Response?.map((group: any) => ({
            label: group.group_name,
            value: group.group_name,
        })) || [];

    const roleOptions = roles.map((role) => ({
        label: role.roleName,
        value: role.roleName,
    }));

    const handlePagination = (page: number, limit: number) => {
        setPagination({ page, limit });
    };

    const handleSearch = (value: string) => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        setSearch(value);
    };

    const users: UserRow[] = (userspage?.[0]?.results || []).map((item: any) => ({
        id: item.boomi_user_id,
        rawId: item.id,
        userName: `${item.first_name} ${item.last_name}`,
        usermail: item.user_id,
        role: item.type,
        active: item.is_boomi_user === "true",
        isBoomiUser: item.is_boomi_user === "true",
        moduleAccess: parseModuleAccessFields(item),
    }));

    const tableUsers = users;

    const openAddUser = () => {
        setIsEdit(false);
        setSelectedUser(null);
        setSelectedTeams([]);
        setTeamModulePermissions({});
        setAddUserOpen(true);
    };
    const closeAddUser = () => {
        setSelectedTeams([]);
        setTeamModulePermissions({});
        setAddUserOpen(false);
    };

    const handleTeamAccessChange = (teams: string[]) => {
        setSelectedTeams(teams);
        setTeamModulePermissions((prev) => {
            const next: Record<string, ModulePermissions> = {};
            teams.forEach((team) => {
                next[team] = prev[team] || {};
            });
            return next;
        });
    };

    const handleTeamModuleChange = (team: string, permissions: ModulePermissions) => {
        setTeamModulePermissions((prev) => ({ ...prev, [team]: permissions }));
    };

    const buildAccessControl = (values: AddUserFormValues): Record<string, string> => {
        if (isEdit && selectedTeams.length > 0) {
            // No per-team permission field exists on the User API - a module is
            // granted if any of the user's restricted teams grants it.
            const merged: ModulePermissions = {};

            selectedTeams.forEach((team) => {
                const perms = teamModulePermissions[team] || {};

                Object.keys(MODULE_PAYLOAD_KEYS).forEach((module) => {
                    merged[module] = {
                        read: merged[module]?.read || perms[module]?.read || false,
                        write: merged[module]?.write || perms[module]?.write || false,
                    };
                });
            });

            return buildModuleAccessFields(merged);
        }

        return buildModuleAccessFields(values.moduleAccess || {});
    };

    const handleUpdateTeamAccess = async () => {
        setSavingTeamAccess(true);
        try {
            const moduleAccess = buildTeamModuleAccess(teamAccessModules);

            for (const teamName of teamAccessTeams) {
                const group = groupResponse?.Response?.find(
                    (item: any) => item.group_name === teamName
                );

                const payload = {
                    id: Number(group?.id),
                    team_name: teamName,
                    members: parseGroupMembers(group?.members),
                    module_access: moduleAccess,
                };

                await dispatch(TeamModuleAccessUpdate({ payload })).unwrap();
            }

            setTeamAccessOpen(false);
            setTeamAccessTeams([]);
            setTeamAccessModules({});
        } catch (error) {
            console.error(error);
        } finally {
            setSavingTeamAccess(false);
        }
    };

    const openAccessModal = (record: UserRow) => {
        setAccessTargetUser(record);
        setAccessModules(record.moduleAccess || {});
        setAccessModalOpen(true);
    };

    const closeAccessModal = () => {
        setAccessModalOpen(false);
        setAccessTargetUser(null);
        setAccessModules({});
    };

    const handleUpdateUserAccess = async () => {
        if (!accessTargetUser) return;

        setSavingUserAccess(true);
        try {
            const nameParts = accessTargetUser.userName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ");

            const payload = {
                boomi_user_id: accessTargetUser.id,
                id: accessTargetUser.rawId || "",
                user_id: accessTargetUser.usermail,
                first_name: firstName,
                last_name: lastName,
                accountid: "",
                is_boomi_user: "false",
                type: accessTargetUser.role,
                ...buildModuleAccessFields(accessModules),
            };

            await dispatch(UserUpdate({ payload })).unwrap();

            dispatch(
                UsersGet({
                    Payload: {
                        search_by_filter: "All",
                        search,
                    },
                    pagnation: pagination,
                })
            );

            closeAccessModal();
        } catch (error) {
            // UserUpdate already shows the real backend message on failure.
            console.error(error);
        } finally {
            setSavingUserAccess(false);
        }
    };

    const handleAddUser = async (values: AddUserFormValues) => {
        setSaving(true);
        try {
            const payload = {
                boomi_user_id: "",
                id: "",
                user_id: values.email,
                last_name: values.lastName,
                first_name: values.firstName,
                accountid: "",
                is_boomi_user: "false",
                type: values.role,
                ...buildAccessControl(values),
            };

            await dispatch(
                userCreate({
                    payload,
                })
            ).unwrap();

            dispatch(
                UsersGet({
                    Payload: {
                        search_by_filter: "All",
                        search,
                    },
                    pagnation: pagination,
                })
            );

            closeAddUser();
        } catch (error) {
            // userCreate already shows the real backend message on failure.
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateUser = async (values: AddUserFormValues) => {
        setSaving(true);
        try {
            const payload = {
                boomi_user_id: selectedUser?.id,
                id: selectedUser?.rawId || "",
                user_id: values.email,
                first_name: values.firstName,
                last_name: values.lastName,
                accountid: "",
                is_boomi_user: "false",
                type: values.role,
                ...buildAccessControl(values),
            };

            await dispatch(
                UserUpdate({
                    payload,
                })
            ).unwrap();

            dispatch(
                UsersGet({
                    Payload: {
                        search_by_filter: "All",
                        search,
                    },
                    pagnation: pagination,
                })
            );

            closeAddUser();
        } catch (error) {
            // UserUpdate already shows the real backend message on failure.
            console.error(error);
        } finally {
            setSaving(false);
        }
    };
    const handleEdit = (record: UserRow) => {
        setIsEdit(true);
        setSelectedUser(record);
        setSelectedTeams([]);
        setTeamModulePermissions({});
        setAddUserOpen(true);
    };

    const columns: ColumnsType<UserRow> = [
        {
            title: "User ID",
            dataIndex: "id",
            width: 130,
            render: (value: string | number) => (
                <Text style={{ color: "#475569", fontWeight: 500 }}>{value}</Text>
            ),
        },
        {
            title: "User Name",
            dataIndex: "userName",
            render: (value: string) => (
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
                        <UserOutlined />
                    </div>

                    <Text strong style={{ color: "#111827" }}>
                        {value}
                    </Text>
                </Space>
            ),
        },
        {
            title: "User Mail",
            dataIndex: "usermail",
            render: (value: string) => (
                <Text style={{ color: "#475569" }}>{value}</Text>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (value: string) => (
                <Tag color="blue" style={{ borderRadius: 999, fontWeight: 500 }}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "active",
            width: 130,
            render: (active: boolean) => (
                <Tag
                    style={{
                        backgroundColor: active ? "#ecfdf5" : "#fef2f2",
                        color: active ? "#047857" : "#dc2626",
                        border: active ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        borderRadius: 999,
                        fontWeight: 600,
                        padding: "4px 12px",
                    }}
                >
                    {active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 170,
            align: "center",
            render: (_: any, record: UserRow) => (
                <Space size="middle">
                    <Tooltip
                        title={
                            record.isBoomiUser
                                ? "Boomi users cannot be edited"
                                : "Edit User"
                        }
                    >
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            disabled={record.isBoomiUser}
                            style={{
                                color: record.isBoomiUser ? "#bfbfbf" : "#1677ff",
                                fontSize: 18,
                            }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Update Access">
                        <Button
                            type="text"
                            icon={<KeyOutlined />}
                            style={{ color: "#1677ff", fontSize: 18 }}
                            onClick={() => openAccessModal(record)}
                        />
                    </Tooltip>


                </Space>
            ),
        }
    ];

    return (
        <div
            className="user-management-page"
            style={{
                minHeight: "100vh",
                padding: 24,
                background: "#f4f7fb",
            }}
        >
            <style>
                {`
          .user-management-page .ant-form-item-label > label {
            color: #020202c9 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .user-management-page .ant-input::placeholder,
          .user-management-page .ant-select-selection-placeholder {
            color: #020202c9 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          }

          .user-management-page .ant-input,
          .user-management-page .ant-select-selector {
            border-radius: 10px !important;
          }

          .user-management-page .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #334155 !important;
            font-weight: 500 !important;
          }

          .user-management-card {
            animation: fadeUp 0.4s ease both;
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(14px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .user-management-page {
              padding: 16px !important;
            }
          }
        `}
            </style>

            <Card
                className="user-management-card"
                variant="borderless"
                style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                }}
                styles={{ body: { padding: 24 } }}
            >
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} md={14}>
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
                                <UserAddOutlined />
                            </div>

                            <div>
                                <Title level={3} style={{ margin: 0, color: "#111827" }}>
                                    User Management
                                </Title>
                                <Text style={{ color: "#64748b" }}>
                                    Search, view, and add users.
                                </Text>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} md={10} style={{ textAlign: "right" }}>
                        <Space>
                            <Button
                                size="large"
                                onClick={() => setTeamAccessOpen(true)}
                                style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                }}
                            >
                                Team
                            </Button>

                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={openAddUser}
                                style={{
                                    borderRadius: 10,
                                    fontWeight: 600,
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
                                }}
                            >
                                Add User
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Row
                    justify="space-between"
                    align="middle"
                    gutter={[16, 16]}
                    style={{ marginTop: 24, marginBottom: 20 }}
                >
                    <Col xs={24} md={10} lg={8}>
                        <Input
                            placeholder="Search users..."
                            allowClear
                            size="small"
                            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>

                </Row>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={tableUsers}
                    scroll={{ x: 900, y: 500 }}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (keys) => setSelectedRowKeys(keys),
                    }}
                />

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <AppPagination
                        currentPage={pagination.page}
                        pageSize={pagination.limit}
                        totalRecords={Number(userspage?.[0]?.totalResults || 0)}
                        onChange={handlePagination}
                    />
                </div>
            </Card>

            <Modal
                title={isEdit ? "Update User" : "Add User"}
                open={addUserOpen}
                onCancel={closeAddUser}
                footer={null}
                destroyOnHidden
                width={640}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        if (isEdit) {
                            handleUpdateUser(values);
                        } else {
                            handleAddUser(values);
                        }
                    }}
                    initialValues={{
                        active: true,
                        firstName: selectedUser?.userName.split(" ")[0],
                        lastName: selectedUser?.userName.split(" ").slice(1).join(" "),
                        email: selectedUser?.usermail,
                        role: selectedUser?.role,
                        moduleAccess: selectedUser?.moduleAccess || {},
                        teamAccess: [],
                        atomAccess: [],
                    }}
                    style={{ marginTop: 18 }}
                >
                    <div
                        style={{
                            background: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            borderRadius: 14,
                            padding: 20,
                            marginBottom: 20,
                        }}
                    >
                        <SectionHeader
                            icon={<UserOutlined />}
                            title="Basic Information"
                            subtitle="Name, email, and role for this user."
                        />

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="firstName"
                                    label={
                                        <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                            First Name
                                        </span>
                                    }
                                    rules={[{ required: true, message: "Please enter first name" }]}
                                >
                                    <Input size="large" placeholder="Enter first name" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="lastName"
                                    label={
                                        <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                            Last Name
                                        </span>
                                    }
                                    rules={[{ required: true, message: "Please enter last name" }]}
                                >
                                    <Input size="large" placeholder="Enter last name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="email"
                            label={
                                <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                    Email
                                </span>
                            }
                            rules={[
                                { required: true, message: "Please enter user mail" },
                                { type: "email", message: "Please enter valid email" },
                            ]}
                        >
                            <Input size="large" placeholder="Enter user mail" />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label={
                                <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                    Role
                                </span>
                            }
                            rules={[{ required: true, message: "Please select a role" }]}
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                size="large"
                                showSearch
                                placeholder="Select role"
                                optionFilterProp="label"
                                options={roleOptions}
                            />
                        </Form.Item>
                    </div>

                    <div
                        style={{
                            background: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            borderRadius: 14,
                            padding: 20,
                            marginBottom: 20,
                        }}
                    >
                        <SectionHeader
                            icon={<SafetyOutlined />}
                            title="Access Control"
                            subtitle="Configure module, team, and Atom level permissions for this user."
                        />

                        {isEdit ? (
                            <>
                                <Form.Item
                                    name="teamAccess"
                                    label={
                                        <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                            Team Restriction
                                        </span>
                                    }
                                    extra={
                                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                            Leave empty to apply Module Access globally, across all teams. Pick one or more teams to restrict MDM / LongRun / Atom / Tickets access per team instead.
                                        </span>
                                    }
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        showSearch
                                        size="large"
                                        placeholder="Select teams to restrict access to"
                                        optionFilterProp="label"
                                        options={teamOptions}
                                        maxTagCount="responsive"
                                        onChange={handleTeamAccessChange}
                                    />
                                </Form.Item>

                                {selectedTeams.length > 0 && (
                                    <Form.Item
                                        label={
                                            <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                                Module Access per Team
                                            </span>
                                        }
                                        extra={
                                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                                Choose which modules this user can access within each team.
                                            </span>
                                        }
                                    >
                                        <Collapse defaultActiveKey={selectedTeams}>
                                            {selectedTeams.map((team) => (
                                                <Panel header={team} key={team}>
                                                    <ModuleAccessGrid
                                                        value={teamModulePermissions[team] || {}}
                                                        onChange={(permissions) =>
                                                            handleTeamModuleChange(team, permissions)
                                                        }
                                                    />
                                                </Panel>
                                            ))}
                                        </Collapse>
                                    </Form.Item>
                                )}
                            </>
                        ) : (
                            <Form.Item
                                label={
                                    <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                        Team Restriction
                                    </span>
                                }
                            >
                                <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                                    Not available while creating a user — add this user to a team from the Team tab first, then set their team restriction from Update User.
                                </Text>
                            </Form.Item>
                        )}

                        {!(isEdit && selectedTeams.length > 0) && (
                            <Form.Item
                                name="moduleAccess"
                                label={
                                    <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                        Module Access
                                    </span>
                                }
                                extra={
                                    <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                        Choose which modules this user can access, and whether they can read or write to each.
                                    </span>
                                }
                            >
                                <ModuleAccessGrid />
                            </Form.Item>
                        )}
                        {/* 
                    <Form.Item
                        name="atomAccess"
                        label={
                            <span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                                Atom Restriction
                            </span>
                        }
                        extra={
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>
                                Leave empty to allow all Atoms.
                            </span>
                        }
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            size="large"
                            placeholder="Select Atoms to restrict access to"
                            optionFilterProp="label"
                            options={atomOptions}
                            maxTagCount="responsive"
                        />
                    </Form.Item> */}
                    </div>

                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button onClick={closeAddUser}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                                icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                {isEdit ? "Update User" : "Add User"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="Team Access"
                open={teamAccessOpen}
                onCancel={() => {
                    setTeamAccessOpen(false);
                    setTeamAccessTeams([]);
                    setTeamAccessModules({});
                }}
                footer={null}
                destroyOnHidden
                width={480}
            >
                <div style={{ marginTop: 4 }}>
                    <SectionHeader
                        icon={<TeamOutlined />}
                        title="Assign Teams"
                        subtitle="Pick teams and set their module access."
                    />

                    <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                        Teams
                    </Text>

                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        size="large"
                        style={{ width: "100%", marginTop: 8 }}
                        placeholder="Select one or more teams"
                        optionFilterProp="label"
                        options={teamOptions}
                        value={teamAccessTeams}
                        onChange={setTeamAccessTeams}
                        maxTagCount="responsive"
                    />

                    <div style={{ marginTop: 20 }}>
                        <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                            Module Access
                        </Text>

                        <div style={{ marginTop: 8 }}>
                            <ModuleAccessGrid value={teamAccessModules} onChange={setTeamAccessModules} />
                        </div>
                    </div>

                    <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
                        <Col>
                            <Button
                                onClick={() => {
                                    setTeamAccessOpen(false);
                                    setTeamAccessTeams([]);
                                    setTeamAccessModules({});
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                disabled={teamAccessTeams.length === 0}
                                loading={savingTeamAccess}
                                onClick={handleUpdateTeamAccess}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                Update
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal>

            <Modal
                title={`Update Access — ${accessTargetUser?.userName || ""}`}
                open={accessModalOpen}
                onCancel={closeAccessModal}
                footer={null}
                destroyOnHidden
                width={480}
            >
                <div style={{ marginTop: 4 }}>
                    <SectionHeader
                        icon={<KeyOutlined />}
                        title="User Permissions"
                        subtitle="Set module level access for this user."
                    />

                    <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                        Module Access
                    </Text>

                    <div style={{ marginTop: 8 }}>
                        <ModuleAccessGrid value={accessModules} onChange={setAccessModules} />
                    </div>

                    {/*
                    <div style={{ marginTop: 20 }}>
                        <Text style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>
                            Atom Restriction
                        </Text>

                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            size="large"
                            style={{ width: "100%", marginTop: 8 }}
                            placeholder="Select Atoms to restrict access to"
                            optionFilterProp="label"
                            options={atomOptions}
                            value={accessAtoms}
                            onChange={setAccessAtoms}
                            maxTagCount="responsive"
                        />
                    </div>
                    */}

                    <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
                        <Col>
                            <Button onClick={closeAccessModal}>Cancel</Button>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                loading={savingUserAccess}
                                onClick={handleUpdateUserAccess}
                                style={{
                                    background: "#2563eb",
                                    borderColor: "#2563eb",
                                    fontWeight: 600,
                                }}
                            >
                                Update
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;