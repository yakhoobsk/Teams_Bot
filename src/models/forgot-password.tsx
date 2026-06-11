import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, Space } from "antd";
import * as Yup from "yup";
import { showSnackbar } from "../utils/snackbar";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
    open: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const schema = Yup.object().shape({
        email: Yup.string()
            .email("Enter valid email")
            .required("Email is required"),

        password: Yup.string()
            .min(8, "Minimum 8 characters")
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match")
            .required("Confirm your password"),
    });

    // ✅ Verify Email
    const handleVerifyEmail = async () => {
        try {
            const values = form.getFieldsValue();
            await schema.validateAt("email", values);
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                setIsEmailVerified(true);
                showSnackbar("success", "Email verified successfully");
            }, 1000);
        } catch (error: any) {
            form.setFields([{ name: "email", errors: [error.message] }]);
        }
    };

    // ✅ Submit Password Reset
    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();
            await schema.validate(values, { abortEarly: false });
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                showSnackbar("success", "Password reset successfully");
                onClose();
                form.resetFields();
                setIsEmailVerified(false);
            }, 1000);
        } catch (error: any) {
            const errors = error.inner.map((err: any) => ({
                name: err.path,
                errors: [err.message],
            }));
            form.setFields(errors);
        }
    };

    // ✅ Common Styles
    const inputStyle = {
        borderRadius: 8,
        height: 44,
        background: "#fdfdfd",
        border: "1px solid #e8e8e8"
    };

    return (
        <Modal
            open={open}
            onCancel={() => {
                onClose();
                form.resetFields();
                setIsEmailVerified(false);
            }}
            footer={null}
            centered
            width={440}
            styles={{
                body: {
                    borderRadius: 16,
                    padding: 0,
                    overflow: "hidden"
                }
            }}
            closeIcon={true}
        >
            <div style={{ padding: "32px 20px" }}>
                {/* Branding Badge */}
                <Space style={{ marginBottom: 24 }}>
                    <div style={{
                        background: "#167c8a",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 700
                    }}>
                        O2C
                    </div>
                    <Text style={{ color: "#167c8a", fontWeight: 600, fontSize: 13 }}>Reset Password</Text>
                </Space>

                <div style={{ marginBottom: 30 }}>
                    <Title level={3} style={{ margin: 0, color: "#262626", fontWeight: 600 }}>
                        Forgot Password
                    </Title>
                    <Text style={{ color: "#8c8c8c", fontSize: 14 }}>
                        Follow the steps below to reset your password.
                    </Text>
                </div>

                <Form layout="vertical" form={form} requiredMark={false}>
                    {/* Email */}
                    <Form.Item
                        name="email"
                        label={<Text style={{ fontSize: 13, color: "#595959" }}>Email Address</Text>}
                        style={{ marginBottom: 20 }}
                    >
                        <Input
                            placeholder="Enter your registered email"
                            disabled={isEmailVerified}
                            style={inputStyle}
                        />
                    </Form.Item>

                    {/* Verify Button */}
                    {!isEmailVerified && (
                        <Button
                            type="primary"
                            block
                            onClick={handleVerifyEmail}
                            loading={loading}
                            style={{
                                background: "#167c8a",
                                borderColor: "#167c8a",
                                height: 46,
                                borderRadius: 8,
                                fontWeight: 600,
                                marginBottom: 10
                            }}
                        >
                            VERIFY EMAIL
                        </Button>
                    )}

                    {isEmailVerified && (
                        <>
                            {/* New Password */}
                            <Form.Item
                                name="password"
                                label={<Text style={{ fontSize: 13, color: "#595959" }}>New Password</Text>}
                                style={{ marginBottom: 20 }}
                            >
                                <Input.Password
                                    placeholder="Enter new password"
                                    style={inputStyle}
                                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                />
                            </Form.Item>

                            {/* Confirm Password */}
                            <Form.Item
                                name="confirmPassword"
                                label={<Text style={{ fontSize: 13, color: "#595959" }}>Confirm New Password</Text>}
                                style={{ marginBottom: 24 }}
                            >
                                <Input.Password
                                    placeholder="Confirm new password"
                                    style={inputStyle}
                                    iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                />
                            </Form.Item>

                            {/* Submit Button */}
                            <Button
                                type="primary"
                                block
                                loading={loading}
                                onClick={handleSubmit}
                                style={{
                                    background: "#167c8a",
                                    borderColor: "#167c8a",
                                    height: 46,
                                    borderRadius: 8,
                                    fontWeight: 600
                                }}
                            >
                                RESET PASSWORD
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;