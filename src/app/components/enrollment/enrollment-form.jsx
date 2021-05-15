import React, { useEffect, useRef, useState } from 'react';
import { Form, Radio, Input, Button, Result, Divider, Descriptions, Select } from 'antd';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StudentMustHaveForm from '../student/student-musthave-form';
import ClassInformation from '../../components/class/class-information';
import _const from '../../assets/const';
import MessageBox from '../../helpers/MessageBox';
import NotFoundResult from '../others/notfound-result';
import enums from '../../enums';
import helpers from '../../helpers';

const EnrollmentForm = (props) => {
    const { initialValues, isLoadingPreData, isLoading } = props;
    const [form] = Form.useForm();
    const [readOnly, setReadOnly] = useState(true);
    const [phoneIsValid, setPhoneIsValid] = useState(true);

    const mountedRef = useRef(true);

    const isEditing = props.submitButtonName === 'Update';

    useEffect(() => {
        if (!mountedRef.current) return;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        const fullContacts =
            value.contacts && value.contacts.length !== 0
                ? value.contacts.map((item) => {
                      if (value.phone === item.phone) {
                          return MessageBox.show({
                              content: 'Extra contact number conflicts with main contact',
                              messageType: MessageBox.MessageType.Error,
                              key: 'student-form',
                          });
                      }
                      return {
                          ...item,
                          isMainContact: false,
                      };
                  })
                : [];
        // Prepare model
        let entity = {
            enrollmentId: initialValues.enrollmentId,
            user: {
                name: value.name,
                password: '123',
                gender: value.gender,
                description: value.studentDescription,
            },
            mainContact: {
                phone: value.phone,
                isMainContact: true,
            },
            contacts: fullContacts,
            enrollment: {
                studentId: value.userId || null, // from musthave student form
                classId: initialValues.classId,
                desiredClassDescription: value.desiredClassDescription,
                description: value.enrollmentDescription,
                callingStatus: value.callingStatus,
                attendantStatus: value.attendantStatus,
                feeHaveToPay: value.feeHaveToPay,
                feePaid: value.feePaid,
            },
        };

        props.onSubmit(entity);
    };

    const onPhoneNumberChange = async (event) => {
        const result = await helpers.checkPhoneIsExistAsMain(event.target.value);
        switch (result.flag) {
            case enums.PhoneStatus.PHONE_WAS_NOT_USED:
                updateMustHaveForm('', '', '');
                setPhoneIsValid(true);
                setReadOnly(false);
                break;
            case enums.PhoneStatus.PHONE_IS_INVALID:
                updateMustHaveForm('', '', '');
                setReadOnly(true);
                setPhoneIsValid(false);
                break;
            case enums.PhoneStatus.PHONE_USER_IS_NOT_STUDENT:
                updateMustHaveForm('', '', '');
                setReadOnly(true);
                setPhoneIsValid(false);
                break;
            case enums.PhoneStatus.PHONE_USER_IS_STUDENT:
                updateMustHaveForm(
                    result.data.name,
                    result.data.gender,
                    result.data.userId,
                    result.data.contacts,
                );
                setReadOnly(true);
                setPhoneIsValid(true);
                break;
            default:
        }
    };

    const updateMustHaveForm = (name, gender, id, contacts) => {
        form.setFieldsValue({
            name: name,
            gender: gender,
            userId: id,
            contacts: contacts,
        });
    };

    return (
        <Card className="justify-content-md-center">
            <Card.Body>
                {initialValues && initialValues.className && (
                    <Form
                        {..._const.FormLayout}
                        form={form}
                        layout="horizontal"
                        initialValues={initialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Divider orientation="left">Class Information</Divider>
                        <ClassInformation data={initialValues} />

                        <StudentMustHaveForm
                            form={form}
                            initialValues={initialValues}
                            isEditing={isEditing}
                            onPhoneNumberChange={onPhoneNumberChange}
                            readOnly={readOnly}
                            phoneIsValid={phoneIsValid}
                        />

                        <Divider orientation="left">Enrollment information</Divider>
                        <Form.Item label="Description" name="enrollmentDescription">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="Class description" name="desiredClassDescription">
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item label="Calling status" name="callingStatus">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Attendance status" name="attendantStatus">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Fee have to pay" name="feeHaveToPay">
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item label="Fee paid" name="feePaid">
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isLoading}>
                                {props.submitButtonName}
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                {!initialValues && !isLoadingPreData && (
                    <NotFoundResult
                        subTitle="Sorry, we cannot find this class."
                        backPageName="Class Management"
                        backUrl="/classes"
                    />
                )}
            </Card.Body>
        </Card>
    );
};

export default EnrollmentForm;
