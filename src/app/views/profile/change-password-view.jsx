import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';
import ChangePasswordForm from '../../components/profile/change-password-form';

const ChangePasswordView = (props) => {
    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {};
    }, []);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'change-password',
        });

        // Calling api
        await apiMethods.authorization
            .changePassword(value)
            .then((result) => {
                MessageBox.show({
                    content: `Password changed successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'change-password',
                });
            })
            .catch((err) => {
                let messageContent = 'Cannot change password at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'change-password',
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
                    <Link to="/profile">Profile</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Change password</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Change password"
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/profile">
                        <Button key="basic-info" type="primary">
                            Basic Info
                        </Button>
                    </Link>,
                ]}
            >
                <ChangePasswordForm
                    submitButtonName="Update"
                    onSubmit={onUpdate}
                    isLoading={isLoading}
                />
            </PageHeader>
        </>
    );
};

export default ChangePasswordView;
