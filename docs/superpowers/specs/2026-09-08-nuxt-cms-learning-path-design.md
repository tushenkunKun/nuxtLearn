# Nuxt.js 从零学习路线与轻量 CMS 项目设计

**日期：** 2026-09-08  
**学习者画像：** 有 Vue 基础的 Web 前端工程师  
**学习方式：** 项目切片驱动（方案 2）——每关只学一批 Nuxt 能力，立刻落到 CMS 的可运行切片上  
**节奏：** 按关卡推进，不设固定周数；每关过验收后再进入下一关

---

## 1. 目标与成功标准

### 1.1 最终成品

一个可本地运行、可复制改造的 **轻量 CMS 模板**：

- **前台（SSR）：** 文章列表、文章详情、按分类浏览
- **后台（需登录）：** 登录、文章 CRUD、草稿/发布、简单分类管理
- **服务端：** Nitro API + SQLite + Session 鉴权
- **样式：** Tailwind CSS + 少量自封装基础组件

### 1.2 范围策略

| 层级 | 内容 |
|------|------|
| **主线 MVP（A）** | 见第 5 节功能清单 |
| **可选进阶（B）** | 标签、封面上传、简单 RBAC、全站搜索、更完整 SEO/部署说明 |
| **明确不做（主线）** | 评论、媒体库、多语言、暗色主题、邮件、OAuth、复杂权限、生产监控 |

### 1.3 成功标准

1. **能讲清：** Nuxt 相对 Vue SPA 多了什么；本项目中 SSR / API / 中间件各解决什么问题
2. **能独立改：** 新增一个字段（如「阅读时长」）能从 DB → API → 前台/后台一路改通
3. **能复用：** 去掉业务文案后，仓库仍是可复制的 Nuxt 全栈脚手架
4. **能演示：** 「游客看前台 → 登录后台发文 → 前台立刻可见」完整闭环

---

## 2. 学习方法

采用 **项目切片驱动**，不用「先通读文档再一次性做项目」。

每关固定结构：

1. **必读概念** — 少量、够用即可
2. **动手任务** — 改本仓库中的具体文件/功能
3. **验收清单** — 通过后再开下一关

协作约定：

- 学习者说「开始关卡 N」后，再给出该关讲解与具体改法
- 不提前把后续关卡完整代码一次性堆进仓库
- 卡关时贴报错/现状，对照验收清单过关

---

## 3. 技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 框架 | Nuxt 3（或脚手架默认的稳定 Nuxt 3/4） | 以 `nuxi` 初始化时的稳定版本为准 |
| 语言 | TypeScript（strict） | 全栈类型贯穿 |
| 样式 | Tailwind CSS（`@nuxtjs/tailwindcss`） | 学习向、模板干净 |
| 服务端 | Nitro（`server/api`） | 不另起 Express |
| 数据库 | SQLite + Drizzle ORM（备选 Prisma） | 第 4 关开始前二选一敲定；默认倾向 Drizzle（更轻） |
| 鉴权 | 自建 Session（httpOnly Cookie + 服务端 session） | 适合 Cookie 会话教学；不引入过重 Auth 套件 |
| 校验 | Zod（`shared/` 前后端共用） | 表单与 API 同一套规则 |
| 状态 | 优先 `useState` / `useAsyncData`；必要时再 Pinia | 先吃透 Nuxt 数据流 |

---

## 4. 目标目录结构（MVP 结束时）

按功能逐步生长，不提前建空目录。以下为 MVP 完成时的目标形状：

```text
nuxtLearn/
├── app.vue
├── nuxt.config.ts
├── pages/
│   ├── index.vue
│   ├── posts/[slug].vue
│   ├── categories/[slug].vue
│   ├── login.vue
│   └── admin/
│       ├── index.vue
│       └── posts/
│           ├── index.vue
│           ├── new.vue
│           └── [id].vue
├── layouts/
│   ├── default.vue
│   └── admin.vue
├── components/
│   ├── AppButton.vue
│   ├── AppInput.vue
│   └── ...
├── composables/
│   └── useAuth.ts
├── middleware/
│   └── auth.ts
├── server/
│   ├── api/
│   │   ├── auth/login.post.ts
│   │   ├── auth/logout.post.ts
│   │   ├── posts/...
│   │   └── categories/...
│   ├── database/
│   └── utils/
├── shared/
└── public/
```

---

## 5. MVP 功能清单

### 前台

