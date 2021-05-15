import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { message, Form, Input, Checkbox, Typography, Result } from 'antd';
import { Button, Row, Col, Container, Card, Spinner } from 'react-bootstrap';

import actionCreators from '../redux/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import apiMethods from '../http-client/api-methods';
import BlockList from '../components/blockchain/block-list';

const { Title } = Typography;

const BlockchainView = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        await apiMethods.blockchain
            .getAllBlocks()
            .then((result) => {
                setIsLoading(false);
                setData(result.data);
                console.log(result.data);
            })
            .catch((err) => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadData();
        return () => {};
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={{ span: 5, offset: 3 }} lg={6}>
                    <h5 style={{ textAlignment: 'center' }}>BLOCKCHAIN</h5>
                    {data && <BlockList data={data} />}
                </Col>
            </Row>
        </Container>
    );
};

export default BlockchainView;
