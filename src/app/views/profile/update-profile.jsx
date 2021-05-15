import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserForm from '../../components/profile/user-form';
import moment from 'moment';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';

const UpdateEmployee = (props) => {
    const [data, setData] = useState('');
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);
    const currentUserReducer = useSelector((state) => state.currentUserReducer);
    const { currentUser } = currentUserReducer;

    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setData({
                ...currentUser,
                dateOfBirth: currentUser.dateOfBirth
                    ? moment(new Date(currentUser.dateOfBirth))
                    : null,
                userId: currentUser.id,
            });
            setIsLoadingPreData(false);
        };
        loadData();
        return () => {};
    }, []);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'update-profile',
        });

        // Calling api
        await apiMethods.authorization
            .updateCurrentUserInfo(value)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-profile',
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
                    key: 'update-profile',
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
                <Breadcrumb.Item>Edit profile</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit profile"
                subTitle={isLoadingPreData ? 'Fetching data...' : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/profile/change-main-contact">
                        <Button key="change-main-contact" type="light">
                            Change main contact
                        </Button>
                    </Link>,
                    <Link to="/profile/change-password">
                        <Button key="change-password" type="primary">
                            Change password
                        </Button>
                    </Link>,
                ]}
            >
                <UserForm
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
