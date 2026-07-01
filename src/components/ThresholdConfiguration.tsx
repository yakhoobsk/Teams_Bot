import React, { useState } from "react";
import {
    Form,
    Select,
    Button,
    Space,

    Row,
    Col,
    Divider,
    Modal,
    message,
    DatePicker,
    InputNumber,
    Checkbox,
} from "antd";
import {
    PlusOutlined,

} from "@ant-design/icons";

const { Option } = Select;

interface Threshold {
    id: number;
    thresholdName: string;
    thresholdType: string;
    users: string[];
    frequency: string;
    active: boolean;
}

interface ThresholdConfigurationProps {
    open: boolean;
    onClose: () => void;
}

const userOptions = [
    "John Smith",
    "Robert",
    "David",
    "Michael",
    "Emma",
    "Sophia",
    "Olivia",
    "William",
];



const ThresholdConfiguration: React.FC<ThresholdConfigurationProps> = ({
    open,
    onClose,
}) => {
    const [form] = Form.useForm();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [scheduleType, setScheduleType] = useState("Weekly");
    const [data, setData] = useState<Threshold[]>([
        {
            id: 1,
            thresholdName: "Critical API Errors",
            thresholdType: "API Failure",
            users: ["John Smith", "David"],
            frequency: "Weekly",
            active: true,
        },
    ]);
    console.log(data)

    const closeModal = () => {
        form.resetFields();
        setEditingId(null);
        onClose();
    };

    const onFinish = (values: any) => {
        if (editingId !== null) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? {
                            ...item,
                            ...values,
                        }
                        : item
                )
            );

            message.success("Threshold Updated");
        } else {
            setData((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...values,
                },
            ]);

            message.success("Threshold Created");
        }

        closeModal();
    };




    return (



        <Modal
            title={editingId ? "Edit Threshold" : "Create Threshold"}
            open={open}
            onCancel={closeModal}
            footer={null}
            destroyOnClose
            width={640}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 16 }}
            >
                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            name="users"
                            label={
                                <span
                                    style={{
                                        color: "black",
                                        fontWeight: 400,
                                        fontSize: 14,
                                    }}
                                >
                                    Notify Users
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select Users"
                                allowClear
                            >
                                {userOptions.map((user) => (
                                    <Option
                                        key={user}
                                        value={user}
                                    >
                                        {user}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="scheduleType"
                            label={
                                <span
                                    style={{
                                        color: "black",
                                        fontWeight: 400,
                                        fontSize: 14,
                                    }}
                                >
                                    Schedule Type
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select onChange={setScheduleType}>
                                <Select.Option value="Daily">Daily</Select.Option>
                                <Select.Option value="Weekly">Weekly</Select.Option>
                                <Select.Option value="Monthly">Monthly</Select.Option>
                                <Select.Option value="Quarterly">Quarterly</Select.Option>
                                <Select.Option value="HalfYearly">Half Yearly</Select.Option>
                                <Select.Option value="Annually">Annually</Select.Option>
                                <Select.Option value="Custom">Custom</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {scheduleType === "Daily" && (
                        <InputNumber min={1} addonAfter="Days" />
                    )}

                    {scheduleType === "Weekly" && (
                        <>
                            <InputNumber min={1} addonAfter="Weeks" />

                            <Checkbox.Group
                                options={[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                ]}
                            />
                        </>
                    )}

                    {scheduleType === "Monthly" && (
                        <DatePicker picker="date" />
                    )}

                    {scheduleType === "Annually" && (
                        <DatePicker picker="date" format="DD MMMM" />
                    )}

                    {scheduleType === "Custom" && (
                        <DatePicker
                            multiple
                            format="DD-MM-YYYY"
                        />
                    )}




                </Row>

                <Divider style={{ margin: "8px 0 16px" }} />

                <Row justify="end">
                    <Space>
                        <Button onClick={closeModal}>Cancel</Button>

                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<PlusOutlined />}
                        >
                            {editingId ? "Update Threshold" : "Create Threshold"}
                        </Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default ThresholdConfiguration;