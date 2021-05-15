import React, { useEffect, useState } from 'react';
import { PageHeader, message, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import StudentForm from '../../components/student/student-form';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';

const CreateStudent = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        return () => {};
    }, []);

    const initialValues = {
        gender: 'Male',
        password: '123',
        contacts: [],
    };

    const onCreate = async (value) => {
        // Loading...
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'create-student',
        });

        // Calling API
        await apiMethods.student
            .createNewStudent(value)
            .then((result) => {
                MessageBox.show({
                    content: `Created successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'create-student',
                    onClose: () => {
                        props.history.push('/students');
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
                    key: 'create-student',
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
                    <Link to="/students">Students Management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>New student</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader ghost={false} title="New student">
                <StudentForm
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

export default CreateStudent;
