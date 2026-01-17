/**
 * @file TemplatesPage.tsx
 * @description Admin page for managing email and SMS templates with WYSIWYG editor
 * @task TASK-052
 * @design_state_version 3.9.0
 */
import React, { useState, useEffect, useMemo } from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CopyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  adminApiEndpoints,
  EmailTemplate,
  SmsTemplate,
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  CreateSmsTemplateDto,
  UpdateSmsTemplateDto,
} from '@/lib/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

const THEMES = [
  { value: 'standard', label: 'Standard' },
  { value: 'warm', label: 'Warm & Friendly' },
];

const TEMPLATE_CODES = [
  { value: 'alert', label: 'Alert Notification', description: 'Sent when user misses check-in' },
  { value: 'reminder', label: 'Check-in Reminder', description: 'Daily reminder to check in' },
  { value: 'verification', label: 'Contact Verification', description: 'Verify emergency contact email' },
  { value: 'contact_link', label: 'Contact Link Invitation', description: 'Invite contact to link accounts' },
];

// Predefined variables for each template type
const TEMPLATE_VARIABLES: Record<string, Array<{ key: string; label: string; example: string }>> = {
  alert: [
    { key: 'userName', label: 'User Name', example: 'John Doe' },
    { key: 'contactName', label: 'Contact Name', example: 'Jane Smith' },
    { key: 'alertDate', label: 'Alert Date', example: '2026-01-17' },
    { key: 'triggeredAt', label: 'Triggered Time', example: '10:30 AM' },
    { key: 'appUrl', label: 'App URL', example: 'https://app.sologuardian.com' },
  ],
  reminder: [
    { key: 'userName', label: 'User Name', example: 'John Doe' },
    { key: 'deadlineTime', label: 'Deadline Time', example: '10:00 PM' },
    { key: 'checkInUrl', label: 'Check-in URL', example: 'https://app.sologuardian.com/check-in' },
  ],
  verification: [
    { key: 'contactName', label: 'Contact Name', example: 'Jane Smith' },
    { key: 'userName', label: 'User Name (who added)', example: 'John Doe' },
    { key: 'verificationUrl', label: 'Verification URL', example: 'https://app.sologuardian.com/verify/...' },
    { key: 'expiresIn', label: 'Expires In', example: '7 days' },
  ],
  contact_link: [
    { key: 'contactName', label: 'Contact Name', example: 'Jane Smith' },
    { key: 'elderName', label: 'Elder Name', example: 'John Doe' },
    { key: 'elderEmail', label: 'Elder Email', example: 'john@example.com' },
    { key: 'acceptUrl', label: 'Accept URL', example: 'https://app.sologuardian.com/accept-link/...' },
  ],
};

// Quill editor configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link',
];

// Convert HTML to plain text
function htmlToPlainText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Variable tag component
function VariableTag({ variable, onClick }: { variable: string; onClick: () => void }): React.ReactElement {
  return (
    <Tag
      color="blue"
      style={{ cursor: 'pointer', marginBottom: 4 }}
      onClick={onClick}
    >
      <CopyOutlined style={{ marginRight: 4 }} />
      {`{{${variable}}}`}
    </Tag>
  );
}

