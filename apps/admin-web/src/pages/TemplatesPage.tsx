/**
 * @file TemplatesPage.tsx
 * @description Admin page for managing email and SMS templates
 * @task TASK-052
 * @design_state_version 3.9.0
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  adminApiEndpoints,
  EmailTemplate,
  SmsTemplate,
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  CreateSmsTemplateDto,
  UpdateSmsTemplateDto,
} from '@/lib/api';

const { Title } = Typography;
const { TextArea } = Input;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const THEMES = [
  { value: 'standard', label: 'Standard' },
  { value: 'warm', label: 'Warm' },
];

const TEMPLATE_CODES = [
  { value: 'alert', label: 'Alert Notification' },
  { value: 'reminder', label: 'Check-in Reminder' },
  { value: 'verification', label: 'Contact Verification' },
  { value: 'contact_link', label: 'Contact Link Invitation' },
];

export function TemplatesPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('email');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [editingSms, setEditingSms] = useState<SmsTemplate | null>(null);
  const [emailForm] = Form.useForm();
  const [smsForm] = Form.useForm();

  const fetchEmailTemplates = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await adminApiEndpoints.getEmailTemplates();
      setEmailTemplates(response.data.data);
    } catch {
      message.error('Failed to load email templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchSmsTemplates = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await adminApiEndpoints.getSmsTemplates();
      setSmsTemplates(response.data.data);
    } catch {
      message.error('Failed to load SMS templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
    fetchSmsTemplates();
  }, []);

  const handleEmailSubmit = async (values: CreateEmailTemplateDto | UpdateEmailTemplateDto): Promise<void> => {
    try {
      if (editingEmail) {
        await adminApiEndpoints.updateEmailTemplate(editingEmail.id, values as UpdateEmailTemplateDto);
        message.success('Email template updated');
      } else {
        await adminApiEndpoints.createEmailTemplate(values as CreateEmailTemplateDto);
        message.success('Email template created');
      }
      setEmailModalOpen(false);
      setEditingEmail(null);
      emailForm.resetFields();
      fetchEmailTemplates();
    } catch {
      message.error('Failed to save email template');
    }
  };

  const handleSmsSubmit = async (values: CreateSmsTemplateDto | UpdateSmsTemplateDto): Promise<void> => {
    try {
      if (editingSms) {
        await adminApiEndpoints.updateSmsTemplate(editingSms.id, values as UpdateSmsTemplateDto);
        message.success('SMS template updated');
      } else {
        await adminApiEndpoints.createSmsTemplate(values as CreateSmsTemplateDto);
        message.success('SMS template created');
      }
      setSmsModalOpen(false);
      setEditingSms(null);
      smsForm.resetFields();
      fetchSmsTemplates();
    } catch {
      message.error('Failed to save SMS template');
    }
  };

  const handleDeleteEmail = async (id: string): Promise<void> => {
    try {
      await adminApiEndpoints.deleteEmailTemplate(id);
      message.success('Email template deleted');
      fetchEmailTemplates();
    } catch {
      message.error('Failed to delete email template');
    }
  };

  const handleDeleteSms = async (id: string): Promise<void> => {
    try {
      await adminApiEndpoints.deleteSmsTemplate(id);
      message.success('SMS template deleted');
      fetchSmsTemplates();
    } catch {
      message.error('Failed to delete SMS template');
    }
  };

  const openEmailEdit = (template: EmailTemplate): void => {
    setEditingEmail(template);
    emailForm.setFieldsValue(template);
    setEmailModalOpen(true);
  };

  const openSmsEdit = (template: SmsTemplate): void => {
    setEditingSms(template);
    smsForm.setFieldsValue(template);
    setSmsModalOpen(true);
  };

  const emailColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => {
        const langLabel = LANGUAGES.find(l => l.value === lang)?.label || lang;
        return <Tag>{langLabel}</Tag>;
      },
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: 'Theme',
      dataIndex: 'theme',
      key: 'theme',
      render: (theme: string) => (
        <Tag color={theme === 'warm' ? 'orange' : 'default'}>{theme}</Tag>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: EmailTemplate) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEmailEdit(record)}
          />
          <Popconfirm
            title="Delete this template?"
            onConfirm={() => handleDeleteEmail(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const smsColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => {
        const langLabel = LANGUAGES.find(l => l.value === lang)?.label || lang;
        return <Tag>{langLabel}</Tag>;
      },
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: 'Variables',
      dataIndex: 'variables',
      key: 'variables',
      render: (vars: string[]) => vars?.map(v => <Tag key={v}>{`{{${v}}}`}</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: SmsTemplate) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openSmsEdit(record)}
          />
          <Popconfirm
            title="Delete this template?"
            onConfirm={() => handleDeleteSms(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'email',
      label: 'Email Templates',
      children: (
        <Card
          title="Email Templates"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchEmailTemplates}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingEmail(null);
                  emailForm.resetFields();
                  setEmailModalOpen(true);
                }}
              >
                Add Template
              </Button>
            </Space>
          }
        >
          <Table
            columns={emailColumns}
            dataSource={emailTemplates}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: 'sms',
      label: 'SMS Templates',
      children: (
        <Card
          title="SMS Templates"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={fetchSmsTemplates}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSms(null);
                  smsForm.resetFields();
                  setSmsModalOpen(true);
                }}
              >
                Add Template
              </Button>
            </Space>
          }
        >
          <Table
            columns={smsColumns}
            dataSource={smsTemplates}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Message Templates</Title>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Manage email and SMS notification templates. Use {'{{variable}}'} syntax for dynamic content.
      </p>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Email Template Modal */}
      <Modal
        title={editingEmail ? 'Edit Email Template' : 'Create Email Template'}
        open={emailModalOpen}
        onCancel={() => {
          setEmailModalOpen(false);
          setEditingEmail(null);
          emailForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={handleEmailSubmit}
        >
          {!editingEmail && (
            <>
              <Form.Item
                name="code"
                label="Template Code"
                rules={[{ required: true, message: 'Please select a code' }]}
              >
                <Select options={TEMPLATE_CODES} placeholder="Select template code" />
              </Form.Item>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: 'Please select a language' }]}
              >
                <Select options={LANGUAGES} placeholder="Select language" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Email subject line" />
          </Form.Item>
          <Form.Item
            name="htmlContent"
            label="HTML Content"
            rules={[{ required: true, message: 'Please enter HTML content' }]}
          >
            <TextArea rows={8} placeholder="HTML email content..." />
          </Form.Item>
          <Form.Item
            name="textContent"
            label="Text Content"
            rules={[{ required: true, message: 'Please enter text content' }]}
          >
            <TextArea rows={4} placeholder="Plain text email content..." />
          </Form.Item>
          <Form.Item name="theme" label="Theme">
            <Select options={THEMES} placeholder="Select theme" allowClear />
          </Form.Item>
          {editingEmail && (
            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingEmail ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setEmailModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* SMS Template Modal */}
      <Modal
        title={editingSms ? 'Edit SMS Template' : 'Create SMS Template'}
        open={smsModalOpen}
        onCancel={() => {
          setSmsModalOpen(false);
          setEditingSms(null);
          smsForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={smsForm}
          layout="vertical"
          onFinish={handleSmsSubmit}
        >
          {!editingSms && (
            <>
              <Form.Item
                name="code"
                label="Template Code"
                rules={[{ required: true, message: 'Please select a code' }]}
              >
                <Select options={TEMPLATE_CODES} placeholder="Select template code" />
              </Form.Item>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: 'Please select a language' }]}
              >
                <Select options={LANGUAGES} placeholder="Select language" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="content"
            label="SMS Content"
            rules={[{ required: true, message: 'Please enter content' }]}
            extra="Max 320 characters. Use {{variable}} for dynamic content."
          >
            <TextArea rows={4} maxLength={320} showCount placeholder="SMS message content..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSms ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setSmsModalOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
