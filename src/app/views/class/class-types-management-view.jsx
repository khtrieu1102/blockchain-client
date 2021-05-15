import React, { useEffect, useRef, useState } from 'react';
import { Table, PageHeader, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';

const ClassTypes = () => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        if (!mountedRef.current) return;
        const loadData = async () => {
            setIsLoading(true);
            await apiMethods.classInfo
                .getAllClassTypes()
                .then((result) => {
                    setIsLoading(false);
                    setData(result.data.data);
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
                <Breadcrumb.Item>Class types</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Class Types"
                subTitle={isLoading ? "We're fetching data..." : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Button key="add-new-class" type="primary">
                        New class types
                    </Button>,
                ]}
            />
            <Table dataSource={data} rowKey="id">
                <Table.Column title="Id" dataIndex="id" key="id" />
                <Table.Column title="Code" dataIndex="code" key="code" />
                <Table.Column title="Name" dataIndex="name" key="name" />
                <Table.Column title="Description" dataIndex="description" key="description" />
                <Table.Column title="Fee" dataIndex="feePay" key="feePay" />
                <Table.Column title="Total Lessons" dataIndex="totalLessons" key="totalLessons" />
            </Table>
        </>
    );
};

export default ClassTypes;