export function TemplatesPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('email');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [editingSms, setEditingSms] = useState<SmsTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState<{ subject: string; html: string } | null>(null);
  const [emailForm] = Form.useForm();
  const [smsForm] = Form.useForm();
  const [selectedCode, setSelectedCode] = useState<string>('alert');
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [smsContent, setSmsContent] = useState<string>('');

  const currentVariables = useMemo(() => {
    return TEMPLATE_VARIABLES[selectedCode] || [];
  }, [selectedCode]);

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

  const insertVariable = (variable: string, target: 'email' | 'sms'): void => {
    const varText = `{{${variable}}}`;
    if (target === 'email') {
      setEmailContent(prev => prev + varText);
    } else {
      setSmsContent(prev => prev + varText);
    }
    message.success(`Inserted ${varText}`);
  };

  const handleEmailSubmit = async (values: Record<string, unknown>): Promise<void> => {
    try {
      const textContent = htmlToPlainText(emailContent);
      const variables = currentVariables.map(v => v.key);

      const payload = {
        ...values,
        htmlContent: emailContent,
        textContent,
        variables,
      };

      if (editingEmail) {
        await adminApiEndpoints.updateEmailTemplate(editingEmail.id, payload as UpdateEmailTemplateDto);
        message.success('Email template updated');
      } else {
        await adminApiEndpoints.createEmailTemplate(payload as CreateEmailTemplateDto);
        message.success('Email template created');
      }
      setEmailModalOpen(false);
      setEditingEmail(null);
      emailForm.resetFields();
      setEmailContent('');
      fetchEmailTemplates();
    } catch {
      message.error('Failed to save email template');
    }
  };

  const handleSmsSubmit = async (values: Record<string, unknown>): Promise<void> => {
    try {
      const variables = currentVariables.map(v => v.key);

      const payload = {
        ...values,
        content: smsContent,
        variables,
      };

      if (editingSms) {
        await adminApiEndpoints.updateSmsTemplate(editingSms.id, payload as UpdateSmsTemplateDto);
        message.success('SMS template updated');
      } else {
        await adminApiEndpoints.createSmsTemplate(payload as CreateSmsTemplateDto);
        message.success('SMS template created');
      }
      setSmsModalOpen(false);
      setEditingSms(null);
      smsForm.resetFields();
      setSmsContent('');
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
    setSelectedCode(template.code);
    setEmailContent(template.htmlContent);
    setEmailSubject(template.subject);
    emailForm.setFieldsValue({
      subject: template.subject,
      theme: template.theme,
      isActive: template.isActive,
    });
    setEmailModalOpen(true);
  };

  const openSmsEdit = (template: SmsTemplate): void => {
    setEditingSms(template);
    setSelectedCode(template.code);
    setSmsContent(template.content);
    smsForm.setFieldsValue({});
    setSmsModalOpen(true);
  };

  const openPreview = (template: EmailTemplate): void => {
    // Replace variables with example values for preview
    const variables = TEMPLATE_VARIABLES[template.code] || [];
    let html = template.htmlContent;
    let subject = template.subject;

    variables.forEach(v => {
      const regex = new RegExp(`{{${v.key}}}`, 'g');
      html = html.replace(regex, `<span style="background:#e6f7ff;padding:2px 4px;border-radius:2px;">${v.example}</span>`);
      subject = subject.replace(regex, v.example);
    });

    setPreviewContent({ subject, html });
    setPreviewModalOpen(true);
  };

  const emailColumns = [
    {
      title: 'Template',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => {
        const template = TEMPLATE_CODES.find(t => t.value === code);
        return (
          <div>
            <Tag color="blue">{template?.label || code}</Tag>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{template?.description}</Text>
          </div>
        );
      },
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (lang: string) => {
        const langObj = LANGUAGES.find(l => l.value === lang);
        return <Tag>{langObj?.label || lang}</Tag>;
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
      width: 100,
      render: (theme: string) => (
        <Tag color={theme === 'warm' ? 'orange' : 'default'}>{theme}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: EmailTemplate) => (
        <Space>
          <Tooltip title="Preview">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => openPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEmailEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this template?"
            onConfirm={() => handleDeleteEmail(record.id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const smsColumns = [
    {
      title: 'Template',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => {
        const template = TEMPLATE_CODES.find(t => t.value === code);
        return (
          <div>
            <Tag color="blue">{template?.label || code}</Tag>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{template?.description}</Text>
          </div>
        );
      },
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (lang: string) => {
        const langObj = LANGUAGES.find(l => l.value === lang);
        return <Tag>{langObj?.label || lang}</Tag>;
      },
    },
    {
      title: 'Content Preview',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => (
        <Text style={{ fontSize: 13 }}>{content.substring(0, 100)}...</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: SmsTemplate) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openSmsEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this template?"
            onConfirm={() => handleDeleteSms(record.id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderVariablePicker = (target: 'email' | 'sms'): React.ReactElement => (
    <Card size="small" title="Available Variables" style={{ marginBottom: 16 }}>
      <Alert
        type="info"
        message="Click a variable to insert it at the end. You can also type them manually."
        style={{ marginBottom: 12 }}
        showIcon
      />
      <Space wrap>
        {currentVariables.map(v => (
          <Tooltip key={v.key} title={`Example: ${v.example}`}>
            <span>
              <VariableTag
                variable={v.key}
                onClick={() => insertVariable(v.key, target)}
              />
            </span>
          </Tooltip>
        ))}
      </Space>
    </Card>
  );

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
                  setSelectedCode('alert');
                  setEmailContent('');
                  setEmailSubject('');
                  emailForm.resetFields();
                  setEmailModalOpen(true);
                }}
              >
                New Template
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
                  setSelectedCode('alert');
                  setSmsContent('');
                  smsForm.resetFields();
                  setSmsModalOpen(true);
                }}
              >
                New Template
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
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Create and manage notification templates for emails and SMS messages.
        Use the visual editor to design templates without writing HTML.
      </Text>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Email Template Modal - Split View */}
      <Modal
        title={editingEmail ? 'Edit Email Template' : 'Create Email Template'}
        open={emailModalOpen}
        onCancel={() => {
          setEmailModalOpen(false);
          setEditingEmail(null);
          emailForm.resetFields();
          setEmailContent('');
          setEmailSubject('');
        }}
        footer={null}
        width={1200}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', height: '75vh' }}>
          {/* Left: Editor */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', borderRight: '1px solid #f0f0f0' }}>
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleEmailSubmit}
            >
              {!editingEmail && (
                <Space style={{ width: '100%', marginBottom: 16 }} size="middle" wrap>
                  <Form.Item
                    name="code"
                    label="Template Type"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0, minWidth: 200 }}
                  >
                    <Select
                      options={TEMPLATE_CODES.map(t => ({ value: t.value, label: t.label }))}
                      placeholder="Select type"
                      onChange={(value) => setSelectedCode(value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="language"
                    label="Language"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0, minWidth: 120 }}
                  >
                    <Select options={LANGUAGES} placeholder="Select" />
                  </Form.Item>
                  <Form.Item
                    name="theme"
                    label="Theme"
                    style={{ marginBottom: 0, minWidth: 140 }}
                    initialValue="standard"
                  >
                    <Select options={THEMES} />
                  </Form.Item>
                </Space>
              )}

              {editingEmail && (
                <Space style={{ marginBottom: 16 }}>
                  <Tag color="blue">{TEMPLATE_CODES.find(t => t.value === editingEmail.code)?.label}</Tag>
                  <Tag>{LANGUAGES.find(l => l.value === editingEmail.language)?.label}</Tag>
                  <Form.Item name="isActive" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                  </Form.Item>
                </Space>
              )}

              {renderVariablePicker('email')}

              <Form.Item
                name="subject"
                label="Email Subject"
                rules={[{ required: true, message: 'Please enter subject' }]}
              >
                <Input
                  placeholder="Enter subject (use {{userName}} for variables)"
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Email Content" required>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
                  <ReactQuill
                    theme="snow"
                    value={emailContent}
                    onChange={setEmailContent}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ minHeight: 200 }}
                    placeholder="Compose your email here..."
                  />
                </div>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editingEmail ? 'Update Template' : 'Create Template'}
                  </Button>
                  <Button onClick={() => setEmailModalOpen(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>

          {/* Right: Live Preview */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#fafafa' }}>
            <div style={{ marginBottom: 16 }}>
              <Tag color="green">Live Preview</Tag>
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                Variables shown with example values
              </Text>
            </div>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>Subject: </Text>
              <Text>
                {(() => {
                  let subject = emailSubject || 'Your email subject here...';
                  currentVariables.forEach(v => {
                    subject = subject.replace(
                      new RegExp(`{{${v.key}}}`, 'g'),
                      v.example
                    );
                  });
                  return subject;
                })()}
              </Text>
            </Card>

            <Card
              title="Email Body"
              size="small"
              styles={{ body: { background: '#fff', minHeight: 300 } }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let html = emailContent || '<p style="color:#999">Start typing to see preview...</p>';
                    currentVariables.forEach(v => {
                      html = html.replace(
                        new RegExp(`{{${v.key}}}`, 'g'),
                        `<span style="background:#e6f7ff;padding:1px 4px;border-radius:2px;color:#1890ff">${v.example}</span>`
                      );
                    });
                    return html;
                  })()
                }}
              />
            </Card>

            <Alert
              type="info"
              message="Blue highlighted text shows where variables will be replaced with real data."
              style={{ marginTop: 16 }}
              showIcon
            />
          </div>
        </div>
      </Modal>

      {/* SMS Template Modal - Split View */}
      <Modal
        title={editingSms ? 'Edit SMS Template' : 'Create SMS Template'}
        open={smsModalOpen}
        onCancel={() => {
          setSmsModalOpen(false);
          setEditingSms(null);
          smsForm.resetFields();
          setSmsContent('');
        }}
        footer={null}
        width={900}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', minHeight: 400 }}>
          {/* Left: Editor */}
          <div style={{ flex: 1, padding: 24, borderRight: '1px solid #f0f0f0' }}>
            <Form
              form={smsForm}
              layout="vertical"
              onFinish={handleSmsSubmit}
            >
              {!editingSms && (
                <Space style={{ width: '100%', marginBottom: 16 }} size="middle" wrap>
                  <Form.Item
                    name="code"
                    label="Template Type"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0, minWidth: 200 }}
                  >
                    <Select
                      options={TEMPLATE_CODES.map(t => ({ value: t.value, label: t.label }))}
                      placeholder="Select type"
                      onChange={(value) => setSelectedCode(value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="language"
                    label="Language"
                    rules={[{ required: true }]}
                    style={{ marginBottom: 0, minWidth: 120 }}
                  >
                    <Select options={LANGUAGES} placeholder="Select" />
                  </Form.Item>
                </Space>
              )}

              {editingSms && (
                <Space style={{ marginBottom: 16 }}>
                  <Tag color="blue">{TEMPLATE_CODES.find(t => t.value === editingSms.code)?.label}</Tag>
                  <Tag>{LANGUAGES.find(l => l.value === editingSms.language)?.label}</Tag>
                </Space>
              )}

              {renderVariablePicker('sms')}

              <Form.Item label="SMS Content" required>
                <TextArea
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  rows={6}
                  maxLength={320}
                  showCount
                  placeholder="Enter SMS message (max 320 characters)"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editingSms ? 'Update Template' : 'Create Template'}
                  </Button>
                  <Button onClick={() => setSmsModalOpen(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>

          {/* Right: Live Preview */}
          <div style={{ flex: 1, padding: 24, background: '#fafafa' }}>
            <div style={{ marginBottom: 16 }}>
              <Tag color="green">Live Preview</Tag>
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                How the SMS will appear
              </Text>
            </div>

            {/* Phone mockup */}
            <div style={{
              maxWidth: 300,
              margin: '0 auto',
              background: '#fff',
              borderRadius: 24,
              padding: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '8px solid #333',
            }}>
              <div style={{
                background: '#e5e5ea',
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.5,
                minHeight: 100,
              }}>
                {(() => {
                  let text = smsContent || 'Your SMS message will appear here...';
                  currentVariables.forEach(v => {
                    text = text.replace(
                      new RegExp(`{{${v.key}}}`, 'g'),
                      v.example
                    );
                  });
                  return text;
                })()}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: 12,
                color: '#666',
                fontSize: 12,
              }}>
                {smsContent.length}/320 characters
              </div>
            </div>

            <Alert
              type="info"
              message="Keep SMS messages short and clear. Variables will be replaced with real user data."
              style={{ marginTop: 24 }}
              showIcon
            />
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Email Preview"
        open={previewModalOpen}
        onCancel={() => setPreviewModalOpen(false)}
        footer={<Button onClick={() => setPreviewModalOpen(false)}>Close</Button>}
        width={700}
      >
        {previewContent && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Subject: </Text>
              <Text>{previewContent.subject}</Text>
            </div>
            <Card size="small">
              <div
                dangerouslySetInnerHTML={{ __html: previewContent.html }}
                style={{ padding: 16 }}
              />
            </Card>
            <Alert
              type="info"
              message="Variables shown with blue background will be replaced with actual user data when the email is sent."
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
