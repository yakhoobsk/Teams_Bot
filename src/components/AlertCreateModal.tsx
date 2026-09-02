import React, { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    Checkbox,
    Row,
    Col,
    Button,
    Segmented,
    Divider,
} from "antd";
import { UserswithoutpagnationGet, GroupsGet } from "../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { parseGroupMembers } from "../utils/groupMembers";

export type RecipientType = "individual" | "team";

interface Props {
    open: boolean;
    loading?: boolean;
    onCancel: () => void;
    onSubmit: (recipientType: RecipientType, values: any) => void;
}

const AlertCreateModal: React.FC<Props> = ({
    open,
    loading,
    onCancel,
    onSubmit,
}) => {
    const [form] = Form.useForm();
    const recipientType: RecipientType = Form.useWatch("recipientType", form) || "individual";
    const scheduleType = Form.useWatch("schedule_type", form);
    const selectedType = Form.useWatch("type", form);
    const userspage = useAppSelector((state) => state.connecters?.Userswithoutpagnation);
    const groupResponse = useAppSelector((state) => state.connecters.GroupsGets);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(UserswithoutpagnationGet({}));
        dispatch(GroupsGet({}));
    }, [dispatch]);

    const handleFinish = (values: any) => {
        if (values.recipientType === "team") {
            const selectedGroup = groupResponse?.Response?.find(
                (group: any) => group.group_name === values.team
            );

            onSubmit("team", {
                ...values,
                team_name: values.team,
                members: parseGroupMembers(selectedGroup?.members),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        } else {
            onSubmit("individual", {
                ...values,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }

        form.resetFields();
    };

    return (
        <Modal
            open={open}
            title="Create Alert"
            width={750}
            footer={null}
            destroyOnHidden
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    recipientType: "individual",
                    type: "Datahub",
                    schedule_type: "Daily",
                    atom: false,
                    longrun: false,
                    mdm: false,
                    tickets: false,
                }}
            >
                <Form.Item
                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Alert For</span>}
                    name="recipientType"
                >
                    <Segmented
                        options={[
                            { label: "Individual", value: "individual" },
                            { label: "Team", value: "team" },
                        ]}
                    />
                </Form.Item>

                <Divider titlePlacement="left" style={{ margin: "0 0 20px" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                        {recipientType === "team" ? "Team & Schedule" : "User & Schedule"}
                    </span>
                </Divider>

                <Row gutter={16}>
                    {recipientType === "individual" ? (
                        <>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Username</span>}
                                    name="username"
                                    rules={[{ required: true, message: "Please enter username" }]}
                                >
                                    <Input placeholder="Enter Username" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>User Mail</span>}
                                    name="usermail"
                                    rules={[
                                        { required: true, message: "Please select a user" },
                                        { type: "email", message: "Invalid Email" },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select user"
                                        optionFilterProp="label"
                                        options={userspage?.map((user: any) => ({
                                            label: `${user.first_name} ${user.last_name} (${user.user_id})`,
                                            value: user.user_id,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Team</span>}
                                name="team"
                                rules={[{ required: true, message: "Please select a team" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select team"
                                    optionFilterProp="label"
                                    options={groupResponse?.Response?.map((group: any) => ({
                                        label: group.group_name,
                                        value: group.group_name,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={12}>
                        <Form.Item
                            label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Type</span>}
                            name="type"
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={[
                                    { label: "Datahub", value: "Datahub" },
                                    { label: "Integration", value: "Integration" },

                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Schedule Type</span>}
                            name="schedule_type"
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={[
                                    { label: "Daily", value: "Daily" },
                                    { label: "Weekly", value: "Weekly" },
                                    { label: "Monthly", value: "Monthly" },
                                    { label: "Custom", value: "Custom" },
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    {/* Daily */}
                    {scheduleType === "Daily" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Time</span>}
                                    required
                                >
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="hour"
                                                noStyle={false}
                                                rules={[{ required: true, message: "Hour is required" }]}
                                            >
                                                <InputNumber
                                                    placeholder="Hour"
                                                    min={0}
                                                    max={23}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                name="minute"
                                                noStyle={false}
                                                rules={[{ required: true, message: "Minute is required" }]}
                                            >
                                                <InputNumber
                                                    placeholder="Minute"
                                                    min={0}
                                                    max={59}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* Weekly */}
                    {scheduleType === "Weekly" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Week Day</span>}
                                    name="week"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        options={[
                                            { label: "Sunday", value: "Sunday" },
                                            { label: "Monday", value: "Monday" },
                                            { label: "Tuesday", value: "Tuesday" },
                                            { label: "Wednesday", value: "Wednesday" },
                                            { label: "Thursday", value: "Thursday" },
                                            { label: "Friday", value: "Friday" },
                                            { label: "Saturday", value: "Saturday" },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Time">
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="hour"
                                                noStyle={false}
                                                rules={[{ required: true }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={23}
                                                    style={{ width: "100%" }}
                                                    placeholder="Hour"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                name="minute"
                                                noStyle={false}
                                                rules={[{ required: true }]}
                                            >
                                                <InputNumber
                                                    min={0}
                                                    max={59}
                                                    style={{ width: "100%" }}
                                                    placeholder="Minute"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* Monthly */}
                    {scheduleType === "Monthly" && (
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label={<span style={{ color: "#000000a5", fontSize: 14, fontWeight: 500 }}>Day</span>}
                                    name="day"
                                    rules={[{ required: true }]}
                                >
                                    <InputNumber
                                        min={1}
                                        max={31}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Hour" name="hour" rules={[{ required: true }]}>
                                    <InputNumber
                                        min={0}
                                        max={23}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Minute" name="minute" rules={[{ required: true }]}>
                                    <InputNumber
                                        min={0}
                                        max={59}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* Custom */}
                    {scheduleType === "Custom" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Hour" name="hour" rules={[{ required: true }]}>
                                    <InputNumber
                                        min={0}
                                        max={23}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Minute" name="minute" rules={[{ required: true }]}>
                                    <InputNumber
                                        min={0}
                                        max={59}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    <Col span={24}>
                        <Divider titlePlacement="left" style={{ margin: "4px 0 20px" }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                                Alerts
                            </span>
                        </Divider>
                    </Col>

                    <Col span={24}>
                        <Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col span={6}>
                                    <Form.Item
                                        name="atom"
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Checkbox>Atom</Checkbox>
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="longrun"
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Checkbox disabled={selectedType === "Datahub"}>
                                            Long Run</Checkbox>
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="mdm"
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Checkbox disabled={selectedType === "Integration"}>
                                            MDM</Checkbox>
                                    </Form.Item>
                                </Col>

                                <Col span={6}>
                                    <Form.Item
                                        name="tickets"
                                        valuePropName="checked"
                                        noStyle
                                    >
                                        <Checkbox>Tickets</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Col>
                </Row>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 20,
                    }}
                >
                    <Button onClick={onCancel}>Cancel</Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AlertCreateModal;
