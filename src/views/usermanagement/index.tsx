import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Checkbox,
    Space,
    Card,
    Row,
    Col,
    Tag,
    Typography,
} from "antd";
import {
    UserAddOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

interface Role {
    id: number;
    roleName: string;
    modules: string[];
}

interface User {
    id: string;
    userName: string;
    usermail: any,
    role: string;
    active: boolean;
}

const modulesList = [
    "Api Services",
    "MDH",
    "Audit Logs",
];

const UserManagement = () => {
    const [createUserOpen, setCreateUserOpen] = useState(false);
    const [createRoleOpen, setCreateRoleOpen] = useState(false);
    const [roleSearch, setRoleSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [userSearch, setUserSearch] = useState("");
    const [roles, setRoles] = useState<Role[]>([
        {
            id: 1,
            roleName: "Admin",
            modules: ["Dashboard", "Users", "Reports"],
        },
        {
            id: 2,
            roleName: "Manager",
            modules: ["Dashboard", "Orders"],
        },
    ]);

    const [users, setUsers] = useState<User[]>([
        {
            id: "USR001",
            userName: "John Doe",
            usermail: "yakhoob@easystepin.com",
            role: "Admin",
            active: true,
        },
        {
            id: "USR002",
            userName: "Sarah",
            usermail: "yakhoob@easystepin.com",
            role: "Manager",
            active: false,
        },
    ]);
    const filteredUsers = users.filter(
        (user) =>
            user.userName
                .toLowerCase()
                .includes(userSearch.toLowerCase()) ||
            user.role
                .toLowerCase()
                .includes(userSearch.toLowerCase()) ||
            user.usermail
                .toLowerCase()
                .includes(userSearch.toLowerCase())
    );
    const [userForm] = Form.useForm();
    const [roleForm] = Form.useForm();
    const filteredRoles = roles.filter((role) =>
        role.roleName
            .toLowerCase()
            .includes(roleSearch.toLowerCase())
    );

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const handleUserSubmit = (values: any) => {
        if (selectedUser) {
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === selectedUser.id
                        ? {
                            ...item,
                            userName: `${values.firstName} ${values.lastName}`,
                            usermail: values.email,
                            role: values.role,
                            active: values.active,
                        }
                        : item
                )
            );
        } else {
            setUsers((prev) => [
                ...prev,
                {
                    id: `USR${String(prev.length + 1).padStart(3, "0")}`,
                    userName: `${values.firstName} ${values.lastName}`,
                    usermail: values.email,
                    role: values.role,
                    active: values.active,
                },
            ]);
        }

        setCreateUserOpen(false);
        setSelectedUser(null);
        userForm.resetFields();
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);

        userForm.setFieldsValue({
            firstName: user.userName.split(" ")[0],
            lastName: user.userName.split(" ")[1] || "",
            email: user.usermail,
            role: user.role,
            active: user.active,
        });

        setCreateUserOpen(true);
    };


    const columns = [
        {
            title: "User ID",
            dataIndex: "id",
            width: 120,
        },
        {
            title: "User Name",
            dataIndex: "userName",
        },
        {
            title: "User Mail",
            dataIndex: "usermail",
        },
        {
            title: "Role",
            dataIndex: "role",
            render: (value: string) => (
                <Tag color="blue">{value}</Tag>
            ),
        },
        {
            title: "Status",
            render: (_: any, record: User) => (
                <Switch
                    checked={record.active}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    onChange={(checked) => {
                        setUsers((prev) =>
                            prev.map((item) =>
                                item.id === record.id
                                    ? { ...item, active: checked }
                                    : item
                            )
                        );
                    }}
                />
            ),
        },

    ];

    return (
        <>
            <Card style={{
                borderRadius: 20,

            }}
            >
                <Row
                    justify="space-between"
                    align="middle"
                    gutter={[16, 16]}
                >
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            User Management
                        </Title>
                    </Col>

                    <Col>
                        <Space wrap>
                            <Button
                                size="large"
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={() => setCreateUserOpen(true)}
                            >
                                Custom User mangemnt +
                            </Button>

                            <Button
                                size="large"
                                type="primary"

                                icon={<SafetyCertificateOutlined />}
                                onClick={() => setCreateRoleOpen(true)}
                            >
                                Role Management +
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <div style={{ marginTop: 24 }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={users}
                        scroll={{ x: 900 }}
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                </div>
            </Card >

            {/* Create User */}

            <Modal
                open={createUserOpen}
                width={700}
                centered
                footer={null}
                destroyOnClose
                title={
                    selectedUser
                        ? "Edit User"
                        : "Create User"
                }
                onCancel={() => {
                    setCreateUserOpen(false);
                    setSelectedUser(null);
                    userForm.resetFields();
                }}
            >
                <Form
                    form={userForm}
                    layout="vertical"
                    onFinish={handleUserSubmit}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter first name",
                                    },
                                ]}

                            >
                                <Input
                                    size="large"
                                    placeholder="Enter First Name"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter last name",
                                    },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Enter Last Name"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            {
                                required: true,
                                type: "email",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            showSearch
                            placeholder="Select Role"
                        >
                            {roles.map((role) => (
                                <Option
                                    key={role.id}
                                    value={role.roleName}
                                >
                                    {role.roleName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row
                        justify="space-between"
                        align="middle"
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <Col>
                            <Form.Item
                                label="Status"
                                name="active"
                                valuePropName="checked"
                                initialValue={true}
                                style={{ marginBottom: 0 }}
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />
                            </Form.Item>
                        </Col>

                        <Col>
                            <Space>
                                <Button
                                    onClick={() => {
                                        setCreateUserOpen(false);
                                        setSelectedUser(null);
                                        userForm.resetFields();
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {selectedUser
                                        ? "Update User"
                                        : "Create User"}
                                </Button>
                            </Space>
                        </Col>
                    </Row>


                </Form>

                {/* Existing Users Section */}

                <div
                    style={{
                        marginTop: 24,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 20,
                    }}
                >
                    <Input
                        placeholder="Search User"
                        allowClear
                        value={userSearch}
                        onChange={(e) =>
                            setUserSearch(e.target.value)
                        }
                        size="large"
                        style={{
                            marginBottom: 16,
                            borderRadius: 8,
                        }}
                    />

                    <div
                        style={{
                            border: "1px solid #f0f0f0",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#fff",
                        }}
                    >
                        <Table
                            rowKey="id"
                            size="middle"
                            pagination={false}
                            sticky
                            scroll={{
                                x: 800,
                                y: 250,
                            }}
                            dataSource={filteredUsers}
                            columns={[
                                {
                                    title: "User ID",
                                    dataIndex: "id",
                                    width: 120,
                                },
                                {
                                    title: "User Name",
                                    dataIndex: "userName",
                                    width: 180,
                                },
                                {
                                    title: "Email",
                                    dataIndex: "usermail",
                                    width: 250,
                                    ellipsis: true,
                                },
                                {
                                    title: "Role",
                                    dataIndex: "role",
                                    width: 150,
                                },
                                {
                                    title: "Status",
                                    width: 120,
                                    render: (_, record) => (
                                        <Switch
                                            checked={record.active}
                                        />
                                    ),
                                },
                                {
                                    title: "Action",
                                    width: 120,
                                    fixed: "right",
                                    render: (_, record) => (
                                        <Button
                                            type="link"
                                            onClick={() =>
                                                handleEditUser(record)
                                            }
                                        >
                                            Edit
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            </Modal >
            {/* Create Role */}

            <Modal
                open={createRoleOpen}
                title="Role Management"
                footer={null}
                centered
                width={800}
                onCancel={() => {
                    setCreateRoleOpen(false);
                    roleForm.resetFields();
                    setSelectedRole(null);
                }}
            >
                <Form
                    layout="vertical"
                    form={roleForm}
                    onFinish={(values) => {
                        if (selectedRole) {
                            // Update Role
                            setRoles((prev) =>
                                prev.map((item) =>
                                    item.id === selectedRole.id
                                        ? {
                                            ...item,
                                            roleName: values.roleName,
                                            modules: values.modules,
                                        }
                                        : item
                                )
                            );
                        } else {
                            // Create Role
                            setRoles((prev) => [
                                ...prev,
                                {
                                    id: Date.now(),
                                    roleName: values.roleName,
                                    modules: values.modules,
                                },
                            ]);
                        }

                        roleForm.resetFields();
                        setSelectedRole(null);
                    }}
                >
                    <Form.Item
                        label="Role Name"
                        name="roleName"
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder="Enter Role Name"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Modules"
                        name="modules"
                        rules={[{ required: true }]}
                    >
                        <Checkbox.Group style={{ width: "100%" }}>
                            <Row gutter={[8, 8]}>
                                {modulesList.map((module) => (
                                    <Col span={12} key={module}>
                                        <Checkbox value={module}>
                                            {module}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>

                    <Button
                        block
                        htmlType="submit"
                        type="primary"
                        size="large"
                    >
                        {selectedRole ? "Update Role" : "Create Role"}
                    </Button>
                </Form>

                <div
                    style={{
                        marginTop: 30,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 20,
                    }}
                >
                    <Input
                        placeholder="Search Role..."
                        allowClear
                        style={{
                            marginBottom: 16,
                        }}
                        onChange={(e) =>
                            setRoleSearch(e.target.value)
                        }
                    />

                    <Table
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ y: 220 }}
                        dataSource={filteredRoles}
                        columns={[
                            {
                                title: "Role Name",
                                dataIndex: "roleName",
                            },
                            {
                                title: "Access",
                                render: (_, record) =>
                                    record.modules.join(", "),
                            },
                            {
                                title: "Action",
                                render: (_, record) => (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            setSelectedRole(record);

                                            roleForm.setFieldsValue({
                                                roleName:
                                                    record.roleName,
                                                modules:
                                                    record.modules,
                                            });
                                        }}
                                    >
                                        Edit
                                    </Button>
                                ),
                            },
                        ]}
                    />
                </div>
            </Modal >

            <>
                <style>
                    {`
      .ant-form-item-label > label {
        color: #000 !important;
        font-size: 14px;
        font-weight: 500;
      }

      .ant-modal-title {
        color: #000 !important;
        font-size: 18px;
        font-weight: 500;
      }
    `}
                </style>


            </>
        </>

    );
};

export default UserManagement;