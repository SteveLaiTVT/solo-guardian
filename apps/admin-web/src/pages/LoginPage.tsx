/**
 * @file LoginPage.tsx
 * @description Admin login page
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/lib/api';
import { useAdminAuthStore } from '@/stores/auth.store';

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setTokens, setUser } = useAdminAuthStore();

  const onFinish = async (values: LoginForm): Promise<void> => {
    setLoading(true);
    try {
      const response = await adminApi.post('/auth/login', values);
      const responseData = response.data.data || response.data;
      const user = responseData.user;
      const tokens = responseData.tokens || responseData;
      const accessToken = tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      // Check if user has admin role
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        message.error('Access denied. Admin privileges required.');
        return;
      }

      setTokens(accessToken, refreshToken);
      setUser(user);
      message.success('Login successful');
      navigate('/admin');
    } catch (error) {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Solo Guardian Admin</Title>
          <Text type="secondary">Sign in to your admin account</Text>
        </div>
        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
