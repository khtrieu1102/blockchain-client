import React, { useState, useEffect } from 'react';
import { Modal, Form, Descriptions, Select, Divider, Checkbox, Radio, Input, Space } from 'antd';
import dateFormat from 'dateformat';
import _const from '../../assets/const';
import apiMethods from '../../http-client/api-methods';
import MessageBox from '../../helpers/MessageBox';

const EnrollmentClassUpdateModal = (props) => {
    const { visible, studentData, loadData, classData, handleOk, handleCancel, enrollmentData } =
        props;
    const [_allWorkingClasses, setAllWorkingClasses] = useState([]);
    const [feeRadioValue, setFeeRadioValue] = useState('current');
    const [typedFeePay, setTypedFeePay] = useState('0');
    const [selectedClass, setSelectedClass] = useState({
        startTime: '',
        startDate: '',
        schedule: '',
        feeToPay: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const loadAllClasses = async () => {
            // Get class data then get enroll data
            await apiMethods.classInfo
                .getAllClasses()
                .then((result) => result.data.data)
                .then((result) => {
                    result = result.filter((t) => t.id !== classData.id);
                    setAllWorkingClasses(result);
                })
                .catch((err) => {});
        };
        loadAllClasses();
    }, []);

    const onSubmit = async () => {
        // Check valid class
        if (!selectedClass.id) return;

        let feeValue = '0';
        switch (feeRadioValue) {
            case 'default':
                feeValue = selectedClass.classType?.feePay || '0';
                break;
            case 'current':
                feeValue = enrollmentData.feeHaveToPay || '0';
                break;
            case 'other':
                feeValue = typedFeePay;
                break;
            default:
        }

        // Prepare sending model
        const entity = {
            enrollmentId: enrollmentData.id,
            enrollment: {
                classId: selectedClass.id,
                feeHaveToPay: feeValue,
            },
        };

        // Set loading for button disable
        setIsLoading(true);
        MessageBox.show({
            content: 'Loading...',
            messageType: MessageBox.MessageType.Loading,
            key: 'update-enrollment',
        });

        await apiMethods.enrollment
            .updateRecord(entity)
            .then((result) => {
                MessageBox.show({
                    content: `Updated successfully!`,
                    messageType: MessageBox.MessageType.Success,
                    key: 'update-enrollment',
                });
                loadData();
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
        handleOk();
    };

    const handleChange = (classId) => {
        const item = _allWorkingClasses.find((t) => t.id === classId);
        setSelectedClass(item);
        setFeeRadioValue('current');
    };

    return (
        <Modal
            title="Update enrollment class for student"
            width={1000}
            visible={visible}
            onOk={onSubmit}
            okText="Move"
            onCancel={handleCancel}
            okButtonProps={{ disabled: isLoading === true || selectedClass.startTime === '' }}
        >
            <Form {..._const.FormLayout} form={form} layout="horizontal">
                {_allWorkingClasses.length >= 0 && (
                    <Form.Item
                        name="className"
                        label="Class Name"
                        rules={[{ required: true, message: 'Please input class type!' }]}
                    >
                        <Select onChange={handleChange}>
                            {_allWorkingClasses.length !== 0 &&
                                _allWorkingClasses.map((singleClass, index) => {
                                    return (
                                        <Select.Option key={singleClass.id} value={singleClass.id}>
                                            {singleClass.name}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                )}
                <Descriptions>
                    <Form.Item name="startDate" label="Starting Date">
                        <span className="ant-form-text">
                            {new Date(selectedClass.startDate).toDateString()}
                        </span>
                    </Form.Item>
                    <Form.Item name="startTime" label="Starting Time">
                        <span className="ant-form-text">
                            {new Date(selectedClass.startTime).toLocaleTimeString()}
                        </span>
                    </Form.Item>
                    <Form.Item name="schedule" label="Schedule">
                        <span className="ant-form-text">{selectedClass.schedule}</span>
                    </Form.Item>
                </Descriptions>
                <Divider orientation="left">More detailed information</Divider>

                <Form.Item name="feeHaveToPay" label="Fee to pay">
                    <Radio.Group
                        onChange={(e) => {
                            setFeeRadioValue(e.target.value); // toggle input
                        }}
                        value={feeRadioValue}
                    >
                        <Space direction="vertical">
                            <Radio value="default">
                                {selectedClass.classType?.feePay || '0'} vnđ (default)
                            </Radio>
                            <Radio value="current">
                                {enrollmentData.feeHaveToPay} vnđ (current)
                            </Radio>
                            <Radio value="other">
                                Other value...
                                {feeRadioValue === 'other' ? (
                                    <Input
                                        onChange={(e) => setTypedFeePay(e.target.value)}
                                        style={{ width: 100, marginLeft: 10 }}
                                    />
                                ) : null}
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EnrollmentClassUpdateModal;
