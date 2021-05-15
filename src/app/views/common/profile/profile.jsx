import React from "react";
import { Form, Input, Button, Tooltip } from "antd";
import { Card } from "react-bootstrap";

import "./profile.css";

const Profile = () => {
	const [form] = Form.useForm();

	const onFinish = (values) => {
		console.log(values);
	};

	return (
		<Card className="justify-content-md-center">
			{/* <Card.Header>
				<h4>Update your information</h4>
			</Card.Header> */}
			<Card.Body>
				<Card.Title>Form/Update your profile</Card.Title>
				<Form
					form={form}
					name="register"
					layout="vertical"
					onFinish={onFinish}
					size="large"
					requiredMark="optional"
					scrollToFirstError
				>
					<Form.Item
						name="email"
						label="E-mail"
						rules={[
							{
								type: "email",
								message: "The input is not valid E-mail!",
							},
							{
								required: true,
								message: "Please input your E-mail!",
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="nickname"
						label={
							<span>
								Nickname&nbsp;
								<Tooltip title="What do you want others to call you?">
									[?]
								</Tooltip>
							</span>
						}
						rules={[
							{
								required: true,
								message: "Please input your nickname!",
								whitespace: true,
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="nickname"
						label={
							<span>
								Nickname&nbsp;
								<Tooltip title="What do you want others to call you?">
									[?]
								</Tooltip>
							</span>
						}
						rules={[
							{
								required: true,
								message: "Please input your nickname!",
								whitespace: true,
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Register
						</Button>
					</Form.Item>
				</Form>
			</Card.Body>
		</Card>
	);
};

export default Profile;
