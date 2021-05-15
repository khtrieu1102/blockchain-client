import React from 'react';
import { Form, Input, Descriptions, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const ClassInformation = (props) => {
    const { data, form } = props;
    return (
        <>
            <Text>{data.className} </Text>
            <Link to={`/classes/${data.id}/edit`}>
                <FontAwesomeIcon icon="pen" />
            </Link>
            {/* {!form && (
                <span>
                    {data.className}{' '}
                    <Link to={`/classes/${data.id}/edit`}>
                        <FontAwesomeIcon icon="pen" />
                    </Link>
                </span>
            )} */}
            <Descriptions>
                <Form.Item name="startDate" label="Starting Date">
                    <span className="ant-form-text">{new Date(data.startDate).toDateString()}</span>
                </Form.Item>
                <Form.Item name="startTime" label="Starting Time">
                    <span className="ant-form-text">
                        {new Date(data.startTime).toLocaleTimeString()}
                    </span>
                </Form.Item>
                <Form.Item name="schedule" label="Schedule">
                    <span className="ant-form-text">{data.schedule}</span>
                </Form.Item>
            </Descriptions>
        </>
    );
};

export default ClassInformation;
