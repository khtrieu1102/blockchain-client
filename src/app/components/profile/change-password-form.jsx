import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import MessageBox from '../../helpers/MessageBox';
import _const from '../../assets/const';

const ChangePasswordForm = (props) => {
    const { isLoading, onSubmit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        return () => {};
    }, []);

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        const retypePassword = value.retypePassword;
        const entity = {
            currentPassword: value.currentPassword,
            newPassword: value.newPassword,
        };

        // check new passwords matched
        if (entity.newPassword !== retypePassword) {
            form.setFieldsValue({
                currentPassword: '',
                newPassword: '',
                retypePassword: '',
            });
            return MessageBox.show({
                content: 'New password and retype password are not matched! Please try again',
                messageType: MessageBox.MessageType.Error,
                key: 'change-password',
            });
        }

        onSubmit(entity);
    };

    return (
        <>
            <Form
                {..._const.FormLayout}
                form={form}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Current password"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    label="New password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                    label="Retype new password"
                    name="retypePassword"
                    rules={[{ required: true, message: 'Please retype your new password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {props.submitButtonName}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ChangePasswordForm;
