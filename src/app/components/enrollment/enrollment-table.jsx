import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, Popover } from 'antd';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SendOutlined, UndoOutlined } from '@ant-design/icons';
import enums from '../../enums';
import helpers from '../../helpers';
import EnrollmentClassUpdateModal from './enrollment-class-update-modal';
import { FaChevronCircleDown } from 'react-icons/fa';

const EnrollmentTable = (props) => {
    const { loadData, data, classData, updateCallingStatus } = props;
    const [updateClassModalVisible, setUpdateClassModalVisible] = useState(false);
    const [studentData, setStudentData] = useState('');
    const [enrollmentData, setEnrollmentData] = useState('');
    const filteredArray = data
        ? data.map((item, index) => {
              return {
                  ...item,
                  studentName: item.student.name,
                  phone: item.student.contacts[0].phone,
              };
          })
        : [];

    return (
        <React.Fragment>
            <Table dataSource={filteredArray} rowKey="id">
                <Table.Column
                    title="#"
                    key="counting"
                    render={(text, record, index) => index + 1}
                />
                <Table.Column title="Student" dataIndex="studentName" key="studentName" />
                {classData.status !== enums.Status.Working && (
                    <>
                        <Table.Column title="Phone" dataIndex="phone" key="phone" />
                        <Table.Column
                            title="Description"
                            dataIndex="description"
                            key="description"
                        />
                        <Table.Column
                            title="Calling"
                            dataIndex="callingStatus"
                            key="callingStatus"
                            render={(status, record) => {
                                let variantType = 'info';
                                let countPending = 0;
                                if (status.toLowerCase().startsWith('ok')) {
                                    variantType = 'success';
                                } else if (status.toLowerCase().startsWith('failed')) {
                                    variantType = 'danger';
                                } else {
                                    variantType = 'info';
                                    countPending = parseInt(status.split(' ')[1] || '0');
                                }
                                return (
                                    <>
                                        <Space>
                                            <Popover
                                                title="Update status with?"
                                                trigger="click"
                                                placement="bottom"
                                                content={
                                                    <Space>
                                                        <Button
                                                            type="primary"
                                                            disabled={status
                                                                .toLowerCase()
                                                                .startsWith('ok')}
                                                            onClick={() =>
                                                                updateCallingStatus('OK', record)
                                                            }
                                                        >
                                                            OK
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                updateCallingStatus(
                                                                    `Pending ${countPending + 1}`,
                                                                    record,
                                                                )
                                                            }
                                                        >
                                                            Pending {countPending + 1}
                                                        </Button>
                                                        <Button
                                                            type="danger"
                                                            disabled={status
                                                                .toLowerCase()
                                                                .startsWith('failed')}
                                                            onClick={() =>
                                                                updateCallingStatus(
                                                                    'Failed',
                                                                    record,
                                                                )
                                                            }
                                                        >
                                                            Failed
                                                        </Button>
                                                    </Space>
                                                }
                                            >
                                                <FaChevronCircleDown size={15} />
                                            </Popover>
                                            <Badge variant={variantType}>{status}</Badge>
                                        </Space>
                                    </>
                                );
                            }}
                            filters={[
                                {
                                    text: enums.CallingStatus.Pending,
                                    value: enums.CallingStatus.Pending,
                                },
                                { text: enums.CallingStatus.OK, value: enums.CallingStatus.OK },
                                { text: enums.CallingStatus.Drop, value: enums.CallingStatus.Drop },
                                {
                                    text: enums.CallingStatus.Other,
                                    value: enums.CallingStatus.Other,
                                },
                            ]}
                            onFilter={(value, record) => {
                                return record.callingStatus.indexOf(value) === 0;
                            }}
                        />
                    </>
                )}
                <Table.Column
                    title="Status"
                    dataIndex="attendantStatus"
                    key="attendantStatus"
                    render={(status) => {
                        let variantType = 'info';
                        switch (status) {
                            case enums.Status.Other:
                                variantType = 'info';
                                break;
                            case enums.Status.Pending:
                                variantType = 'primary';
                                break;
                            case enums.Status.OK:
                                variantType = 'success';
                                break;
                            case enums.Status.Drop:
                                variantType = 'danger';
                                break;
                            default:
                        }
                        return <Badge variant={variantType}>{status}</Badge>;
                    }}
                    filters={[
                        { text: enums.CallingStatus.Pending, value: enums.CallingStatus.Pending },
                        { text: enums.CallingStatus.OK, value: enums.CallingStatus.OK },
                        { text: enums.CallingStatus.Drop, value: enums.CallingStatus.Drop },
                        { text: enums.CallingStatus.Other, value: enums.CallingStatus.Other },
                    ]}
                    onFilter={(value, record) => {
                        return record.attendantStatus.indexOf(value) === 0;
                    }}
                />
                <Table.Column
                    title="Fee status"
                    key="action"
                    render={(text, record) => (
                        <span>
                            {helpers.ValueInCurrency(record.feePaid)} over{' '}
                            {helpers.ValueInCurrency(record.feeHaveToPay)}
                        </span>
                    )}
                />
                <Table.Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="small">
                            <Tooltip title="Edit record's info">
                                <Link to={`/classes/${record.classId}/enrollments/${record.id}`}>
                                    <Button
                                        key={`edit`}
                                        type="info"
                                        shape="circle"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        icon={<EditOutlined />}
                                    />
                                </Link>
                            </Tooltip>
                            <Tooltip title="Move to another class">
                                <Button
                                    key={`edit`}
                                    type="success"
                                    className="btn-success"
                                    shape="circle"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    icon={<SendOutlined />}
                                    onClick={() => {
                                        setStudentData(record);
                                        setEnrollmentData(record);
                                        setUpdateClassModalVisible(true);
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    )}
                />
            </Table>
            <EnrollmentClassUpdateModal
                visible={updateClassModalVisible}
                loadData={loadData}
                classData={classData}
                studentData={studentData}
                enrollmentData={enrollmentData}
                handleOk={() => {
                    setUpdateClassModalVisible(false);
                }}
                handleCancel={() => {
                    setUpdateClassModalVisible(false);
                }}
            />
        </React.Fragment>
    );
};

export default EnrollmentTable;
