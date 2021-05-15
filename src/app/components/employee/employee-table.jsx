import React from 'react';
import { Table, Button, Space, Tooltip, Popconfirm } from 'antd';
import { StopOutlined, UndoOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const EmployeeTable = (props) => {
    const { data, updateStatus } = props;

    return (
        <Table dataSource={data} rowKey="id">
            <Table.Column title="Id" dataIndex="id" key="id" />
            <Table.Column title="Full Name" dataIndex="name" key="name" />
            <Table.Column title="Username" dataIndex="username" key="username" />
            <Table.Column title="Gender" dataIndex="gender" key="gender" />
            <Table.Column title="Role" dataIndex="role" key="role" />
            <Table.Column title="Email" dataIndex="email" key="email" />
            <Table.Column title="Phone" dataIndex="mainContact" key="mainContact" />
            <Table.Column
                title="Action"
                key="action"
                render={(text, record) => (
                    <Space size="small">
                        <Tooltip title="Edit student's info">
                            <Link to={`/employees/${record.id}/edit`}>
                                <Button
                                    key={`edit ${record.id}'s info`}
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
                        {record.isDisabled === false && (
                            <Tooltip title="Disable">
                                <Popconfirm
                                    placement="bottomRight"
                                    title="Are you sure disable this user?"
                                    onConfirm={() => updateStatus(record.id, true)}
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
                                        icon={<StopOutlined />}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}
                        {record.isDisabled === true && (
                            <Tooltip title="Enable">
                                <Button
                                    type="success"
                                    className="btn-success"
                                    shape="circle"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onClick={() => updateStatus(record.id, false)}
                                    icon={<UndoOutlined />}
                                />
                            </Tooltip>
                        )}
                    </Space>
                )}
            />
        </Table>
    );
};

export default EmployeeTable;
