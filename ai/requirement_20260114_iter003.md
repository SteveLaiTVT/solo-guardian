# TASK-005 & TASK-006: Check-in 模块实现

## 实现内容

### TASK-005: Check-in 数据库模型
1. **CheckIn 模型** - 每日签到记录
   - `id`: UUID 主键
   - `userId`: 用户外键
   - `checkInDate`: YYYY-MM-DD 格式日期字符串
   - `checkedInAt`: 签到时间戳
   - `note`: 可选备注 (最多500字)
   - 唯一约束: `userId + checkInDate` (每用户每天一条)

2. **CheckInSettings 模型** - 用户签到设置
   - `deadlineTime`: 截止时间 (默认 "10:00")
   - `reminderTime`: 提醒时间 (默认 "09:00")
   - `reminderEnabled`: 是否启用提醒
   - `timezone`: 用户时区 (默认 "Asia/Shanghai")

3. **User 模型更新** - 添加关联
   - `checkIns`: CheckIn[] 关联
   - `checkInSettings`: CheckInSettings? 一对一关联

4. **数据库迁移** - 20260114145459_add_checkin_models

### TASK-006: Check-in 模块实现

#### Repository 层 (check-in.repository.ts)
- `upsertCheckIn()` - 创建或更新签到记录 (upsert)
- `findByDate()` - 按日期查找签到
- `findHistory()` - 分页查询签到历史
- `getOrCreateSettings()` - 获取或创建默认设置
- `updateSettings()` - 更新设置

#### Service 层 (check-in.service.ts)
- `checkIn()` - 执行签到 (考虑时区)
- `getTodayStatus()` - 获取今日签到状态和是否超期
- `getHistory()` - 获取签到历史
- `getSettings()` - 获取用户设置
- `updateSettings()` - 更新用户设置
- `getTodayDateString()` - 时区感知的日期辅助函数
- `isOverdue()` - 判断是否超过截止时间

#### 模块注册
- CheckInModule 已注册到 AppModule

## API 端点
| 方法 | 路径 | 功能 |
|------|------|------|
| POST | /api/v1/check-ins | 创建签到 |
| GET | /api/v1/check-ins/today | 获取今日状态 |
| GET | /api/v1/check-ins | 获取签到历史 |
| GET | /api/v1/check-in-settings | 获取设置 |
| PUT | /api/v1/check-in-settings | 更新设置 |

## 待办事项
- Auth Guard 集成 (JwtAuthGuard 和 CurrentUser 装饰器待创建)
- Controller 中目前使用硬编码的 userId 占位符

## 文件变更
- `prisma/schema.prisma` - 新增 CheckIn 和 CheckInSettings 模型
- `src/modules/check-in/check-in.repository.ts` - 实现所有方法
- `src/modules/check-in/check-in.service.ts` - 实现所有方法
- `src/app.module.ts` - 注册 CheckInModule

## 构建验证
- `npm run build` 成功通过
- `npx prisma generate` 成功
- `npx prisma migrate dev` 成功
