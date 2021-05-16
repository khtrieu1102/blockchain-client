import React, { useRef, useEffect, useState } from 'react';
import { Col, Row, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiMethods from '../http-client/api-methods';
import MessageBox from '../helpers/MessageBox';
import { useSelector } from 'react-redux';

const Dashboard = (props) => {
    const currentUserReducer = useSelector((state) => state.currentUserReducer);
    const authorizationReducer = useSelector((state) => state.authorizationReducer);
    const { isAuthenticated } = authorizationReducer;
    const { username, privateKey } = currentUserReducer.currentUser;
    const mountedRef = useRef(true);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState('');

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BTC',
        minimumFractionDigits: 0,
    });
    const formattedBalance = formatter.format('1233');

    const loadData = async () => {
        if (isAuthenticated === false) return;
        await apiMethods.blockchain
            .getCurrentBalance()
            .then((result) => result.data.balance)
            .then((result) => {
                setIsLoading(false);
                setBalance(formatter.format(result));
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadData();
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const mineBlockHandle = async () => {
        // Loading...
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'mine-block',
        });

        // Calling API
        await apiMethods.blockchain
            .mineBlock()
            .then((result) => {
                MessageBox.show({
                    content: `Mined successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'mine-block',
                });
                loadData();
            })
            .catch((err) => {
                let messageContent = 'Cannot create at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }

                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'mine-block',
                });
            });

        // Not load anymore
        setIsLoading(false);
    };

    console.log({ username });

    return (
        <Container fluid>
            <Row>
                <Col md={{ span: 6, offset: 3 }} lg={6}>
                    <Card className="text-center" className="mt-3 text-center">
                        <Card.Header>DASHBOARD</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Xin chào,{' '}
                                {!username || username === '' ? (
                                    <Link to="/login">
                                        <span className="text-primary">Sử dụng ví ngay!</span>
                                    </Link>
                                ) : (
                                    <span>{username.toUpperCase()}</span>
                                )}
                            </Card.Title>
                            {isAuthenticated && (
                                <p>
                                    Số dư khả dụng của bạn:{' '}
                                    <span className="text-primary" style={{ fontSize: 20 }}>
                                        {balance}
                                    </span>
                                </p>
                            )}
                            <Col>
                                <Button
                                    variant="primary"
                                    className="extraButton"
                                    onClick={mineBlockHandle}
                                    disabled={!isAuthenticated}
                                >
                                    Mine a block (no data)
                                </Button>
                            </Col>
                            <Col className="mt-2">
                                <Link to="/transaction" className="extraButton">
                                    <Button
                                        variant="primary"
                                        className="extraButton"
                                        disabled={!isAuthenticated}
                                    >
                                        Mine a raw block (with transaction data)
                                    </Button>
                                </Link>
                            </Col>
                            <Col className="mt-2">
                                <Link to="/transfer" className="extraButton">
                                    <Button
                                        variant="primary"
                                        className="extraButton"
                                        disabled={!isAuthenticated}
                                    >
                                        Transfer
                                    </Button>
                                </Link>
                            </Col>
                        </Card.Body>
                        <Card.Footer className="text-muted">Blockchain - HCMUS - 2021</Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
