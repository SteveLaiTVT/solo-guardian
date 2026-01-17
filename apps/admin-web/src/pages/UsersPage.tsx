/**
 * @file UsersPage.tsx
 * @description Admin users management page
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import React, { useState } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Descriptions,
  message,
} from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiEndpoints, UserSummary, UserDetail, UserStatus } from '@/lib/api';

const { Title } = Typography;

export function UsersPage(): React.ReactElement {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { page, search: searchText }],
    queryFn: () => adminApiEndpoints.getUsers({ page, limit: 10, search: searchText }),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminApiEndpoints.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      message.success('User status updated');
    },
    onError: () => {
      message.error('Failed to update user status');
    },
  });

  const handleViewUser = async (userId: string): Promise<void> => {
    try {
      const response = await adminApiEndpoints.getUser(userId);
      setSelectedUser(response.data);
      setDetailModalOpen(true);
    } catch {
      message.error('Failed to load user details');
    }
  };

  const handleToggleStatus = (user: UserSummary): void => {
    const newStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    Modal.confirm({
      title: `${newStatus === 'suspended' ? 'Suspend' : 'Activate'} User`,
      content: `Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} ${user.name}?`,
      onOk: () => suspendMutation.mutate({ id: user.id, status: newStatus }),
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string): React.ReactElement => {
        const colorMap: Record<string, string> = {
          active: 'green',
          suspended: 'red',
          deleted: 'gray',
        };
        return <Tag color={colorMap[status] || 'default'}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Last Check-in',
      dataIndex: 'lastCheckIn',
      key: 'lastCheckIn',
      render: (date: string | null): string =>
        date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string): string => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: UserSummary): React.ReactElement => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewUser(record.id)}
          >
            View
          </Button>
          <Button
            icon={<StopOutlined />}
            size="small"
            danger={record.status === 'active'}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>User Management</Title>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={data?.data?.users || []}
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

      <Modal
        title="User Details"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{selectedUser.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                {selectedUser.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Check-in Settings">
              {selectedUser.checkInSettings ? (
                <>
                  Deadline: {selectedUser.checkInSettings.deadlineTime},
                  Reminder: {selectedUser.checkInSettings.reminderTime},
                  Timezone: {selectedUser.checkInSettings.timezone}
                </>
              ) : (
                'Not configured'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contacts">
              {selectedUser.emergencyContactsCount}
            </Descriptions.Item>
            <Descriptions.Item label="Total Check-ins">
              {selectedUser.totalCheckIns}
            </Descriptions.Item>
            <Descriptions.Item label="Alerts Count">
              {selectedUser.alertsCount}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedUser.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
