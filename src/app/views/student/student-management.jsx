import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import apiMethods from '../../http-client/api-methods';
import StudentTable from '../../components/student/student-table';

const StudentManagement = (props) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await apiMethods.student
                .getAll()
                .then((result) => result.data.data)
                .then((result) => {
                    setIsLoading(false);

                    let data = result
                        ? result.map((item) => {
                              const userMainContact = item.user.contacts.find(
                                  (t) => t.isMainContact === true,
                              );
                              return {
                                  ...item.user,
                                  id: item.userId,
                                  phone: userMainContact.phone,
                              };
                          })
                        : [];

                    setData(data);
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        };
        loadData();
        return () => {};
    }, []);

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Students Management</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                ghost={false}
                title="Student Management"
                subTitle={isLoading ? "We're fetching data..." : ''}
                extra={[
                    <Button key="other">Other</Button>,
                    <Link to="/students/create" key="create-student">
                        <Button key="add-new-class" type="primary">
                            New student
                        </Button>
                    </Link>,
                ]}
            />
            {data && <StudentTable data={data} />}
        </>
    );
};

export default StudentManagement;