- [ ] 首页：已发布文章列表（标题、摘要、分类、日期）
- [ ] 文章详情（按 slug）
- [ ] 按分类浏览文章
- [ ] 基础 SEO（title / description）
- [ ] 404 页

### 后台（需登录）

- [ ] 登录 / 登出
- [ ] 文章列表（含草稿/已发布状态）
- [ ] 新建 / 编辑 / 删除文章
- [ ] 草稿 ↔ 发布切换
- [ ] 分类简单管理（或至少文章可选分类）

### 工程

- [ ] TypeScript + Tailwind
- [ ] Nitro API + SQLite 持久化
- [ ] Session 鉴权保护 `/admin`
- [ ] Zod 校验（至少覆盖文章写入）
- [ ] README：安装、迁移/种子、启动步骤

---

## 6. 关卡设计

### 关卡 0：环境与心智模型

- **概念：** Nuxt = Vue + 约定路由 + Nitro + 渲染模式；与 Vue SPA 的差异
- **任务：** 官方脚手架初始化本仓库；跑通 `dev`；改首页确认热更新
- **验收：** 能说明 SSR / SPA / SSG 适用场景；项目可本地启动

### 关卡 1：约定式路由与布局

- **概念：** `pages/`、动态路由、`layouts/`、`NuxtLink`、嵌套路由
- **任务：** 前台 `default` + 后台 `admin` 布局；列表/详情/登录/后台空页骨架
- **验收：** 路由齐全，布局切换正确，导航可用

### 关卡 2：数据获取与渲染模式

- **概念：** `useAsyncData` / `useFetch`、服务端与客户端执行时机、SSR payload
- **任务：** mock/composable 提供文章；首页 SSR 列表 + 详情按 slug 渲染
- **验收：** 查看网页源代码或禁用 JS 仍能看到文章标题（证明 SSR）

### 关卡 3：Nitro 服务端 API

- **概念：** `server/api`、HTTP 方法约定、错误处理
- **任务：** 文章 GET/POST（可先内存）；前台改为调用真 API
- **验收：** curl/浏览器可调通；页面数据来自 API

### 关卡 4：数据库持久化

- **概念：** ORM schema、迁移、种子数据、Nitro 内访问 DB
- **任务：** SQLite 表 `users` / `posts` / `categories`；API 读写库；种子 2～3 篇文章
- **验收：** 重启进程后数据仍在；CRUD 成功

### 关卡 5：鉴权与中间件

- **概念：** Cookie Session、服务端鉴权、路由中间件
- **任务：** 种子管理员、登录/登出、`auth` 中间件保护 `/admin/**`
- **验收：** 未登录进后台被重定向；登录后可进；登出后失效

### 关卡 6：后台表单与校验

- **概念：** 表单绑定、Zod 共用校验、草稿 vs 发布
- **任务：** 文章新建/编辑/删除/发布；分类简单管理；前后端同一 schema
- **验收：** 非法提交被拒；草稿前台不可见；发布后前台可见

### 关卡 7：SEO、错误页与 MVP 打磨

- **概念：** `useSeoMeta` / `useHead`、错误页、基础 UX
- **任务：** 详情页动态 meta、404、小幅 UI 打磨、README
- **验收：** 第 5 节 MVP 清单全部勾选；按 README 可冷启动

### 可选进阶 ★（标准版 B）

标签、封面上传、角色（管理员/编辑）、全站搜索、部署说明——主线全部过关后再开。

---

## 7. 数据模型（MVP）

```text
User
  - id, email, passwordHash, name, createdAt

Category
  - id, name, slug, createdAt

Post
  - id, title, slug, summary, content, status(draft|published)
  - categoryId, authorId, publishedAt, createdAt, updatedAt

Session（若表存储）
  - id, userId, tokenHash, expiresAt, createdAt
```

字段可在第 4 关实现时微调，但职责不变。

---

## 8. 关键用户流程

1. 游客打开首页 → SSR 看到已发布文章
2. 进入详情 / 按分类浏览
3. 访问 `/admin` → 未登录跳转 `/login`
4. 管理员登录 → 进入后台
5. 新建草稿 → 前台不可见 → 发布 → 前台列表与详情可见
6. 登出 → 再进 `/admin` 被拦

---

## 9. 下一步

1. 学习者审查并批准本规格
2. 编写分关可执行计划：`docs/superpowers/plans/2026-09-08-nuxt-cms-learning-path.md`
3. 学习者说「开始关卡 0」后开始实现
