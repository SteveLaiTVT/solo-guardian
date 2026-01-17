/**
 * @file SettingsPage.tsx
 * @description Admin settings page
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import React from 'react';
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd';

const { Title, Text } = Typography;

export function SettingsPage(): React.ReactElement {
  const [form] = Form.useForm();

  const handleSubmit = (): void => {
    message.success('Settings saved successfully');
  };

  return (
    <div>
      <Title level={4}>System Settings</Title>

      <Card title="Email Configuration" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="SMTP Host" name="smtpHost">
            <Input placeholder="smtp.example.com" />
          </Form.Item>
          <Form.Item label="SMTP Port" name="smtpPort">
            <Input placeholder="587" />
          </Form.Item>
          <Form.Item label="SMTP User" name="smtpUser">
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item label="SMTP Password" name="smtpPassword">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save Email Settings
          </Button>
        </Form>
      </Card>

      <Card title="SMS Configuration" style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Twilio Account SID" name="twilioSid">
            <Input placeholder="ACxxxxxxxxxx" />
          </Form.Item>
          <Form.Item label="Twilio Auth Token" name="twilioToken">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item label="Twilio Phone Number" name="twilioPhone">
            <Input placeholder="+1234567890" />
          </Form.Item>
          <Button type="primary">Save SMS Settings</Button>
        </Form>
      </Card>

      <Card title="System Information">
        <Text>Version: 1.0.0</Text>
        <Divider />
        <Text type="secondary">
          Solo Guardian Admin Panel - Manage users, alerts, and system settings.
        </Text>
      </Card>
    </div>
  );
}
