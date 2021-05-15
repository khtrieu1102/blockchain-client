import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, Input } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';

const { Search } = Input;

const StudentTable = (props) => {
    const { data } = props;
    const [array, setArray] = useState(data);

    const onSearchByPhone = (value) => {
        if (!value) return setArray(data);
        const filteredData = data.filter((t) => t.phone.startsWith(value));
        setArray(filteredData);
    };

    return (
        <>
            <Search
                placeholder="search by phone number"
                onSearch={onSearchByPhone}
                style={{ width: 400, margin: '10px 0px' }}
            />

            <Table dataSource={array} rowKey="id">
                <Table.Column title="Id" dataIndex="id" key="id" />
                <Table.Column title="Full Name" dataIndex="name" key="name" />
                <Table.Column title="Username" dataIndex="username" key="username" />
                <Table.Column title="Gender" dataIndex="gender" key="gender" />
                <Table.Column title="Email" dataIndex="email" key="email" />
                <Table.Column title="Phone" dataIndex="phone" key="phone" />
                <Table.Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="small">
                            <Tooltip title="Edit student's info">
                                <Link to={`/students/${record.id}/edit`}>
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
                            {record.status !== 'deleted' && (
                                <Tooltip title="Delete this student">
                                    <Popconfirm
                                        placement="bottomRight"
                                        title="Are you sure delete this student?"
                                        onConfirm={() => console.log(record)}
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
                                        onClick={() => console.log(record)}
                                        icon={<UndoOutlined />}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </>
    );
};

export default StudentTable;
