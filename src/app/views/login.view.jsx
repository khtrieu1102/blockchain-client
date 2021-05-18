import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message, Form, Input, Checkbox, Typography } from 'antd';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';

import actionCreators from '../redux/action-creators';
import { useDispatch, useSelector } from 'react-redux';

const { Title } = Typography;

const LogIn = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const authorizationReducer = useSelector((state) => state.authorizationReducer);
    const { isLoading } = authorizationReducer;

    useEffect(() => {
        if (isLoading) message.loading({ content: 'Please wait', key: 'login' });
    }, [isLoading]);

    const onFinish = (values) => {
        dispatch(actionCreators.authorization.logIn(values));
    };

    const onFinishFailed = (errorInfo) => {
        message.error({ content: 'Không đăng nhập được', key: 'login' });
    };

    return (
        <Container fluid>
            <Card border="primary" className="mt-3">
                <Card.Header>
                    <Card.Title className="text-center text-dark">LOG IN</Card.Title>
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

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item className="signin-btn-row">
                            <Button type="primary" htmlType="submit" className="signin-btn">
                                Sign In
                            </Button>
                        </Form.Item>
                        <Form.Item className="forgot-password-row">
                            <Link to="/register">Create your new wallet?</Link>
                        </Form.Item>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LogIn;
