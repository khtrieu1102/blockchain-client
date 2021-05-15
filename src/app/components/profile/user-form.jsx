import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Divider, Radio } from 'antd';
import _const from '../../assets/const';
import helpers from '../../helpers';
import NotFoundResult from '../others/notfound-result';

const UserForm = (props) => {
    const { isLoading, isLoadingPreData, initialValues } = props;
    const [form] = Form.useForm();
    const isEditing = props.submitButtonName === 'Update';

    useEffect(() => {
        return () => {};
    }, []);

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        const entity = {
            name: value.name,
            username: value.username,
            email: value.email,
            description: value.description,
            address: value.address,
            gender: value.gender,
            dateOfBirth: value.dateOfBirth
                ? helpers.convertDateTimeWithTimezoneForMySQLFormat(value.dateOfBirth._d)
                : undefined,
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

                    <Divider orientation="left">Log-in information</Divider>
                    <Form.Item label="Username" name="username">
                        <Input disabled />
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
            {!initialValues && !isLoadingPreData && (
                <NotFoundResult backPageName="Dashboard" backUrl="/" />
            )}
        </>
    );
};

export default UserForm;
