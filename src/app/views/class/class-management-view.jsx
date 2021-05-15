import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';
import ClassTable from '../../components/class/class-table';

const ClassManagement = (props) => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        await apiMethods.classInfo
            .getAllClasses()
            .then((result) => {
                setIsLoading(false);
                setData(result.data.data);
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
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Classes Management</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                title="Class Management"
                subTitle={isLoading ? "We're fetching data..." : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/classes/create">
                        <Button key="add-new-class" type="primary">
                            New class
                        </Button>
                    </Link>,
                ]}
            >
                <ClassTable data={data} loadData={loadData} />
            </PageHeader>
        </>
    );
};

export default ClassManagement;
