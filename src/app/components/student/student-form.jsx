import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Divider, Radio, Space } from 'antd';
import MessageBox from '../../helpers/MessageBox';
import helpers from '../../helpers';
import _const from '../../assets/const';
import NotFoundResult from '../others/notfound-result';
import enums from '../../enums';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const StudentForm = (props) => {
    const { isLoading, isLoadingPreData } = props;
    const [form] = Form.useForm();
    const isEditing = props.submitButtonName === 'Update';
    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        return () => {};
    }, []);

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        if (phoneIsValid === false)
            return MessageBox.show({
                content: 'Phone is used',
                messageType: MessageBox.MessageType.Error,
                key: 'employee',
            });

        // get all contacts (except main contact)
        const fullContacts =
            value.contacts.length !== 0
                ? value.contacts.map((item) => {
                      if (value.phone === item.phone) {
                          return MessageBox.show({
                              content: 'Extra contact number conflicts with main contact',
                              messageType: MessageBox.MessageType.Error,
                              key: 'student-form',
                          });
                      }
                      return {
                          ...item,
                          isMainContact: false,
                      };
                  })
                : [];
        const entity = {
            user: {
                name: value.name,
                username: value.username,
                password: value.password,
                email: value.email,
                description: value.description,
                address: value.address,
                role: _const.Role.Student,
                gender: value.gender,
                dateOfBirth: value.dateOfBirth
                    ? helpers.convertDateTimeWithTimezoneForMySQLFormat(value.dateOfBirth._d)
                    : undefined,
            },
            student: {},
            mainContact: { phone: value.phone, isMainContact: true },
            contacts: fullContacts,
        };
        props.onSubmit(entity);
    };

    const onPhoneNumberChange = async (event) => {
        const result = await helpers.checkPhoneIsExistAsMain(event.target.value);
        if (result.flag === enums.PhoneStatus.PHONE_WAS_NOT_USED) {
            updateMustHaveForm('', '', '');
            setReadOnly(false);
            setPhoneIsValid(true);
        } else {
            let errorMessage = 'Cannot use this phone number for student';
            switch (result.flag) {
                case enums.PhoneStatus.PHONE_IS_INVALID:
                    errorMessage = 'Phone number is invalid! Please try again!';
                    break;
                case enums.PhoneStatus.PHONE_USER_IS_NOT_STUDENT:
                case enums.PhoneStatus.PHONE_USER_IS_STUDENT:
                    errorMessage = 'Phone number has been used!';
                    break;
                default:
            }
            setReadOnly(true);
            setPhoneIsValid(false);
            MessageBox.show({
                content: errorMessage,
                messageType: MessageBox.MessageType.Error,
                key: 'check-phone-exist',
            });
        }
    };

    const updateMustHaveForm = (name, gender, id) => {
        form.setFieldsValue({
            name: name,
            gender: gender,
            userId: id,
        });
    };

    return (
        <>
            {props.initialValues && (
                <Form
                    {..._const.FormLayout}
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    initialValues={props.initialValues}
                    onFinishFailed={onFinishFailed}
                >
                    <Divider orientation="left">Student information</Divider>
                    <Form.Item
                        label="Phone number"
                        name="phone"
                        hasFeedback
                        placeholder="Input a number"
                        validateStatus={
                            phoneIsValid === null
                                ? ''
                                : phoneIsValid === false
                                ? 'error'
                                : 'success'
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
                                            rules={[
                                                { required: true, message: 'Missing phone number' },
                                            ]}
                                        >
                                            <Input placeholder="Phone number" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'description']}
                                            fieldKey={[fieldKey, 'description']}
                                            rules={[
                                                { required: true, message: 'Missing description' },
                                            ]}
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
                    <Divider orientation="left">Log-in information</Divider>
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>
                    {!isEditing && (
                        <Form.Item label="Password" name="password" extra="Default password is 123">
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                    )}

                    <Divider orientation="left">More detailed information</Divider>
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="D.O.B" name="dateOfBirth">
                        <DatePicker format={_const.DateFormatType} />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={isLoading}>
                            {props.submitButtonName}
                        </Button>
                    </Form.Item>
                </Form>
            )}
            {!props.initialValues && !isLoadingPreData && (
                <NotFoundResult
                    subTitle="Sorry, we cannot find this student."
                    backPageName="Student Management"
                    backUrl="/students"
                />
            )}
        </>
    );
};

export default StudentForm;
