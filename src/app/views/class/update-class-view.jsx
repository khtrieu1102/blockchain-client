import React, { useEffect, useState } from 'react';
import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ClassInfoForm from '../../components/class/class-form';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';

const UpdateClass = (props) => {
    const [data, setData] = useState('');
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);

    // On submit loading
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await apiMethods.classInfo
                .getSpecificClassByClassId(props.match.params.classId)
                .then((result) => {
                    setIsLoadingPreData(false);
                    setData({
                        ...result.data.data,
                        startDate: moment(new Date(result.data.data.startDate)),
                        startTime: moment(new Date(result.data.data.startTime)),
                    });
                })
                .catch((err) => {
                    setIsLoadingPreData(false);
                });
        };
        loadData();
        return () => {};
    }, [props.match.params.classId]);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'update-class',
        });

        // Calling api
        await apiMethods.classInfo
            .updateSpecificClassById(data.id, value)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully. Redirecting to class page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-class',
                    onClose: () => {
                        props.history.push('/classes');
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
                    key: 'update-class',
                });
            });

        // Mark loading to false
        setIsLoading(false);
    };

    return (
        <>
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
                            <Link to={`/classes/${data.id}`}>{data.name}</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Update info</Breadcrumb.Item>
                    </Breadcrumb>
                )}
                <PageHeader
                    ghost={false}
                    title="Update class"
                    subTitle={isLoadingPreData ? 'Fetching data...' : ''}
                >
                    <ClassInfoForm
                        submitButtonName="Update"
                        onSubmit={onUpdate}
                        initialValues={data}
                        isLoading={isLoading}
                        isLoadingPreData={isLoadingPreData}
                    />
                </PageHeader>
            </>
        </>
    );
};

export default UpdateClass;
