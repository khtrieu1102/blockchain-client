import React, { useEffect, useState } from 'react';
import { PageHeader, message, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import EnrollmentForm from '../../components/enrollment/enrollment-form';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';

const CreateEnroll = (props) => {
    const [data, setData] = useState(null);
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);
    const initialValues = {
        description: '',
        desiredClassDescription: '',
        callingStatus: 'Pending',
        attendantStatus: 'Pending',
        feePaid: '0',
        contacts: [],
    };

    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    // Get class data
    useEffect(() => {
        const loadData = async (classId) => {
            await apiMethods.classInfo
                .getMoreInfoByClassId(classId)
                .then((result) => result.data.data)
                .then((result) => {
                    setData({
                        ...initialValues,
                        classId: result.id,
                        className: result.name,
                        feeHaveToPay: result.classType.feePay,
                        schedule: result.schedule,
                        startDate: result.startDate,
                        startTime: result.startTime,
                    });
                    setIsLoadingPreData(false);
                })
                .catch((err) => {
                    setIsLoadingPreData(false);
                });
        };
        loadData(props.match.params.classId);
    }, [props.match.params.classId]);

    // on form submit -> run this function to create http post method and create new record
    const onCreate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'create-enrollment',
        });

        await apiMethods.enrollment
            .createNewRecord(value)
            .then((result) => {
                MessageBox.show({
                    content: `Created successfully. Redirecting to class page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'create-enrollment',
                    onClose: () => {
                        props.history.push(`/classes/${props.match.params.classId}`);
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
                    key: 'create-enrollment',
                });
            });
        setIsLoading(false);
    };

    return (
        <>
            {data && (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Dashboard</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/classes">Classes Management</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/classes/${props.match.params.classId}`}>{data.className}</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>New Enrollment</Breadcrumb.Item>
                </Breadcrumb>
            )}
            <PageHeader ghost={false} title="New enroll record" />
            <EnrollmentForm
                submitButtonName="Create"
                onSubmit={onCreate}
                initialValues={data}
                isLoading={isLoading}
                isLoadingPreData={isLoadingPreData}
            />
        </>
    );
};

export default CreateEnroll;
