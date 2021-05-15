import React, { useRef, useEffect, useState } from 'react';
import { Col, Row, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiMethods from '../http-client/api-methods';
import MessageBox from '../helpers/MessageBox';
import { useSelector } from 'react-redux';

const Dashboard = (props) => {
    const currentUserReducer = useSelector((state) => state.currentUserReducer);
    const { username, privateKey } = currentUserReducer;
    const mountedRef = useRef(true);
    const [isLoading, setIsLoading] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });
    const formattedBalance = formatter.format(balance);

    useEffect(() => {
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

    return (
        <Container fluid>
            <Row>
                <Col md={{ span: 6, offset: 3 }} lg={6}>
                    <Card className="text-center" className="mt-3 text-center">
                        <Card.Header>DASHBOARD</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Xin chào,{' '}
                                <Link to="/edit">
                                    <span className="text-primary">
                                        {name ? name : 'Sử dụng ví ngay!'}
                                    </span>
                                </Link>
                            </Card.Title>
                            <Card.Text>
                                Số dư khả dụng của bạn:{' '}
                                <span className="text-primary">{formattedBalance}</span>
                            </Card.Text>
                            <Col>
                                <Button
                                    variant="primary"
                                    className="extraButton"
                                    onClick={mineBlockHandle}
                                >
                                    Mine a raw block (no data)
                                </Button>
                            </Col>
                            <Col className="mt-2">
                                <Link to="/transaction" className="extraButton">
                                    <Button variant="primary" className="extraButton">
                                        Mine a block (with transaction data)
                                    </Button>
                                </Link>
                            </Col>
                            <Col className="mt-2">
                                <Link to="/debt" className="extraButton">
                                    <Button variant="primary" className="extraButton">
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
