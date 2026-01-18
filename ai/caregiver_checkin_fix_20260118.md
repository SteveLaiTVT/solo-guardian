# 修复：允许所有已接受关系的看护者代为签到

## 问题描述
用户在尝试为长辈代为签到时收到错误：
```json
{"error": {"code": "VAL_2001", "message": "Only caretakers can check in on behalf of elders"}}
```

## 原因分析
`caregiver.service.ts` 中的 `checkInOnBehalf` 方法限制了只有 `relationshipType === 'caretaker'` 的用户才能代为签到。这个限制过于严格，因为家人（family）和普通看护者（caregiver）也应该能够帮助签到。

## 解决方案
修改验证逻辑，改为检查关系是否已被接受（`isAccepted`），而不是检查关系类型：

### 修改的文件

1. **caregiver.service.ts**
   - 将 `relationshipType !== 'caretaker'` 检查改为 `!relation.isAccepted`
   - 更新错误消息："Relationship must be accepted before checking in on behalf"
   - 更新日志消息和注释

2. **caregiver.repository.ts**
   - `getRelationByUsers` 返回类型添加 `isAccepted` 字段
   - 查询时选择 `isAccepted` 字段

3. **caregiver.service.spec.ts**
   - 更新所有使用 `getRelationByUsers` 的测试用例，添加 `isAccepted` 字段
   - 添加新测试："should allow any accepted caregiver to check in on behalf"
   - 将 "should throw BadRequestException when not caretaker" 改为 "should throw BadRequestException when relation not accepted"

## 提交信息
```
fix(caregiver): allow any accepted caregiver to check in on behalf

Previously only users with relationshipType 'caretaker' could check in
on behalf of elders. This was too restrictive since family members and
regular caregivers should also be able to help if they have an accepted
relationship.

Changes:
- Updated checkInOnBehalf to check isAccepted instead of relationshipType
- Added isAccepted field to getRelationByUsers return type
- Updated tests to reflect new behavior
```

## 测试结果
32 个测试全部通过，包括新增的测试用例。
