/**
 * @file EarlyWarningsPage.tsx
 * @description Admin page for monitoring at-risk users and early warnings
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  message,
  Tabs,
  Tag,
  Space,
  Popconfirm,
  Switch,
  Tooltip,
  Alert,
  Statistic,
  Row,
  Col,
  Badge,
  List,
  Avatar,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  UserOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { adminApi } from '@/lib/api';

const { Title, Text } = Typography;

// Warning severity levels
const SEVERITY_CONFIG = {
  low: { color: 'blue', label: 'Low', icon: <ExclamationCircleOutlined /> },
  medium: { color: 'orange', label: 'Medium', icon: <WarningOutlined /> },
  high: { color: 'red', label: 'High', icon: <ExclamationCircleOutlined /> },
  critical: { color: 'magenta', label: 'Critical', icon: <ExclamationCircleOutlined /> },
};

// Warning rule types
const RULE_TYPES = [
  {
    value: 'consecutive_missed',
    label: 'Consecutive Missed Check-ins',
    description: 'Triggers when a user misses X consecutive check-ins',
  },
  {
    value: 'late_checkin_pattern',
    label: 'Late Check-in Pattern',
    description: 'Triggers when a user frequently checks in late',
  },
  {
    value: 'settings_disabled',
    label: 'Check-in Disabled',
    description: 'Triggers when a user disables their check-in feature',
  },
  {
    value: 'no_contacts',
    label: 'No Emergency Contacts',
    description: 'Triggers when a user has check-in enabled but no contacts',
  },
  {
    value: 'inactive_period',
    label: 'Inactive Period',
    description: 'Triggers when a user has no activity for X days',
  },
  {
    value: 'snooze_abuse',
    label: 'Frequent Snooze Usage',
    description: 'Triggers when a user uses snooze too frequently',
  },
];

interface WarningRule {
  id: string;
  name: string;
  description?: string;
  type: string;
  severity: string;
  threshold: number;
  lookbackDays?: number;
  isActive: boolean;
  notifyAdmin: boolean;
  createdAt: string;
}

interface EarlyWarning {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  ruleId: string;
  ruleName: string;
  ruleType: string;
  severity: string;
  details: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
}

interface AtRiskUser {
  userId: string;
  userName: string;
  userEmail?: string;
  warningCount: number;
  highestSeverity: string;
  hasEmergencyContacts: boolean;
  checkInEnabled: boolean;
  lastCheckInDate?: string;
}

interface DashboardData {
  totalWarnings: number;
  unacknowledgedCount: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  atRiskUsers: AtRiskUser[];
  recentWarnings: EarlyWarning[];
}

export function EarlyWarningsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [rules, setRules] = useState<WarningRule[]>([]);
  const [warnings, setWarnings] = useState<EarlyWarning[]>([]);
  const [warningsTotal, setWarningsTotal] = useState(0);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<WarningRule | null>(null);
  const [acknowledgeModalOpen, setAcknowledgeModalOpen] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<EarlyWarning | null>(null);
  const [form] = Form.useForm();
  const [acknowledgeForm] = Form.useForm();
  const [filters, setFilters] = useState<{
    severity?: string;
    acknowledged?: boolean;
    page: number;
    pageSize: number;
  }>({ page: 1, pageSize: 20 });

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/api/v1/admin/early-warnings/dashboard');
      setDashboard(response.data);
    } catch {
      message.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/api/v1/admin/early-warnings/rules');
      setRules(response.data);
    } catch {
      message.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarnings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.acknowledged !== undefined) params.append('acknowledged', String(filters.acknowledged));
      params.append('page', String(filters.page));
      params.append('pageSize', String(filters.pageSize));

      const response = await adminApi.get(`/api/v1/admin/early-warnings?${params}`);
      setWarnings(response.data.warnings);
      setWarningsTotal(response.data.total);
    } catch {
      message.error('Failed to load warnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchRules();
  }, []);

  useEffect(() => {
    if (activeTab === 'warnings') {
      fetchWarnings();
    }
  }, [activeTab, filters]);

  const handleCreateRule = async (values: Record<string, unknown>) => {
    try {
      if (editingRule) {
        await adminApi.patch(`/api/v1/admin/early-warnings/rules/${editingRule.id}`, values);
        message.success('Rule updated');
      } else {
        await adminApi.post('/api/v1/admin/early-warnings/rules', values);
        message.success('Rule created');
      }
      setRuleModalOpen(false);
      setEditingRule(null);
      form.resetFields();
      fetchRules();
    } catch {
      message.error('Failed to save rule');
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await adminApi.delete(`/api/v1/admin/early-warnings/rules/${id}`);
      message.success('Rule deleted');
      fetchRules();
    } catch {
      message.error('Failed to delete rule');
    }
  };

  const handleAcknowledge = async () => {
    if (!selectedWarning) return;

    try {
      const values = acknowledgeForm.getFieldsValue();
      await adminApi.post(`/api/v1/admin/early-warnings/${selectedWarning.id}/acknowledge`, values);
      message.success('Warning acknowledged');
      setAcknowledgeModalOpen(false);
      setSelectedWarning(null);
      acknowledgeForm.resetFields();
      fetchWarnings();
      fetchDashboard();
    } catch {
      message.error('Failed to acknowledge warning');
    }
  };

  const handleTriggerDetection = async () => {
    try {
      const response = await adminApi.post('/api/v1/admin/early-warnings/detect');
      message.success(`Detection complete: ${response.data.warningsCreated} warnings created`);
      fetchDashboard();
      fetchWarnings();
    } catch {
      message.error('Failed to trigger detection');
    }
  };

  const openRuleEdit = (rule: WarningRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setRuleModalOpen(true);
  };

  const ruleColumns = [
    {
      title: 'Rule',
      key: 'name',
      render: (_: unknown, record: WarningRule) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: (type: string) => {
        const ruleType = RULE_TYPES.find((t) => t.value === type);
        return <Tag>{ruleType?.label || type}</Tag>;
      },
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG];
        return <Tag color={config?.color}>{config?.label || severity}</Tag>;
      },
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: WarningRule) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => openRuleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Delete this rule?" onConfirm={() => handleDeleteRule(record.id)}>
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const warningColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: unknown, record: EarlyWarning) => (
        <div>
          <Text strong>{record.userName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.userEmail}</Text>
        </div>
      ),
    },
    {
      title: 'Warning',
      key: 'warning',
      render: (_: unknown, record: EarlyWarning) => (
        <div>
          <Tag color={SEVERITY_CONFIG[record.severity as keyof typeof SEVERITY_CONFIG]?.color}>
            {record.ruleName}
          </Tag>
          <br />
          <Text style={{ fontSize: 12 }}>{record.details}</Text>
        </div>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG];
        return (
          <Tag color={config?.color} icon={config?.icon}>
            {config?.label}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: unknown, record: EarlyWarning) =>
        record.isAcknowledged ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Acknowledged
          </Tag>
        ) : (
          <Tag color="red">Unacknowledged</Tag>
        ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: EarlyWarning) =>
        !record.isAcknowledged && (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setSelectedWarning(record);
              setAcknowledgeModalOpen(true);
            }}
          >
            Acknowledge
          </Button>
        ),
    },
  ];

  const renderDashboard = () => {
    if (!dashboard) return null;

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Unacknowledged Warnings"
                value={dashboard.unacknowledgedCount}
                valueStyle={{ color: dashboard.unacknowledgedCount > 0 ? '#cf1322' : '#3f8600' }}
                prefix={dashboard.unacknowledgedCount > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Critical"
                value={dashboard.bySeverity.critical}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="High"
                value={dashboard.bySeverity.high}
                valueStyle={{ color: '#fa541c' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Medium / Low"
                value={`${dashboard.bySeverity.medium} / ${dashboard.bySeverity.low}`}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card
              title="At-Risk Users"
              extra={
                <Button icon={<ReloadOutlined />} onClick={fetchDashboard}>
                  Refresh
                </Button>
              }
            >
              <List
                dataSource={dashboard.atRiskUsers}
                renderItem={(user: AtRiskUser) => (
                  <List.Item
                    actions={[
                      <Badge
                        key="count"
                        count={user.warningCount}
                        style={{ backgroundColor: SEVERITY_CONFIG[user.highestSeverity as keyof typeof SEVERITY_CONFIG]?.color === 'blue' ? '#1890ff' : '#ff4d4f' }}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.userName}
                      description={
                        <Space>
                          <Tag color={user.checkInEnabled ? 'green' : 'red'}>
                            {user.checkInEnabled ? 'Check-in Active' : 'Check-in Disabled'}
                          </Tag>
                          <Tag color={user.hasEmergencyContacts ? 'green' : 'orange'}>
                            {user.hasEmergencyContacts ? 'Has Contacts' : 'No Contacts'}
                          </Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No at-risk users' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Recent Warnings">
              <List
                dataSource={dashboard.recentWarnings}
                renderItem={(warning: EarlyWarning) => (
                  <List.Item
                    actions={[
                      !warning.isAcknowledged && (
                        <Button
                          key="ack"
                          size="small"
                          onClick={() => {
                            setSelectedWarning(warning);
                            setAcknowledgeModalOpen(true);
                          }}
                        >
                          Acknowledge
                        </Button>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Tag color={SEVERITY_CONFIG[warning.severity as keyof typeof SEVERITY_CONFIG]?.color}>
                            {SEVERITY_CONFIG[warning.severity as keyof typeof SEVERITY_CONFIG]?.label}
                          </Tag>
                          <Text>{warning.userName}</Text>
                        </Space>
                      }
                      description={warning.details}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No recent warnings' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'dashboard',
      label: (
        <Badge count={dashboard?.unacknowledgedCount} offset={[10, 0]}>
          Dashboard
        </Badge>
      ),
      children: renderDashboard(),
    },
    {
      key: 'warnings',
      label: 'All Warnings',
      children: (
        <Card
          title="Early Warnings"
          extra={
            <Space>
              <Select
                placeholder="Severity"
                allowClear
                style={{ width: 120 }}
                onChange={(value) => setFilters((f) => ({ ...f, severity: value, page: 1 }))}
                options={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
              />
              <Select
                placeholder="Status"
                allowClear
                style={{ width: 140 }}
                onChange={(value) =>
                  setFilters((f) => ({
                    ...f,
                    acknowledged: value === undefined ? undefined : value === 'acknowledged',
                    page: 1,
                  }))
                }
                options={[
                  { value: 'acknowledged', label: 'Acknowledged' },
                  { value: 'unacknowledged', label: 'Unacknowledged' },
                ]}
              />
              <Button icon={<ReloadOutlined />} onClick={fetchWarnings}>
                Refresh
              </Button>
            </Space>
          }
        >
          <Table
            columns={warningColumns}
            dataSource={warnings}
            rowKey="id"
            loading={loading}
            pagination={{
              current: filters.page,
              pageSize: filters.pageSize,
              total: warningsTotal,
              onChange: (page, pageSize) => setFilters((f) => ({ ...f, page, pageSize })),
            }}
          />
        </Card>
      ),
    },
    {
      key: 'rules',
      label: 'Warning Rules',
      children: (
        <Card
          title="Warning Rules"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchRules}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRule(null);
                  form.resetFields();
                  setRuleModalOpen(true);
                }}
              >
                New Rule
              </Button>
            </Space>
          }
        >
          <Alert
            type="info"
            message="Warning rules automatically detect at-risk users and create warnings for admin review."
            style={{ marginBottom: 16 }}
            showIcon
          />
          <Table columns={ruleColumns} dataSource={rules} rowKey="id" loading={loading} pagination={false} />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={4}>Early Warning System</Title>
          <Text type="secondary">
            Monitor at-risk users and proactively identify potential issues before they become emergencies.
          </Text>
        </div>
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleTriggerDetection}>
          Run Detection Now
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Rule Modal */}
      <Modal
        title={editingRule ? 'Edit Warning Rule' : 'Create Warning Rule'}
        open={ruleModalOpen}
        onCancel={() => {
          setRuleModalOpen(false);
          setEditingRule(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRule}>
          <Form.Item name="name" label="Rule Name" rules={[{ required: true }]}>
            <Input placeholder="e.g., Consecutive Missed Check-ins Alert" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Describe when this rule triggers..." rows={2} />
          </Form.Item>

          {!editingRule && (
            <Form.Item name="type" label="Rule Type" rules={[{ required: true }]}>
              <Select placeholder="Select rule type">
                {RULE_TYPES.map((type) => (
                  <Select.Option key={type.value} value={type.value}>
                    <div>
                      <Text strong>{type.label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {type.description}
                      </Text>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
                <Select placeholder="Select severity">
                  {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                    <Select.Option key={key} value={key}>
                      <Tag color={config.color}>{config.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="threshold" label="Threshold" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="e.g., 3" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="lookbackDays" label="Lookback Period (days)">
            <InputNumber min={1} max={365} style={{ width: '100%' }} placeholder="e.g., 7" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notifyAdmin" label="Notify Admin" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
              <Button onClick={() => setRuleModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Acknowledge Modal */}
      <Modal
        title="Acknowledge Warning"
        open={acknowledgeModalOpen}
        onCancel={() => {
          setAcknowledgeModalOpen(false);
          setSelectedWarning(null);
          acknowledgeForm.resetFields();
        }}
        onOk={handleAcknowledge}
        okText="Acknowledge"
      >
        {selectedWarning && (
          <div>
            <Alert
              type="warning"
              message={
                <Space>
                  <Tag color={SEVERITY_CONFIG[selectedWarning.severity as keyof typeof SEVERITY_CONFIG]?.color}>
                    {selectedWarning.severity.toUpperCase()}
                  </Tag>
                  <Text strong>{selectedWarning.userName}</Text>
                </Space>
              }
              description={selectedWarning.details}
              style={{ marginBottom: 16 }}
            />

            <Form form={acknowledgeForm} layout="vertical">
              <Form.Item name="notes" label="Notes (optional)">
                <Input.TextArea
                  placeholder="Add notes about the action taken or follow-up needed..."
                  rows={3}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
