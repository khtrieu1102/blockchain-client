import React, { useEffect, useState } from 'react';
import { PageHeader, message, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import EmployeeForm from '../../components/employee/employee-form';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';
import _const from '../../assets/const';

const CreateEmployee = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        return () => {};
    }, []);

    const initialValues = {
        gender: 'Male',
        password: '123',
        role: _const.Role.Employee,
        isDisabled: true,
    };

    const onCreate = async (value) => {
        // Loading...
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'create-employee',
        });

        // Calling API
        await apiMethods.employee
            .create(value)
            .then((result) => {
                MessageBox.show({
                    content: `Created successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'create-employee',
                    onClose: () => {
                        props.history.push('/employees');
                    },
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
                    key: 'create-employee',
                });
            });

        // Not load anymore
        setIsLoading(false);
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/employees">Employees Management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>New employee</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader ghost={false} title="New Employee">
                <EmployeeForm
                    submitButtonName="Create"
                    onSubmit={onCreate}
                    initialValues={initialValues}
                    isLoading={isLoading}
                    isLoadingPreData={false}
                />
            </PageHeader>
        </>
    );
};

export default CreateEmployee;
