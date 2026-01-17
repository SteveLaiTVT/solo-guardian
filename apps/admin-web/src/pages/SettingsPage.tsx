/**
 * @file SettingsPage.tsx
 * @description Admin settings page - system information
 * @task TASK-046
 * @design_state_version 3.9.0
 */
import React from 'react';
import { Card, Typography, Divider, Descriptions, Tag } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export function SettingsPage(): React.ReactElement {
  return (
    <div>
      <Title level={4}>System Settings</Title>

      <Card title="System Information" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Version">
            <Tag color="blue">1.0.0</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Environment">
            <Tag color="green">Production</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="API Status">
            <Tag icon={<CheckCircleOutlined />} color="success">
              Connected
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <span>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            Configuration Notes
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        <Paragraph>
          <Text strong>Email & SMS Configuration</Text>
        </Paragraph>
        <Paragraph type="secondary">
          Email (SMTP) and SMS (Twilio) settings are configured via environment variables
          on the server. Contact your system administrator to modify these settings.
        </Paragraph>
        <Divider />
        <Paragraph>
          <Text strong>Required Environment Variables:</Text>
        </Paragraph>
        <ul style={{ color: '#666' }}>
          <li><Text code>SMTP_HOST</Text> - SMTP server hostname</li>
          <li><Text code>SMTP_PORT</Text> - SMTP server port</li>
          <li><Text code>SMTP_USER</Text> - SMTP username</li>
          <li><Text code>SMTP_PASS</Text> - SMTP password</li>
          <li><Text code>TWILIO_ACCOUNT_SID</Text> - Twilio account SID</li>
          <li><Text code>TWILIO_AUTH_TOKEN</Text> - Twilio auth token</li>
          <li><Text code>TWILIO_PHONE_NUMBER</Text> - Twilio phone number</li>
        </ul>
      </Card>

      <Card title="About Solo Guardian">
        <Paragraph>
          <Text strong>Solo Guardian (独居守护)</Text> is a safety check-in application
          designed for people living alone. If users don't check in daily, their
          emergency contacts are notified via email or SMS.
        </Paragraph>
        <Divider />
        <Paragraph type="secondary">
          Admin Panel - Manage users, alerts, and message templates.
        </Paragraph>
      </Card>
    </div>
  );
}
