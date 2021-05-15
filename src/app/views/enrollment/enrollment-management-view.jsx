import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Breadcrumb, Result } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';
import ClassInformation from '../../components/class/class-information';
import EnrollmentTable from '../../components/enrollment/enrollment-table';
import enums from '../../enums';
import MessageBox from '../../helpers/MessageBox';

const EnrollManagement = (props) => {
    const [enrollmentData, setEnrollmentData] = useState('');
    const [classData, setClassData] = useState(null);
    const [isLoadingPreData, setIsLoadingPreData] = useState(true);

    const loadData = async () => {
        setIsLoadingPreData(true);
        // Get class data then get enroll data
        await Promise.all([
            apiMethods.classInfo.getMoreInfoByClassId(props.match.params.classId),
            apiMethods.enrollment.getEnrollmentRecordsWithClassId(props.match.params.classId),
        ])
            .then((results) => [results[0].data.data, results[1].data.data])
            .then((results) => {
                setIsLoadingPreData(false);
                setClassData({
                    ...results[0],
                    className: results[0].name,
                });
                setEnrollmentData(results[1]);
            })
            .catch((err) => {
                setIsLoadingPreData(false);
            });
    };

    const updateCallingStatusForEnrollmentRecord = async (value, record) => {
        const entity = {
            enrollmentId: record.id,
            enrollment: {
                callingStatus: value,
            },
        };
        await apiMethods.enrollment
            .updateRecord(entity)
            .then(() => {
                MessageBox.show({
                    content: `Updated successfully!`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-calling',
                });
                loadData();
            })
            .catch(() => {
                MessageBox.show({
                    content: `Cannot update record!`,
                    messageType: MessageBox.MessageType.Error,
                    key: 'update-calling',
                });
            });
    };

    useEffect(() => {
        if (props.match.params.classId) loadData();
    }, [props.match.params]);

    return (
        <>
            {classData && (
                <React.Fragment>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/classes">Classes Management</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{classData.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <PageHeader
                        ghost={false}
                        title={<ClassInformation data={classData} />}
                        subTitle={isLoadingPreData ? "We're fetching data..." : ''}
                        extra={
                            classData && [
                                <Link to={`/classes/${classData.id}/assign`}>
                                    <Button key="add-new-assign">Assign</Button>
                                </Link>,
                                <Link to={`/classes/${classData.id}/new-enroll`}>
                                    <Button key="add-new-enrollment" type="primary">
                                        Add enrollment
                                    </Button>
                                </Link>,
                                <Link
                                    className={
                                        classData.status === enums.Status.Working ? '' : 'hidden'
                                    }
                                    to={`/classes/${classData.id}/lesson`}
                                >
                                    <Button key="add-new-lesson" type="primary">
                                        New lesson
                                    </Button>
                                </Link>,
                            ]
                        }
                    >
                        <EnrollmentTable
                            data={enrollmentData}
                            updateCallingStatus={updateCallingStatusForEnrollmentRecord}
                            classData={classData}
                            loadData={loadData}
                        />
                    </PageHeader>
                </React.Fragment>
            )}
            {!classData && !isLoadingPreData && (
                <Result
                    status="404"
                    title="Not found"
                    subTitle="Sorry, we cannot find this class."
                    extra={
                        <Link to="/classes">
                            <Button type="primary">Back to Class Management</Button>
                        </Link>
                    }
                />
            )}
        </>
    );
};

export default EnrollManagement;
