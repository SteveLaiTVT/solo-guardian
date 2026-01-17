/**
 * @file AlertsPage.tsx
 * @description Admin alerts management page
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import React, { useState } from 'react';
import { Table, Card, Select, Tag, Typography, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { adminApiEndpoints } from '@/lib/api';

const { Title } = Typography;

export function AlertsPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'alerts', { page, status: statusFilter }],
    queryFn: () => adminApiEndpoints.getAlerts({ page, limit: 10, status: statusFilter }),
  });

  const columns = [
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
    {
      title: 'Resolved At',
      dataIndex: 'resolvedAt',
      key: 'resolvedAt',
      render: (date: string | null): string =>
        date ? new Date(date).toLocaleString() : '-',
    },
  ];

  return (
    <div>
      <Title level={4}>Alerts Management</Title>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 200 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'triggered', label: 'Triggered' },
              { value: 'notified', label: 'Notified' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={data?.data?.alerts || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            total: data?.data?.total || 0,
            pageSize: 10,
            onChange: setPage,
          }}
        />
      </Card>
    </div>
  );
}
