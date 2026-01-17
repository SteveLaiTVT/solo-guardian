/**
 * @file DashboardPage.tsx
 * @description Admin dashboard with system statistics
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Tag, Spin } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { adminApiEndpoints, AlertSummary } from '@/lib/api';

const { Title } = Typography;

export function DashboardPage(): React.ReactElement {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => adminApiEndpoints.getDashboardStats(),
  });

  const { data: recentAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['admin', 'alerts', 'recent'],
    queryFn: () => adminApiEndpoints.getAlerts({ limit: 5 }),
  });

  const alertColumns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string): React.ReactElement => {
        const colorMap: Record<string, string> = {
          triggered: 'orange',
          notified: 'blue',
          resolved: 'green',
          expired: 'gray',
        };
        return <Tag color={colorMap[status] || 'default'}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Triggered At',
      dataIndex: 'triggeredAt',
      key: 'triggeredAt',
      render: (date: string): string => new Date(date).toLocaleString(),
    },
  ];

  if (statsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const dashboardStats = stats?.data || {
    totalUsers: 0,
    activeUsers: 0,
    todayCheckIns: 0,
    pendingAlerts: 0,
    checkInRate: 0,
  };

  return (
    <div>
      <Title level={4}>Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboardStats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={dashboardStats.activeUsers}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Check-ins"
              value={dashboardStats.todayCheckIns}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Alerts"
              value={dashboardStats.pendingAlerts}
              prefix={<AlertOutlined />}
              valueStyle={{ color: dashboardStats.pendingAlerts > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Check-in Rate">
            <Statistic
              value={dashboardStats.checkInRate}
              suffix="%"
              precision={1}
              valueStyle={{ color: dashboardStats.checkInRate >= 80 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Alerts">
            <Table
              columns={alertColumns}
              dataSource={recentAlerts?.data?.alerts || []}
              rowKey="id"
              pagination={false}
              loading={alertsLoading}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
