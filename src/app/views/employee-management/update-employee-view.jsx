import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import EmployeeForm from '../../components/employee/employee-form';
import apiMethods from '../../http-client/api-methods';
import moment from 'moment';
import MessageBox from '../../helpers/MessageBox';

const UpdateEmployee = (props) => {
    const [data, setData] = useState(null);
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);

    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await apiMethods.employee
                .getEmployeeDetail(props.match.params.id)
                .then((result) => result.data.data)
                .then((result) => {
                    setData({
                        ...result,
                        dateOfBirth: result.dateOfBirth
                            ? moment(new Date(result.dateOfBirth))
                            : null,
                        userId: result.id,
                        phone: result.employee.user.contacts.find((t) => t.isMainContact === true)
                            .phone,
                    });
                })
                .catch((err) => {});
            setIsLoadingPreData(false);
        };
        loadData();
        return () => {};
    }, [props.match.params.id]);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'update-employee',
        });

        // Calling api
        await apiMethods.employee
            .update(data.userId, value)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully. Redirecting to last page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-employee',
                    onClose: () => {
                        props.history.goBack();
                    },
                });
            })
            .catch((err) => {
                let messageContent = 'Cannot update at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'update-employee',
                });
            });

        // Mark loading to false
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
                <Breadcrumb.Item>Edit</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit information"
                subTitle={isLoadingPreData ? 'Fetching data...' : ''}
            >
                <EmployeeForm
                    submitButtonName="Update"
                    onSubmit={onUpdate}
                    initialValues={data}
                    isLoading={isLoading}
                    isLoadingPreData={isLoadingPreData}
                />
            </PageHeader>
        </>
    );
};

export default UpdateEmployee;
