import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';
import ChangeMainContactForm from '../../components/profile/change-main-contact-form';

const ChangeMainContactView = (props) => {
    // On submit loading
    const [data, setData] = useState('');
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);

    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await apiMethods.student
                .getSingleStudent(props.match.params.id)
                .then((result) => result.data.data)
                .then((result) => {
                    const mainContact = result.user.contacts.find((t) => t.isMainContact === true);
                    setData({
                        name: result.user.name,
                        currentPhone: mainContact.phone,
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
            key: 'change-main-contact',
        });

        // Calling api
        await apiMethods.contact
            .updateMainContact(props.match.params.id, value)
            .then((result) => {
                MessageBox.show({
                    content: `Your main contact was changed successfully.`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'change-main-contact',
                    onClose: () => {
                        props.history.push(`/students/${props.match.params.id}/edit`);
                    },
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
                    <Link to="/students">Student management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Change student main contact</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                subTitle={data ? `Student name: ${data.name.toUpperCase()}` : 'ERROR!'}
                title="Change student main contact"
            >
                <ChangeMainContactForm
                    submitButtonName="Update"
                    currentPhone={data.currentPhone}
                    onSubmit={onUpdate}
                    isLoading={isLoading}
                />
            </PageHeader>
        </>
    );
};

export default ChangeMainContactView;
