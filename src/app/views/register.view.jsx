import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Form, Input, Checkbox, Typography } from 'antd';
import { Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import actionCreators from '../redux/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import apiMethods from '../http-client/api-methods';
import MessageBox from '../helpers/MessageBox';

const { Title } = Typography;

const RegisterView = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        // Loading...
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'create-wallet',
        });

        // Calling API
        await apiMethods.authorization
            .register(values)
            .then((result) => {
                MessageBox.show({
                    content: `Mined successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'create-wallet',
                });
            })
            .catch((err) => {
                let messageContent = 'Cannot create at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }

                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'create-wallet',
                });
            });

        // Not load anymore
        setIsLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        message.error({ content: 'Không đăng nhập được', key: 'login' });
    };

    return (
        <Row className="justify-content-md-center">
            <Col xs={10} md={6}>
                <Card border="primary" className="mt-3">
                    <Card.Header>
                        <Card.Title className="text-center text-dark">
                            CREATE YOUR WALLET
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form
                            form={form}
                            className="signin-form"
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input className="custom-input" placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                type="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password className="custom-input" placeholder="Password" />
                            </Form.Item>

                            <Form.Item className="signin-btn-row">
                                <Button type="primary" htmlType="submit" className="signin-btn">
                                    Create
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterView;
