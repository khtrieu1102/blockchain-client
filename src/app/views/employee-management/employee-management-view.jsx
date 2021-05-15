import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';
import EmployeeTable from '../../components/employee/employee-table';

const EmployeeManagement = (props) => {
    const [data, setData] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        await apiMethods.employee
            .getAll()
            .then((result) => result.data.data)
            .then((result) => {
                setData(result);
            })
            .catch((err) => {});
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
        return () => {};
    }, []);

    const updateStatus = async (id, isDisabled) => {
        await apiMethods.authorization
            .updateUserStatus(id, isDisabled)
            .then((result) => loadData())
            .catch((error) => {});
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Employee Management</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                title="Employee Management"
                subTitle={isLoading ? "We're fetching data..." : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/employees/create">
                        <Button key="add-new-employee" type="primary">
                            New employee
                        </Button>
                    </Link>,
                ]}
            />
            <EmployeeTable data={data} updateStatus={updateStatus} />
        </>
    );
};

export default EmployeeManagement;
