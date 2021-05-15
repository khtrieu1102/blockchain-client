import React, { useEffect, useRef, useState } from 'react';
import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import EnrollmentForm from '../../components/enrollment/enrollment-form';
import apiMethods from '../../http-client/api-methods';
import NotFoundResult from '../../components/others/notfound-result';
import MessageBox from '../../helpers/MessageBox';

const UpdateEnroll = (props) => {
    const mountedRef = useRef(true);
    const [classId, setClassId] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({ className: null });

    useEffect(() => {
        if (!mountedRef.current) return;
        const { classId, enrollmentId } = props.match.params;

        setClassId(classId);
        setEnrollmentId(enrollmentId);
        return () => {
            mountedRef.current = false;
        };
    }, [props.match.params, props.location.search]);

    // Get class data
    useEffect(() => {
        const loadData = async (enrollmentId) => {
            await Promise.all([
                apiMethods.classInfo.getMoreInfoByClassId(classId),
                apiMethods.enrollment.getEnrollmentDetailById(enrollmentId),
            ])
                .then((results) => [results[0].data?.data, results[1].data?.data])
                .then((results) => {
                    if (results[0] && results[1])
                        setInitialValues((initialValues) => ({
                            ...initialValues,
                            enrollmentId: results[1].id,
                            classId: results[0].id,
                            className: results[0].name,
                            startDate: results[0].startDate,
                            startTime: results[0].startTime,
                            schedule: results[0].schedule,
                            userId: results[1].studentId,
                            name: results[1].student.user.name,
                            phone: results[1].student.user.contacts[0].phone,
                            gender: results[1].student.user.gender,
                            studentDescription: results[1].student.user.description,
                            contacts: results[1].student.user.contacts.filter(
                                (t) => t.isMainContact === false,
                            ),
                            enrollmentDescription: results[1].description,
                            desiredClassDescription: results[1].desiredClassDescription,
                            callingStatus: results[1].callingStatus,
                            attendantStatus: results[1].attendantStatus,
                            feeHaveToPay: results[1].feeHaveToPay,
                            feePaid: results[1].feePaid,
                        }));
                })
                .catch((err) => {
                    MessageBox.show({
                        content: 'We cannot find this enrollment record. Back to class management.',
                        messageType: MessageBox.MessageType.Error,
                        key: 'update-enroll',
                        onClose: () => {
                            props.history.push(`/classes/${classId}`);
                        },
                    });
                });
            setIsLoadingPreData(false);
        };
        if (classId && enrollmentId) {
            loadData(enrollmentId);
        }
    }, [classId, enrollmentId]);

    const onUpdate = async (value) => {
        // Set loading
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'update-enrollment',
        });

        await apiMethods.enrollment
            .updateRecord(value)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully. Redirecting to previous page...`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-enrollment',
                    onClose: () => {
                        props.history.push(`/classes/${classId}`);
                    },
                });
            })
            .catch((err) => {
                let messageContent = 'Cannot update at the moment! Try again later';
                if (err.response?.data && err.response?.data?.message) {
                    messageContent = err.response?.data?.message;
                }
                setIsLoading(false);
                MessageBox.show({
                    content: messageContent,
                    messageType: MessageBox.MessageType.Error,
                    key: 'update-enrollment',
                });
            });

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
                <Breadcrumb.Item>
                    <Link to={`/classes/${classId}`}>Enroll</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Update record</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader ghost={false} title="Update enroll record" />

            {initialValues.className && (
                <EnrollmentForm
                    submitButtonName="Update"
                    onSubmit={onUpdate}
                    initialValues={initialValues}
                    isLoadingPreData={isLoadingPreData}
                    isLoading={isLoading}
                />
            )}
            {!isLoadingPreData && !initialValues.className && (
                <NotFoundResult backPageName="Class Management" backUrl="/classes" />
            )}
        </>
    );
};

export default UpdateEnroll;
