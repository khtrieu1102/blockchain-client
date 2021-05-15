import React from 'react';
import { Modal, Descriptions } from 'antd';
import dateFormat from 'dateformat';
import ClassInformation from './class-information';

const ClassDetailModal = ({ modalDetail, handleOk, handleCancel }) => {
    const { visible, data } = modalDetail;

    return (
        <Modal
            title={data.name}
            width={650}
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <ClassInformation data={data} />
            {/* <Descriptions title="Class Info" layout="vertical">
                <Descriptions.Item label="Class Name">{data.name}</Descriptions.Item>
                <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
                <Descriptions.Item label="Schedule">{data.schedule}</Descriptions.Item>
                <Descriptions.Item label="Date" span={2}>
                    <p>{dateFormat(new Date(data.startDate), 'dddd, dd/mm/yyyy')}</p>
                </Descriptions.Item>
                <Descriptions.Item label="Time">
                    {dateFormat(new Date(data.startTime), 'HH:MM')}
                </Descriptions.Item>
            </Descriptions> */}
        </Modal>
    );
};

export default ClassDetailModal;
