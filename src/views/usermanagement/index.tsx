import { useEffect, useState } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Tag,
    Typography,
    Input,
} from "antd";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { UsersGet } from "../../redux/Services/connectersServices";
import AppPagination from "../../components/AppPagination";

const { Title } = Typography;

const UserManagement = () => {

    const dispatch = useAppDispatch()
    const userspage = useAppSelector((state) => state.connecters?.usersget);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, });
    const [search, setSearch] = useState("");

    useEffect(() => {
        const payload = {

            search_by_filter: "All",
            search: search

        }
        dispatch(UsersGet({ Payload: payload, pagnation: pagination, }));

    }, [dispatch, pagination, search]);

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


    const users = (userspage?.[0]?.results || []).map((item: any) => ({
        id: item.boomi_user_id,
        userName: `${item.first_name} ${item.last_name}`,
        usermail: item.user_id,
        role: item.type,
        active: item.is_boomi_user === "true",
    }));




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
            dataIndex: "active",
            width: 120,
            render: (active: boolean) => (
                <Tag
                    style={{
                        backgroundColor: active ? "#E8F5E9" : "#FDECEA",
                        color: active ? "#2E7D32" : "#D32F2F",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "4px 10px",
                    }}
                >
                    {active ? "Active" : "Inactive"}
                </Tag>
            ),
        }

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

                </Row>
                <Row
                    justify="space-between"
                    align="middle"
                    style={{ marginTop: 20, marginBottom: 20 }}
                >
                    <Col xs={24} md={8}>
                        <Input
                            placeholder="Search users..."
                            allowClear
                            size="small"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 24 }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={users}
                        scroll={{ x: 900 }}
                        pagination={false}
                    />

                    <div
                        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
                    >
                        <AppPagination
                            currentPage={pagination.page}
                            pageSize={pagination.limit}
                            totalRecords={Number(userspage?.[0]?.totalResults || 0)}
                            onChange={handlePagination}
                        />
                    </div>
                </div>
            </Card >



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