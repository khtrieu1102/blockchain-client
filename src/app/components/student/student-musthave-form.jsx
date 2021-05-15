import React from 'react';
import { Form, Radio, Input, Button, Divider, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import _const from '../../assets/const';
import { Link } from 'react-router-dom';

const StudentMustHaveForm = (props) => {
    const {
        form,
        isEditing = false,
        initialValues,
        onPhoneNumberChange,
        readOnly,
        phoneIsValid,
    } = props;

    return (
        <>
            <Divider orientation="left">Student information</Divider>
            <Form.Item
                label="Phone number"
                name="phone"
                hasFeedback
                placeholder="Input a number"
                validateStatus={
                    phoneIsValid === null ? '' : phoneIsValid === false ? 'error' : 'success'
                }
                rules={[
                    {
                        required: true,
                        message: 'Please input phone number without space!',
                    },
                ]}
            >
                <Input onBlur={onPhoneNumberChange} disabled={isEditing} />
            </Form.Item>
            <Form.Item label="Student ID" name="userId">
                <Input disabled />
            </Form.Item>
            <Form.Item
                label="Full name"
                name="name"
                rules={[{ required: true, message: 'Please input full name!' }]}
            >
                <Input disabled={readOnly} />
            </Form.Item>
            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please choose a gender!' }]}
            >
                <Radio.Group disabled={readOnly}>
                    <Radio.Button value="Male">Male</Radio.Button>
                    <Radio.Button value="Female">Female</Radio.Button>
                    <Radio.Button value="Others">Others</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="Student description"
                name="studentDescription"
                extra="Student's personal information"
            >
                <Input.TextArea rows={4} disabled={readOnly} />
            </Form.Item>
            {isEditing && (
                <Link to={`/students/${initialValues.userId}/edit`}>Edit info this student?</Link>
            )}

            <Divider orientation="left">Contacts</Divider>
            <Form.List name="contacts">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space
                                key={key}
                                style={{ display: 'flex', marginBottom: 8, columnSpan: 20 }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'phone']}
                                    fieldKey={[fieldKey, 'phone']}
                                    rules={[{ required: true, message: 'Missing phone number' }]}
                                >
                                    <Input placeholder="Phone number" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'description']}
                                    fieldKey={[fieldKey, 'description']}
                                    rules={[{ required: true, message: 'Missing description' }]}
                                >
                                    <Input placeholder="Description" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add new contact
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </>
    );
};

export default StudentMustHaveForm;
