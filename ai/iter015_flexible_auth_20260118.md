# iter-015: 灵活认证 & 新手引导

## 需求概述

实现灵活的认证系统，支持多种登录方式（用户名、邮箱、手机号、用户ID），并增强新手引导流程。

## 变更列表

### 数据库模式变更 (TASK-075)

- `schema.prisma`: User 模型添加 `username`、`phone` 字段，`email` 改为可选
- 创建迁移文件：`20260118000000_flexible_auth_identifiers`

### 后端变更

#### 新增文件
- `auth/utils/identifier-type.util.ts`: 登录标识符类型检测工具 (TASK-076)
- `auth/utils/index.ts`: 工具模块导出
- `auth/validators/at-least-one-identifier.validator.ts`: 至少一个标识符验证器 (TASK-077)
- `auth/validators/index.ts`: 验证器模块导出

#### 修改文件
- `auth/dto/register.dto.ts`: 添加 username、phone 字段，使用自定义验证器 (TASK-078)
- `auth/dto/login.dto.ts`: 将 email 字段改为 identifier (TASK-079)
- `auth/dto/auth-result.dto.ts`: 添加 username、phone 到 AuthUser (TASK-082)
- `auth/auth.repository.ts`: 添加 findByIdentifier、checkDuplicates 方法 (TASK-080)
- `auth/auth.service.ts`: 更新 register/login 方法支持灵活标识符 (TASK-081)
- `auth/auth.controller.spec.ts`: 更新测试用例
- `auth/auth.service.spec.ts`: 更新测试用例
- `auth/oauth/oauth.service.ts`: 更新 OAuthUser 接口支持可空 email
- `test/factories/user.factory.ts`: 添加 username、phone 字段

#### 类型更新（支持可空 email）
- `admin/dto/user-list.dto.ts`: UserSummaryResponse.email 改为可空
- `admin/dto/alert-list.dto.ts`: AlertSummaryResponse.userEmail 改为可空
- `admin/dto/at-risk-users.dto.ts`: AtRiskUserDto.email 改为可空
- `admin/admin.repository.ts`: 所有返回类型 email 改为可空
- `alerts/alert.repository.ts`: findById 返回类型 email 改为可空
- `caregiver/caregiver.repository.ts`: ElderWithRelations、getCaregivers、findUserByEmail 等更新
- `caregiver/dto/caregiver.dto.ts`: ElderSummary、CaregiverSummary、ElderDetail email 改为可空
- `caregiver/dto/invitation.dto.ts`: InvitationDetailsDto.inviter.email 改为可空
- `caregiver/caregiver.service.ts`: 相关接口更新
- `detector/missed-checkin.detector.ts`: 添加 email 空值检查
- `emergency-contacts/emergency-contacts.repository.ts`: 返回类型 user.email 改为可空
- `emergency-contacts/emergency-contacts.service.ts`: LinkedContactInfo、PendingInvitationInfo 更新
- `emergency-contacts/emergency-contacts.controller.ts`: getInvitationDetails 返回类型更新

### 前端变更

#### 修改文件
- `pages/auth/RegisterPage.tsx`: 添加 username、phone 字段，使用灵活验证 (TASK-084)
- `pages/auth/LoginPage.tsx`: 使用 identifier 字段替代 email (TASK-085)

#### 新增文件
- `components/onboarding/CheckInTutorialStep.tsx`: 打卡教程步骤 (TASK-087)
- `components/onboarding/ContactsTutorialStep.tsx`: 紧急联系人教程步骤 (TASK-087)
- `components/onboarding/CaregiverTutorialStep.tsx`: 护理者教程步骤 (TASK-087)
- `components/onboarding/index.ts`: 更新导出

#### 修改文件
- `pages/onboarding/OnboardingPage.tsx`: 集成新教程步骤 (TASK-087)

### 共享类型变更 (TASK-083)

- `packages/api-client/src/types.ts`:
  - User: email/username/phone 改为可空
  - LoginRequest: email 改为 identifier
  - RegisterRequest: 添加 username、phone，email 改为可选

### 国际化变更 (TASK-086, TASK-088)

#### 认证翻译
- `i18n/locales/en/auth.json`: 添加 identifier、username、phone 相关翻译
- `i18n/locales/zh/auth.json`: 添加中文翻译
- `i18n/locales/ja/auth.json`: 添加日文翻译

#### 新手引导翻译
- `i18n/locales/en/onboarding.json`: 添加教程步骤翻译
- `i18n/locales/zh/onboarding.json`: 添加中文翻译
- `i18n/locales/ja/onboarding.json`: 添加日文翻译

## 破坏性变更

1. **登录 API**: `POST /api/v1/auth/login` 请求体从 `{ email, password }` 改为 `{ identifier, password }`
2. **注册 API**: `POST /api/v1/auth/register` 请求体现在 email 可选，但必须提供 username/email/phone 之一
3. **User 类型**: email 字段从必填改为可空 (`string | null`)

## 向后兼容性

- 现有用户可继续使用邮箱登录
- OAuth 登录流程不受影响
- 旧版移动端需要更新以处理可空 email

## 验证清单

- [x] 后端编译成功
- [x] 前端编译成功
- [ ] 注册测试：仅用户名
- [ ] 注册测试：仅邮箱
- [ ] 注册测试：仅手机号
- [ ] 注册测试：无标识符应失败
- [ ] 登录测试：使用邮箱
- [ ] 登录测试：使用用户名
- [ ] 登录测试：使用手机号
- [ ] 登录测试：使用用户 ID
