import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Divider, Radio } from 'antd';
import _const from '../../assets/const';
import helpers from '../../helpers';
import NotFoundResult from '../others/notfound-result';
import enums from '../../enums';
import MessageBox from '../../helpers/MessageBox';

const EmployeeForm = (props) => {
    const { isLoading, isLoadingPreData, initialValues } = props;
    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [form] = Form.useForm();
    const isEditing = props.submitButtonName === 'Update';

    useEffect(() => {
        return () => {};
    }, []);

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

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        let role = initialValues.role;
        switch (value.role) {
            case _const.Role.Employee:
                role = _const.Role.Employee;
                break;
            case _const.Role.TA:
                role = _const.Role.TA;
                break;
            case _const.Role.Teacher:
                role = _const.Role.Teacher;
                break;
            default:
        }

        if (phoneIsValid === false)
            return MessageBox.show({
                content: 'Phone is used',
                messageType: MessageBox.MessageType.Error,
                key: 'employee',
            });

        const entity = {
            user: {
                name: value.name,
                username: value.username,
                password: value.password,
                email: value.email,
                description: value.description,
                address: value.address,
                role: role,
                gender: value.gender,
                isDisabled: initialValues.isDisabled,
                dateOfBirth: value.dateOfBirth
                    ? helpers.convertDateTimeWithTimezoneForMySQLFormat(value.dateOfBirth._d)
                    : undefined,
            },
            employeeInfo: {},
            contacts: {},
            mainContact: {
                phone: value.phone,
                isMainContact: true,
            },
            // contact: { phone: value.phone, isMainContact: true },
        };
        props.onSubmit(entity);
    };

    return (
        <>
            {initialValues && (
                <Form
                    {..._const.FormLayout}
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    initialValues={initialValues}
                    onFinishFailed={onFinishFailed}
                >
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

                    <Form.Item
                        label="Full name"
                        name="name"
                        rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please choose a gender!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value="Male">Male</Radio.Button>
                            <Radio.Button value="Female">Female</Radio.Button>
                            <Radio.Button value="Others">Others</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please input user role!' }]}
                    >
                        <Radio.Group>
                            <Radio.Button value={_const.Role.Employee}>Employee</Radio.Button>
                            <Radio.Button value={_const.Role.TA}>Teaching Assistant</Radio.Button>
                            <Radio.Button value={_const.Role.Teacher}>Teacher</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

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
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, type: 'email', message: 'Please input valid email!' },
                        ]}
                    >
                        <Input type="email" />
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
            {!initialValues && !isLoadingPreData && (
                <NotFoundResult
                    subTitle="Sorry, we cannot find this employee."
                    backPageName="Employee Management"
                    backUrl="/employees"
                />
            )}
        </>
    );
};

export default EmployeeForm;
