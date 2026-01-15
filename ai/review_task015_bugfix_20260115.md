# C Session 代码审查 - TASK-015 Bug修复

## 审查任务
审查 IR-015-bugfix (紧急联系人模块Bug修复) 的实现报告

## 审查结果
**判定: PASS (通过)**

## 修复的Bug

### BUG-015-1 (P2): 路由遮蔽
- **问题**: @Put(':id') 在 @Put('reorder') 之前，导致 reorder 端点无法访问
- **修复**: 重新排序路由，reorder 在 :id 之前
- **验证**: controller.ts 第61-69行

### BUG-015-2 (P2): 软删除唯一约束冲突
- **问题**: 唯一约束不考虑 deletedAt，无法重新添加已删除的联系人
- **修复**: 使用部分唯一索引 (WHERE deleted_at IS NULL)
- **验证**: 新迁移文件创建部分索引

### BUG-015-3 (P2): 自动优先级冲突
- **问题**: 使用 count+1 分配优先级，删除后可能冲突
- **修复**: 添加 getMaxPriority() 方法
- **注意**: 被 BUG-015-5 更好的方案取代

### BUG-015-4 (P1): 重排序唯一约束违规
- **问题**: 交换优先级时多个UPDATE导致瞬时约束违规
- **修复**: 使用单个原子UPDATE与CASE表达式
- **验证**: repository.ts 第119-153行

### BUG-015-5 (P1): 自动优先级超出1-5范围
- **问题**: 稀疏优先级时 max+1 可能超过5
- **修复**: 在1-5范围内找最低可用槽位
- **验证**: service.ts 第63-75行

## 文件变更
| 文件 | 行数 | 变更 |
|------|------|------|
| controller.ts | 91 | 路由顺序调整 |
| service.ts | 180 | 优先级槽位查找 |
| repository.ts | 155 | 原子UPDATE、getMaxPriority |
| schema.prisma | 120 | 移除@@unique，添加文档 |
| migration.sql | 21 | 部分唯一索引 |

## 构建验证
- TypeScript 编译: 通过

## 输出文件
- 审查报告: `.claude/handoffs/iter-006/RR-015-bugfix-emergency-contacts.yaml`

## 下一步
1. A Session 更新 DESIGN_STATE.yaml - 标记bugfix完成
2. 考虑为这些边缘情况添加E2E测试
