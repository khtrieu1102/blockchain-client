import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';
import ChangeMainContactForm from '../../components/profile/change-main-contact-form';

const ChangeMainContactView = (props) => {
    // On submit loading
    const [isLoading, setIsLoading] = useState(false);
    const currentUserReducer = useSelector((state) => state.currentUserReducer);

    useEffect(() => {
        return () => {};
    }, []);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'change-main-contact',
        });

        // Calling api
        await apiMethods.contact
            .updateMainContact(currentUserReducer.currentUser.id, value)
            .then((result) => {
                MessageBox.show({
                    content: `Your main contact was changed successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'change-main-contact',
                });
            })
            .catch((err) => {
                let messageContent = 'Cannot change main contact at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'change-main-contact',
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
                <Breadcrumb.Item>Change main contact</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Change main contact"
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/profile">
                        <Button key="basic-info" type="primary">
                            Basic Info
                        </Button>
                    </Link>,
                ]}
            >
                <ChangeMainContactForm
                    submitButtonName="Update"
                    currentPhone="0903020298"
                    onSubmit={onUpdate}
                    isLoading={isLoading}
                />
            </PageHeader>
        </>
    );
};

export default ChangeMainContactView;
