import React, { useEffect, useState } from "react";
import {
    Modal, Form, Input, Checkbox, Select, Row, Col, DatePicker, TimePicker,
    Radio,
    Space,
    Collapse
} from "antd";
import type { FormInstance } from "antd/es/form";

import dayjs from "dayjs";
import "./channelspage.css";
import { ChannelsCreate, ChannelsUser, GroupsGet, UserswithoutpagnationGet } from "../redux/Services/connectersServices";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
const { Option } = Select;

const alertsOptions = ["MDM", "LongRun", "Atom", "Tickets"];

interface ChannelModalProps {
    open: boolean;
    form: FormInstance;
    onCancel: () => void;
}

const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const monthWeeks = [
    "First Week",
    "Second Week",
    "Third Week",
    "Fourth Week",
    "Last Week",
];

const ChannelsPage: React.FC<ChannelModalProps> = ({ open, form, onCancel, }) => {
    const selectedSchedule = Form.useWatch("scheduleType", form);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [roles, setRoles] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();
    const userspage = useAppSelector((state) => state.connecters?.Userswithoutpagnation);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<
        Record<string, string[]>
    >({});
    const groupResponse = useAppSelector((state) => state.connecters.GroupsGets);


    const parseMembers = (members: any): string[] => {
        if (!members) return [];

        try {
            let parsed = JSON.parse(members);


            while (typeof parsed === "string") {
                parsed = JSON.parse(parsed);
            }

            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [];
        }
    };

    useEffect(() => {
        dispatch(UserswithoutpagnationGet({}));
        dispatch(GroupsGet({}));
    }, [dispatch]);


    const convertToUTC = (time: any) => {
        const utcTime = dayjs(time)
            .tz("Asia/Kolkata")
            .utc();

        return {
            hours: utcTime.format("H"),
            minutes: utcTime.format("m"),
        };
    };

    const buildSchedule = (values: any) => {
        switch (values.scheduleType) {
            case "Daily": {
                const utc = convertToUTC(values.dailyTime);

                return {
                    years: "",
                    months: "",
                    daysOfMonth: "",
                    daysOfWeek: "",
                    hours: utc.hours,
                    minutes: utc.minutes,
                };
            }

            case "Weekly": {
                const utc = convertToUTC(values.weeklyTime);

                return {
                    years: "",
                    months: "",
                    daysOfMonth: "",
                    daysOfWeek: weekDays.indexOf(values.weeklyDay).toString(),
                    hours: utc.hours,
                    minutes: utc.minutes,
                };
            }

            case "Monthly": {
                const utc = convertToUTC(values.monthlyTime);

                return {
                    years: "",
                    months: "",
                    daysOfMonth: (
                        monthWeeks.indexOf(values.monthlyWeek) + 1
                    ).toString(),
                    daysOfWeek: weekDays.indexOf(values.monthlyDay).toString(),
                    hours: utc.hours,
                    minutes: utc.minutes,
                };
            }

            case "Custom": {
                const utc = convertToUTC(values.customTime);

                return {
                    years: "",
                    months: "",
                    dates: values.customDates || [],
                    hours: utc.hours,
                    minutes: utc.minutes,
                };
            }

            default:
                return {};
        }
    };





    const groupsPayload = selectedGroups.map((groupName) => ({
        groupname: groupName,
        members: (selectedMembers[groupName] || []).map((member) => ({
            userId: member,
            role: roles[member] || "member",
        })),
    }));
    const handleSubmit = (values: any) => {

        const groupMembers = Object.entries(selectedMembers).flatMap(
            ([, members]) =>
                (members as string[]).map((member) => ({
                    userId: member,
                    role: roles[member] || "member",
                }))
        );

        const individualMembers = selectedUsers.map((userId) => ({
            userId,
            role: roles[userId] || "member",
        }));

        const teamMembers = [...individualMembers, ...groupMembers];


        const payload = {
            teamDisplayName: values.teamDisplayName,
            teamDescription: values.teamDescription,

            teamMembers,

            groups: groupsPayload,

            type: values.Type?.toLowerCase(),

            channelDisplayName: values.channelDisplayName,
            channelDescription: values.channelDescription,

            membershipType: values.security?.toLowerCase(),

            channelAlert: values.overallChannelAlerts || [],

            channelMembers: teamMembers,

            Schedule: buildSchedule(values),
        };
        dispatch(ChannelsCreate({ payload })).unwrap()
        dispatch(ChannelsUser({}));

    };

    return (
        <Modal className="channel-modal" title="Channel Creation"
            open={open}
            width={950}
            okText="Save"
            onCancel={onCancel}
            onOk={() => form.validateFields().then(handleSubmit)}>
            <Form form={form} layout="vertical">
                <div className="section">
                    <h3>Team Details</h3>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="teamDisplayName" label="Team Display Name" rules={[{ required: true }]}>
                                <Input placeholder="Enter team name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="teamDescription" label="Team Description">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="individualUsers" label="Users">
                                <Select
                                    mode="multiple"
                                    value={selectedUsers}
                                    placeholder="Select Users"
                                    maxTagCount="responsive"
                                    options={userspage?.map((user: any) => ({
                                        label: `${user.first_name} ${user.last_name}`,
                                        value: user.user_id,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedUsers(value);
                                        form.setFieldsValue({
                                            individualUsers: value,
                                        });
                                    }}
                                    dropdownRender={() => (
                                        <div style={{ padding: 8, maxHeight: 300, overflow: "auto" }}>
                                            {userspage?.map((user: any) => (
                                                <div
                                                    key={user.user_id}
                                                    style={{
                                                        marginBottom: 12,
                                                        borderBottom: "1px solid #f0f0f0",
                                                        paddingBottom: 8,
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.user_id)}
                                                        onChange={(e) => {
                                                            const updatedUsers = e.target.checked
                                                                ? [...selectedUsers, user.user_id]
                                                                : selectedUsers.filter(
                                                                    (id) => id !== user.user_id
                                                                );

                                                            setSelectedUsers(updatedUsers);

                                                            form.setFieldsValue({
                                                                individualUsers: updatedUsers,
                                                            });
                                                        }}
                                                    >
                                                        {user.first_name} {user.last_name}
                                                    </Checkbox>

                                                    {selectedUsers.includes(user.user_id) && (
                                                        <Radio.Group
                                                            style={{ marginLeft: 24, marginTop: 8 }}
                                                            value={roles[user.user_id] || "member"}
                                                            onChange={(e) =>
                                                                setRoles((prev) => ({
                                                                    ...prev,
                                                                    [user.user_id]: e.target.value,
                                                                }))
                                                            }
                                                        >
                                                            <Space direction="vertical">
                                                                <Radio value="owner">Owner</Radio>
                                                                <Radio value="member">Member</Radio>
                                                            </Space>
                                                        </Radio.Group>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="groupUsers" label="groups">
                                <Select
                                    style={{ width: "100%" }}
                                    dropdownStyle={{
                                        width: 410,
                                    }}
                                    mode="multiple"
                                    value={selectedGroups}
                                    placeholder="Select Groups"
                                    maxTagCount="responsive"
                                    options={(groupResponse?.Response || []).map((group: any) => ({
                                        label: group.group_name,
                                        value: group.group_name,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedGroups(value);
                                        form.setFieldsValue({
                                            groupUsers: value,
                                        });
                                    }}
                                    tagRender={(props) => (
                                        <span
                                            style={{
                                                background: "#e6f4ff",
                                                padding: "2px 8px",
                                                borderRadius: 6,
                                                marginRight: 4,
                                            }}
                                        >
                                            {props.label}
                                        </span>
                                    )}
                                    dropdownRender={() => (
                                        <div style={{ padding: 10, maxHeight: 350, overflow: "auto" }}>
                                            <Collapse ghost>
                                                {(groupResponse?.Response || []).map((group: any) => {
                                                    const members = parseMembers(group.members);

                                                    return (
                                                        <Collapse.Panel
                                                            key={group.group_id}
                                                            header={
                                                                <Checkbox
                                                                    checked={selectedGroups.includes(group.group_name)}
                                                                    onChange={(e) => {
                                                                        const updatedGroups = e.target.checked
                                                                            ? [...selectedGroups, group.group_name]
                                                                            : selectedGroups.filter(
                                                                                (g) => g !== group.group_name
                                                                            );

                                                                        setSelectedGroups(updatedGroups);

                                                                        form.setFieldsValue({
                                                                            groupUsers: updatedGroups,
                                                                        });
                                                                    }}
                                                                >
                                                                    {group.group_name}
                                                                </Checkbox>
                                                            }
                                                        >
                                                            {members.map((member: string) => (
                                                                <div
                                                                    key={member}
                                                                    style={{
                                                                        marginBottom: 12,
                                                                        paddingLeft: 20,
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        checked={
                                                                            selectedMembers[group.group_name]?.includes(member) ||
                                                                            false
                                                                        }
                                                                        onChange={(e) => {
                                                                            const groupMembers =
                                                                                selectedMembers[group.group_name] || [];

                                                                            setSelectedMembers({
                                                                                ...selectedMembers,
                                                                                [group.group_name]: e.target.checked
                                                                                    ? [...groupMembers, member]
                                                                                    : groupMembers.filter(
                                                                                        (m) => m !== member
                                                                                    ),
                                                                            });
                                                                        }}
                                                                    >
                                                                        {member}
                                                                    </Checkbox>

                                                                    {(selectedMembers[group.group_name] || []).includes(
                                                                        member
                                                                    ) && (
                                                                            <Radio.Group
                                                                                value={roles[member] || "member"}
                                                                                onChange={(e) =>
                                                                                    setRoles((prev) => ({
                                                                                        ...prev,
                                                                                        [member]: e.target.value,
                                                                                    }))
                                                                                }
                                                                                style={{
                                                                                    marginLeft: 20,
                                                                                    marginTop: 8,
                                                                                }}
                                                                            >
                                                                                <Space>
                                                                                    <Radio value="owner">Owner</Radio>
                                                                                    <Radio value="member">Member</Radio>
                                                                                </Space>
                                                                            </Radio.Group>
                                                                        )}
                                                                </div>
                                                            ))}
                                                        </Collapse.Panel>
                                                    );
                                                })}
                                            </Collapse>
                                        </div>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div className="section">
                    <h3>Channel Details</h3>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="channelDisplayName" label="Channel Display Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="channelDescription" label="Channel Description">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Security"
                                name="security"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select Security",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Security">
                                    <Option value="Public">Public</Option>
                                    <Option value="Private">Private</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Type"
                                name="Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select Type",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Type">
                                    <Option value="datahub">datahub</Option>
                                    <Option value="integration">integration</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="overallChannelAlerts"
                        label="Overall Channel Alerts"
                        className="overall-alerts"
                    >
                        <Checkbox.Group>
                            <div
                                className="alerts-grid"
                                style={{ marginTop: "10px" }}
                            >
                                {alertsOptions.map((item) => (
                                    <Checkbox key={item} value={item}>
                                        {item}
                                    </Checkbox>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        name="scheduleType"
                        label="Schedule Type"
                        rules={[
                            {
                                required: true,
                                message: "Please select Schedule Type",
                            },
                        ]}
                    >
                        <Select placeholder="Select Schedule Type">
                            <Select.Option value="Daily">Daily</Select.Option>
                            <Select.Option value="Weekly">Weekly</Select.Option>
                            <Select.Option value="Monthly">Monthly</Select.Option>
                            <Select.Option value="Custom">Custom</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* DAILY */}
                    {selectedSchedule === "Daily" && (
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="dailyTime"
                                    label="Every Day At"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker
                                        format="HH:mm"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* WEEKLY */}
                    {selectedSchedule === "Weekly" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="weeklyDay"
                                    label="Day"
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Select Day">
                                        {weekDays.map((day) => (
                                            <Select.Option
                                                key={day}
                                                value={day}
                                            >
                                                {day}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="weeklyTime"
                                    label="Time"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker
                                        style={{ width: "100%" }}
                                        format="HH:mm"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* MONTHLY */}
                    {selectedSchedule === "Monthly" && (
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="monthlyWeek"
                                    label="Week"
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Select Week">
                                        {monthWeeks.map((week) => (
                                            <Select.Option
                                                key={week}
                                                value={week}
                                            >
                                                {week}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="monthlyDay"
                                    label="Day"
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Select Day">
                                        {weekDays.map((day) => (
                                            <Select.Option
                                                key={day}
                                                value={day}
                                            >
                                                {day}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="monthlyTime"
                                    label="Time"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker
                                        style={{ width: "100%" }}
                                        format="HH:mm"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    {/* CUSTOM */}
                    {selectedSchedule === "Custom" && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="customDates"
                                    label="Dates"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker
                                        multiple
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    name="customTime"
                                    label="Time"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker
                                        style={{ width: "100%" }}
                                        format="HH:mm"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}
                </div>
            </Form>
        </Modal>
    );
};
export default ChannelsPage;
