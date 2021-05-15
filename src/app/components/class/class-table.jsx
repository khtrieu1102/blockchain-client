import React, { useEffect, useRef, useState } from 'react';
import { Table, PageHeader, Button, Space, Tooltip, Popconfirm, Breadcrumb, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { DeleteOutlined, EditOutlined, UndoOutlined, ContainerOutlined } from '@ant-design/icons';
import dateFormat from 'dateformat';
import enums from '../../enums';
import ClassDetailModal from './class-detail-modal';
import MessageBox from '../../helpers/MessageBox';
import apiMethods from '../../http-client/api-methods';

const ClassTable = (props) => {
    const { data, loadData } = props;
    const [modalDetail, setModalDetail] = useState({
        visible: false,
        data: {},
    });
    const onDelete = async (selectedValue) => {
        // Loading
        MessageBox.show({
            content: `Loading...`,
            messageType: MessageBox.MessageType.Loading,
            key: 'delete-class',
        });

        // Calling API
        await apiMethods.classInfo
            .deleteOneClass(selectedValue.id)
            .then((result) => {
                if (result.data && result.data.data && result.data.data.affectedRows > 0) {
                    MessageBox.show({
                        content: `Class ${selectedValue.name} has been deleted successfully!`,
                        messageType: MessageBox.MessageType.Success,
                        key: 'delete-class',
                    });
                    loadData();
                }
            })
            .catch((err) => {
                MessageBox.show({
                    content: `Fail! Please try again later!`,
                    messageType: MessageBox.MessageType.Error,
                    key: 'delete-class',
                });
            });
    };

    const onRecover = async (selectedValue) => {
        // Loading
        MessageBox.show({
            content: `Loading...`,
            messageType: MessageBox.MessageType.Loading,
            key: 'recover-class',
        });

        // Calling API
        await apiMethods.classInfo
            .recoverOneClass(selectedValue.id)
            .then((result) => {
                if (result.data && result.data.data && result.data.data.affectedRows > 0) {
                    MessageBox.show({
                        content: `Class ${selectedValue.name} has been recovered successfully!`,
                        messageType: MessageBox.MessageType.Success,
                        key: 'recover-class',
                    });
                    loadData();
                }
            })
            .catch((err) => {
                MessageBox.show({
                    content: `Fail! Please try again later!`,
                    messageType: MessageBox.MessageType.Error,
                    key: 'recover-class',
                });
            });
    };

    const newData =
        data.length > 0 &&
        data.map((singleClass, index) => {
            return {
                ...singleClass,
                className: singleClass.name,
            };
        });

    return (
        <>
            <Table dataSource={newData} rowKey="id">
                <Table.Column title="Id" dataIndex="id" key="id" />
                <Table.Column
                    title="Name"
                    dataIndex="name"
                    key="name"
                    render={(name, record) => {
                        return (
                            <Button
                                onClick={() => {
                                    setModalDetail({
                                        ...modalDetail,
                                        visible: !modalDetail.visible,
                                        data: record,
                                    });
                                }}
                            >
                                {name}
                            </Button>
                        );
                    }}
                />
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status) => {
                        let variantType = 'info';
                        switch (status) {
                            case enums.Status.Pending:
                                variantType = 'info';
                                break;
                            case enums.Status.Working:
                                variantType = 'primary';
                                break;
                            case enums.Status.Finished:
                                variantType = 'success';
                                break;
                            case enums.Status.Dropped:
                                variantType = 'danger';
                                break;
                            default:
                        }
                        return <Badge variant={variantType}>{status}</Badge>;
                    }}
                    filters={[
                        { text: enums.Status.Pending, value: enums.Status.Pending },
                        { text: enums.Status.Working, value: enums.Status.Working },
                        { text: enums.Status.Finished, value: enums.Status.Finished },
                        { text: enums.Status.Dropped, value: enums.Status.Dropped },
                        { text: enums.Status.Delayed, value: enums.Status.Delayed },
                    ]}
                    onFilter={(value, record) => {
                        return record.status.indexOf(value) === 0;
                    }}
                />
                <Table.Column title="Schedule" dataIndex="schedule" key="schedule" />
                <Table.Column
                    title="Starting Date"
                    dataIndex="startDate"
                    key="startDate"
                    render={(value) => {
                        return <>{dateFormat(new Date(value), 'dddd, dd/mm/yyyy')}</>;
                    }}
                    sorter={(a, b) => {
                        return new Date(b.startDate) - new Date(a.startDate);
                    }}
                />
                <Table.Column
                    title="Starting Time"
                    dataIndex="startTime"
                    key="startTime"
                    render={(value) => {
                        return <>{dateFormat(new Date(value), 'HH:MM')}</>;
                    }}
                />
                <Table.Column
                    title="Registered"
                    dataIndex="registered"
                    key="registered"
                    sorter={(a, b) => {
                        return a.registered - b.registered;
                    }}
                />
                <Table.Column
                    title="Attended"
                    dataIndex="attended"
                    key="attended"
                    sorter={(a, b) => {
                        return a.attended - b.attended;
                    }}
                />
                <Table.Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="small">
                            <Tooltip title="Edit this class' info">
                                <Link to={`/classes/${record.id}/edit`}>
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
                            <Tooltip title="Show class' list">
                                <Link to={`/classes/${record.id}`}>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        icon={<ContainerOutlined />}
                                    />
                                </Link>
                            </Tooltip>
                            {record.status !== 'deleted' && (
                                <Tooltip title="Delete this class">
                                    <Popconfirm
                                        placement="bottomRight"
                                        title="Are you sure delete this class?"
                                        onConfirm={() => onDelete(record)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="danger"
                                            shape="circle"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>
                                </Tooltip>
                            )}
                            {record.status === 'deleted' && (
                                <Tooltip title="Recover this class">
                                    <Button
                                        type="success"
                                        className="btn-success"
                                        shape="circle"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onClick={() => onRecover(record)}
                                        icon={<UndoOutlined />}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    )}
                />
            </Table>

            <ClassDetailModal
                modalDetail={modalDetail}
                handleOk={() => setModalDetail({ ...modalDetail, visible: !modalDetail.visible })}
                handleCancel={() =>
                    setModalDetail({ ...modalDetail, visible: !modalDetail.visible })
                }
            />
        </>
    );
};

export default ClassTable;
