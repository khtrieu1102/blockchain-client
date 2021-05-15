import React, { useEffect, useRef, useState } from 'react';
import { Table, PageHeader, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';

const ClassPlaces = () => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        if (!mountedRef.current) return;
        const loadData = async () => {
            setIsLoading(true);
            await apiMethods.classInfo
                .getAllClassPlaces()
                .then((result) => {
                    setIsLoading(false);
                    if (result.status === 200) {
                        setData(result.data.data);
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        };
        loadData();
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Class places</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Class Places"
                subTitle={isLoading ? "We're fetching data..." : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Button key="add-new-class" type="primary">
                        New class places
                    </Button>,
                ]}
            />
            <Table dataSource={data} rowKey="id">
                <Table.Column title="Id" dataIndex="id" key="id" />
                <Table.Column title="Code" dataIndex="code" key="code" />
                <Table.Column title="Name" dataIndex="name" key="name" />
                <Table.Column title="Address" dataIndex="address" key="address" />
            </Table>
        </>
    );
};

export default ClassPlaces;
