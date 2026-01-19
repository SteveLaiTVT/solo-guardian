当前 refet user-web 与 Flutter 移动端使用 API 接口，补齐 auth 全流程（register/login/refresh/logout），并验证 backend 全流程。

已完成的变更：
- backend auth 接口统一返回 { success: true, data }，并修复 refresh/logout 返回结构。
- packages/api-client 适配新的 auth 返回结构，refresh 拦截也同步更新。
- user-web register/login 补充 refresh 调用，logout 改为调用 API。
- Flutter auth datasource 与 refresh 拦截适配 success/data 返回格式，登录/注册流程增加 refresh 调用。
- 新增 backend auth 集成测试（真实 DB），覆盖 register/login/refresh/logout 和 refresh token 复用失败场景。
- 更新 e2e auth fixtures 与 auth 测试字段选择器，保证与当前登录/注册表单一致。

需要关注：
- e2e/.auth/user.json 是历史存储状态，运行 e2e 前会被 setup 覆盖。
- admin-web refresh 解析改为 data.tokens，若 admin 登录 API 结构不同需要同步。

建议验证步骤：
- backend: cd apps/backend && pnpm run test -- auth.integration.spec.ts
- e2e: cd e2e && pnpm run test -- auth.spec.ts
- 手工：user-web 注册/登录后检查 refresh 是否正常，移动端登录后查看 token 刷新是否成功。
