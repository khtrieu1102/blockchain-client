import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb, Button } from 'antd';
import { Link } from 'react-router-dom';
import StudentForm from '../../components/student/student-form';
import apiMethods from '../../http-client/api-methods';
import moment from 'moment';
import MessageBox from '../../helpers/MessageBox';

const UpdateClass = (props) => {
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
                    const contacts = result.user.contacts.filter((t) => t.isMainContact === false);
                    setData({
                        ...result.user,
                        dateOfBirth: result.user.dateOfBirth
                            ? moment(new Date(result.user.dateOfBirth))
                            : null,
                        phone: mainContact.phone,
                        userId: result.userId,
                        contacts: contacts,
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
            key: 'update-student',
        });

        // Calling api
        await apiMethods.student
            .updateSingleStudent(data.userId, value)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully. Redirecting to last page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-student',
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
                    key: 'update-student',
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
                    <Link to="/students">Students Management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Edit</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit student' information"
                subTitle={isLoadingPreData ? 'Fetching data...' : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to={`/students/${data.userId}/change-main-contact`}>
                        <Button key="basic-info" type="primary">
                            Change contact
                        </Button>
                    </Link>,
                ]}
            >
                <StudentForm
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

export default UpdateClass;
