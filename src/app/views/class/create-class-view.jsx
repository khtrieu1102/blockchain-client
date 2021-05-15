import React, { useEffect, useState } from 'react';
import { Breadcrumb, PageHeader, Content } from 'antd';
import ClassInfoForm from '../../components/class/class-form';
import { Link } from 'react-router-dom';
import moment from 'moment';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';
import enums from '../../enums';

const CreateClass = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        return () => {};
    }, []);

    const initialValues = {
        status: enums.Status.Pending,
        classPlaceId: 1,
        classTypeId: 1,
        name: 'T-Pre',
        startDate: moment(new Date()),
        startTime: moment('18:00', 'HH:mm'),
    };

    const onCreate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'create-class',
        });

        // Call api
        await apiMethods.classInfo
            .createNewClass(value)
            .then((result) => {
                MessageBox.show({
                    content: `Created successfully. Redirecting to class page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'create-class',
                    onClose: () => {
                        props.history.push('/classes');
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
                    key: 'create-class',
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
                    <Link to="/classes">Classes Management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>New class</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader ghost={false} title="New class">
                <ClassInfoForm
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

export default CreateClass;
