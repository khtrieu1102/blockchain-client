import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import helpers from '../../helpers';
import _const from '../../assets/const';
import enums from '../../enums';
import MessageBox from '../../helpers/MessageBox';
import NotFoundResult from '../others/notfound-result';

const ChangeMainContactForm = (props) => {
    const { isLoading, onSubmit, currentPhone } = props;
    const [form] = Form.useForm();
    const [phoneIsValid, setPhoneIsValid] = useState();

    useEffect(() => {
        return () => {};
    }, []);

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        const phone = value.phone;
        // check new passwords matched
        if (phoneIsValid === false)
            return MessageBox.show({
                content: 'Phone is used',
                messageType: MessageBox.MessageType.Error,
                key: 'employee',
            });

        onSubmit(phone);
    };

    const checkPhoneValid = async (event) => {
        const result = await helpers.checkPhoneIsExistAsMain(event.target.value);
        switch (result.flag) {
            case enums.PhoneStatus.PHONE_WAS_NOT_USED:
                MessageBox.show({
                    content: 'We can use this phone!',
                    messageType: MessageBox.MessageType.Success,
                    key: 'change-main-contact',
                });
                setPhoneIsValid(true);
                break;
            case enums.PhoneStatus.PHONE_IS_INVALID:
                MessageBox.show({
                    content: 'Phone is invalid format!',
                    messageType: MessageBox.MessageType.Error,
                    key: 'change-main-contact',
                });
                setPhoneIsValid(false);
                break;
            case enums.PhoneStatus.PHONE_USER_IS_NOT_STUDENT:
            case enums.PhoneStatus.PHONE_USER_IS_STUDENT:
            default:
                MessageBox.show({
                    content: 'Phone is used by another user!',
                    messageType: MessageBox.MessageType.Error,
                    key: 'change-main-contact',
                });
                setPhoneIsValid(false);
                break;
        }
    };

    return (
        <>
            {currentPhone && (
                <Form
                    {..._const.FormLayout}
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Current main contact" name="current">
                        <span>{currentPhone}</span>
                    </Form.Item>
                    <Form.Item
                        label="Main contact"
                        name="phone"
                        hasFeedback
                        validateStatus={
                            phoneIsValid === null
                                ? ''
                                : phoneIsValid === false
                                ? 'error'
                                : 'success'
                        }
                        rules={[
                            { required: true, message: 'Please input your current main contact!' },
                        ]}
                    >
                        <Input
                            placeholder="New main contact"
                            minLength={10}
                            onBlur={checkPhoneValid}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isLoading || !phoneIsValid}
                        >
                            {props.submitButtonName}
                        </Button>
                    </Form.Item>
                </Form>
            )}
            {!currentPhone && (
                <NotFoundResult
                    subTitle="Sorry, we cannot find this student."
                    backPageName="Student Management"
                    backUrl="/students"
                />
            )}
        </>
    );
};

export default ChangeMainContactForm;
