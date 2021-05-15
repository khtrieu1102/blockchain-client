import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Form, Input, Button, Typography } from 'antd';
import { useSelector } from 'react-redux';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';

const { Title } = Typography;

const LogIn = (props) => {
    const [form] = Form.useForm();
    const authorizationReducer = useSelector((state) => state.authorizationReducer);
    const { isLoading } = authorizationReducer;
    const [step, setStep] = useState(0);
    const [submitButtonName, setSubmitButtonName] = useState('SEND OTP CODE');
    const [data, setData] = useState({
        email: '',
        code: '',
        password: '',
        retypePassword: '',
    });

    useEffect(() => {
        if (isLoading) message.loading({ content: 'Please wait', key: 'reset-password' });
    }, [isLoading]);

    const onGetOtpCode = async (values) => {
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'request-reset-password',
        });

        // Calling api
        await apiMethods.authorization
            .requestResetPassword(values.email)
            .then((result) => {
                MessageBox.show({
                    content: `Sent successfully. Check your email now to get code!`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'request-reset-password',
                });
                setData({ ...data, email: values.email });
                setStep(1);
                setSubmitButtonName('VERIFY OTP CODE');
            })
            .catch((err) => {
                let messageContent = 'Cannot update at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'request-reset-password',
                });
            });
    };

    const onVerifyOtpCode = async (values) => {
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'request-reset-password',
        });

        // Calling api
        await apiMethods.authorization
            .requestResetPassword(data.email, values.code)
            .then((result) => {
                MessageBox.show({
                    content: `Sent successfully. Check your email now to get code!`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'request-reset-password',
                });
                setData({ ...data, code: values.code });
                setStep(2);
                setSubmitButtonName('RESET PASSWORD');
            })
            .catch((err) => {
                let messageContent = 'Cannot update at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'request-reset-password',
                });
            });
    };

    const onResetPassword = async (values) => {
        const entity = { ...values, email: data.email, code: data.code };

        if (values.password !== values.retypePassword) {
            return MessageBox.show({
                content: 'Passwords are not matched',
                messageType: MessageBox.MessageType.Error,
                key: 'request-reset-password',
            });
        }

        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'request-reset-password',
        });

        // Calling api
        await apiMethods.authorization
            .resetPassword(entity.email, entity.code, entity.password)
            .then((result) => {
                MessageBox.show({
                    content: `Sent successfully. Check your email now to get code!`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'request-reset-password',
                });
                setData({ ...data, code: values.code });
                setStep(2);
                setSubmitButtonName('RESET PASSWORD');
            })
            .catch((err) => {
                let messageContent = 'Cannot update at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'request-reset-password',
                });
            });
    };

    const onFinish = (values) => {
        switch (step) {
            case 0:
                onGetOtpCode(values);
                break;
            case 1:
                onVerifyOtpCode(values);
                break;
            default:
                onResetPassword(values);
        }
    };

    const onFinishFailed = (errorInfo) => {};

    return (
        <div className="form-modal">
            <div className="frm">
                <Title className="text-center" style={{ marginTop: '0.5em' }}>
                    RESET PASSWORD
                </Title>
                <Form
                    form={form}
                    className="form-detail"
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    {/* STEP 0: ADD EMAIL */}
                    {step === 0 && (
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: step === 0,
                                    type: 'email',
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input className="custom-input" placeholder="Email" />
                        </Form.Item>
                    )}
                    {/* STEP 1: ADD OTP CODE */}
                    {step === 1 && (
                        <Form.Item
                            name="code"
                            rules={[
                                { required: step === 1, message: 'Please input your OTP code!' },
                            ]}
                        >
                            <Input className="custom-input" placeholder="OTP code" />
                        </Form.Item>
                    )}
                    {/* STEP 2: RESET PASSWORD */}
                    {step === 2 && (
                        <Form.Item
                            name="password"
                            type="password"
                            rules={[
                                { required: step === 2, message: 'Please input your password!' },
                            ]}
                        >
                            <Input.Password className="custom-input" placeholder="Password" />
                        </Form.Item>
                    )}
                    {step === 2 && (
                        <Form.Item
                            name="retypePassword"
                            type="password"
                            rules={[
                                {
                                    required: step === 2,
                                    message: 'Please input your retype password!',
                                },
                            ]}
                        >
                            <Input.Password
                                className="custom-input"
                                placeholder="Retype Password"
                            />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="btn-submit">
                            {submitButtonName}
                        </Button>
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Link to="/sign-in">Log In now</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LogIn;
