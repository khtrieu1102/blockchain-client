import React, { useState, useEffect } from 'react';
import { Form, Radio, Input, Button, DatePicker, TimePicker, Select } from 'antd';
import apiMethods from '../../http-client/api-methods';
import helpers from '../../helpers';
import _const from '../../assets/const';
import NotFoundResult from '../others/notfound-result';
import enums from '../../enums';

const ClassForm = (props) => {
    const { isLoading, isLoadingPreData } = props;
    const [form] = Form.useForm();
    const [ClassPlaces, setClassPlaces] = useState([]);
    const [ClassTypes, setClassTypes] = useState([]);
    const [ClassSequence, setClassSequence] = useState([]);
    const isEditing = props.submitButtonName === 'Update';

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                apiMethods.classInfo.getAllClassPlaces(),
                apiMethods.classInfo.getAllClassTypes(),
                apiMethods.classInfo.getClassPlaceTypeSequence(),
            ])
                .then((results) => [
                    results[0].data?.data,
                    results[1].data?.data,
                    results[2].data?.data,
                ])
                .then((results) => {
                    setClassPlaces(results[0]);
                    setClassTypes(results[1]);
                    setClassSequence(results[2]);
                })
                .catch((err) => {});
        };
        loadData();

        return () => {};
    }, []);

    useEffect(() => {
        if (ClassPlaces.length === 0 || ClassTypes.length === 0) return;
        if (!isEditing) {
            setName(1, 1);
        }
        return () => {};
    }, [ClassPlaces, ClassTypes, ClassSequence]);

    const setName = (placeId, typeId) => {
        const places = ClassPlaces.find((t) => t.id === placeId);
        const types = ClassTypes.find((t) => t.id === typeId);
        const sequence = sequenceWithClassTypePlace(places.id, types.id) || '';
        const name = places.code + types.code + sequence;
        form.setFieldsValue({
            name: name,
            sequence: sequence,
        });
    };

    const onClassPlaceChange = (value) => {
        const formValue = form.getFieldValue();
        setName(value.target.value, formValue.classTypeId);
    };

    const onClassTypeChange = (value) => {
        const formValue = form.getFieldValue();
        setName(formValue.classPlaceId, value.target.value);
    };

    const onClassSequenceChange = (value) => {
        const formValue = form.getFieldValue();
        const places = ClassPlaces.find((t) => t.id === formValue.classPlaceId);
        const types = ClassTypes.find((t) => t.id === formValue.classTypeId);
        const name = places.code + types.code + value.target.value;
        form.setFieldsValue({
            name: name,
        });
    };

    // Tìm sequence phù hợp cho lớp Type và Place, lọc từ data
    const sequenceWithClassTypePlace = (classPlaceId, classTypeId) => {
        var filteredArray = [];
        filteredArray = ClassSequence.filter(
            (t) => t.classPlaceId === classPlaceId && t.classTypeId === classTypeId,
        );

        // find the biggest sequence in filtered array
        const maxObject = filteredArray.reduce(
            (prev, current) => (prev.sequence > current.sequence ? prev : current),
            1,
        );
        if (maxObject.sequence) {
            return maxObject.sequence + 1 + '';
        }
        return 1;
    };

    const onFinishFailed = (errorInfo) => {};

    const onFinish = (value) => {
        const entity = {
            name: value.name,
            classPlaceId: value.classPlaceId,
            classTypeId: value.classTypeId,
            sequence: value.sequence * 1,
            status: value.status,
            schedule: value.schedule,
            startDate: helpers.convertDateTimeWithTimezoneForMySQLFormat(value.startDate._d),
            startTime: helpers.convertDateTimeWithTimezoneForMySQLFormat(value.startTime._d),
        };
        props.onSubmit(entity);
    };

    return (
        <>
            {props.initialValues && (
                <Form
                    {..._const.FormLayout}
                    form={form}
                    style={{ border: 'none' }}
                    layout="horizontal"
                    onFinish={onFinish}
                    initialValues={props.initialValues}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Status" name="status" required>
                        <Select placeholder="Select a option and change input text above">
                            <Select.Option value={enums.Status.Pending}>Pending</Select.Option>
                            <Select.Option value={enums.Status.Working}>Working</Select.Option>
                            <Select.Option value={enums.Status.Finished}>Finished</Select.Option>
                            <Select.Option value={enums.Status.Dropped}>Dropped</Select.Option>
                            <Select.Option value={enums.Status.Delayed}>Delayed</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Places"
                        name="classPlaceId"
                        rules={[{ required: true, message: 'Please input class place!' }]}
                    >
                        <Radio.Group onChange={onClassPlaceChange} disabled={isEditing}>
                            {ClassPlaces &&
                                ClassPlaces.map((place, index) => {
                                    return (
                                        <Radio.Button key={index} value={place.id}>
                                            {place.name}
                                        </Radio.Button>
                                    );
                                })}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Types"
                        name="classTypeId"
                        rules={[{ required: true, message: 'Please input class type!' }]}
                    >
                        <Radio.Group onChange={onClassTypeChange} disabled={isEditing}>
                            {ClassTypes &&
                                ClassTypes.map((type, index) => {
                                    return (
                                        <Radio.Button key={index} value={type.id}>
                                            {type.name}
                                        </Radio.Button>
                                    );
                                })}
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Sequence"
                        name="sequence"
                        onChange={onClassSequenceChange}
                        rules={[
                            {
                                required: true,
                                message: 'Sequence for this class is missing!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Sequence"
                            type="number"
                            style={{ width: '150px' }}
                            disabled={isEditing}
                        />
                    </Form.Item>
                    <Form.Item label="Name" name="name">
                        <Input placeholder="Class name" disabled />
                    </Form.Item>
                    <Form.Item label="Schedule" name="schedule">
                        <Input placeholder="3-5-7 or 2-4-6 or something else..." />
                    </Form.Item>
                    <Form.Item
                        label="Starting Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Starting date is missing!' }]}
                    >
                        <DatePicker format={_const.DateFormatType} />
                    </Form.Item>
                    <Form.Item
                        name="startTime"
                        label="Starting Time"
                        rules={[{ required: true, message: 'Starting time is missing!' }]}
                    >
                        <TimePicker format={_const.ClassTimeFormatType} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={isLoading}>
                            {props.submitButtonName}
                        </Button>
                    </Form.Item>
                </Form>
            )}
            {!props.initialValues && !isLoadingPreData && (
                <NotFoundResult
                    subTitle="Sorry, we cannot find this class."
                    backPageName="Class Management"
                    backUrl="/classes"
                />
            )}
        </>
    );
};

export default ClassForm;
