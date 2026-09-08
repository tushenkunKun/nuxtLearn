# Nuxt 轻量 CMS 学习路径 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。  
> **面向学习者：** 也可以自己按关卡执行；每关说「开始关卡 N」让助手陪练亦可。

**目标：** 用项目切片方式，从零建成可复用的 Nuxt 全栈轻量 CMS（前台 SSR + 后台管理 + Nitro + SQLite + Session 鉴权）。

**架构：** 单仓 Nuxt 应用；`pages/` 约定路由区分前台与 `/admin`；`server/api` 提供 REST；SQLite + Drizzle 持久化；httpOnly Cookie Session 保护后台；Zod schema 放在 `shared/` 前后端共用；Tailwind 做样式。

**技术栈：** Nuxt（脚手架稳定版）· TypeScript · Tailwind CSS · Nitro · SQLite · Drizzle ORM · Zod · Session Cookie

**规格依据：** `docs/superpowers/specs/2026-09-08-nuxt-cms-learning-path-design.md`

**验证策略：** 页面与路由以人工验收清单为主；`shared` 校验与部分 server util 用 Vitest；每关结束必须能演示该关闭环后再 commit。

---

## 文件结构（MVP 结束时）

| 路径 | 职责 |
|------|------|
| `nuxt.config.ts` | 模块与运行时配置 |
| `app.vue` | 根组件，挂载 `NuxtLayout` / `NuxtPage` |
| `pages/index.vue` | 前台首页文章列表 |
| `pages/posts/[slug].vue` | 文章详情 |
| `pages/categories/[slug].vue` | 分类文章列表 |
| `pages/login.vue` | 登录 |
| `pages/admin/index.vue` | 后台首页（可重定向到文章列表） |
| `pages/admin/posts/index.vue` | 后台文章列表 |
| `pages/admin/posts/new.vue` | 新建文章 |
| `pages/admin/posts/[id].vue` | 编辑文章 |
| `layouts/default.vue` | 前台布局 |
| `layouts/admin.vue` | 后台布局 |
| `middleware/auth.ts` | 保护 `/admin/**` |
| `composables/useAuth.ts` | 登录态读取/登出 |
| `components/AppButton.vue` | 按钮 |
| `components/AppInput.vue` | 输入框 |
| `shared/schemas/post.ts` | 文章 Zod schema + 类型 |
| `shared/schemas/auth.ts` | 登录 Zod schema |
| `server/database/schema.ts` | Drizzle 表定义 |
| `server/database/client.ts` | DB 客户端 |
| `server/utils/auth.ts` | Session 创建/校验/销毁 |
| `server/utils/password.ts` | 密码哈希 |
| `server/api/auth/*.ts` | 登录/登出/me |
| `server/api/posts/*.ts` | 文章 CRUD |
| `server/api/categories/*.ts` | 分类读写 |
| `server/api/seed.post.ts`（可选）或 `scripts/seed.ts` | 种子数据 |
| `README.md` | 安装与启动说明 |
| `.gitignore` | 忽略 node_modules、`.data`、`.env`、系统文件 |

---

### 任务 0：关卡 0 — 环境与心智模型

**文件：**
- 创建：脚手架生成的 Nuxt 项目文件、`.gitignore`、（可选）`README.md` 初稿
- 保留：已有 `docs/superpowers/**`

- [ ] **步骤 0.1：确认 Node 版本**

```bash
# 若使用 nvm：
source ~/.nvm/nvm.sh
nvm use 24   # 或 20 LTS；需 Node >= 18
node -v && npm -v
```

预期：Node 18+ 且 npm 可用。

- [ ] **步骤 0.2：在已有 docs 的目录中初始化 Nuxt**

目录非空，使用官方脚手架并保留 `docs/`：

```bash
cd /Users/zqzz/Desktop/mytest/nuxtLearn
npx nuxi@latest init . --force
```

交互选项建议：
- Package manager: `npm`
- SSR: Yes
- 若询问 ESLint/Prettier：可按喜好，推荐开 ESLint

若 `nuxi` 拒绝非空目录，则：

```bash
npx nuxi@latest init nuxt-tmp
# 将 nuxt-tmp 内文件移到仓库根（勿覆盖 docs/）
rsync -a nuxt-tmp/ ./ --exclude docs
rm -rf nuxt-tmp
```

- [ ] **步骤 0.3：安装依赖并启动**

```bash
npm install
npm run dev
```

预期：终端显示本地 URL（通常 `http://localhost:3000`），浏览器能打开欢迎页。

- [ ] **步骤 0.4：改首页确认热更新**

编辑脚手架生成的首页（可能是 `app.vue` 或 `pages/index.vue`），加入一行：

```vue
<p>Nuxt CMS Learn — Gate 0</p>
```

保存后浏览器应自动更新。

- [ ] **步骤 0.5：补全 `.gitignore`**

确保包含（按需合并，勿删脚手架已有项）：

```gitignore
node_modules
.nuxt
.output
.data
*.db
.env
.DS_Store
docs/.DS_Store
```

- [ ] **步骤 0.6：心智模型自检（口头/笔记，不写代码）**

能回答：
1. Nuxt 比「Vite + Vue Router SPA」多了哪些约定？
2. SSR / SPA / SSG 各适合什么场景？本 CMS 前台为何用 SSR？

- [ ] **步骤 0.7：Commit**

```bash
git add -A
git status   # 确认未提交 .env、*.db、node_modules
git commit -m "$(cat <<'EOF'
chore: scaffold Nuxt app for CMS learning path

Initialize the Nuxt project so Gate 0 environment and mental model checks can pass.
EOF
)"
```

**关卡 0 验收：** `npm run dev` 可启动；热更新有效；能说清 SSR/SPA/SSG。

---

### 任务 1：关卡 1 — 约定式路由与布局

**文件：**
- 创建：`layouts/default.vue`、`layouts/admin.vue`
- 创建：`pages/index.vue`、`pages/posts/[slug].vue`、`pages/categories/[slug].vue`、`pages/login.vue`
- 创建：`pages/admin/index.vue`、`pages/admin/posts/index.vue`、`pages/admin/posts/new.vue`、`pages/admin/posts/[id].vue`
- 修改：`app.vue`

- [ ] **步骤 1.1：根组件使用 Layout + Page**

`app.vue`：

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **步骤 1.2：前台布局**

`layouts/default.vue`：

```vue
<template>
  <div class="min-h-screen">
    <header class="border-b px-4 py-3 flex gap-4 items-center">
      <NuxtLink to="/">CMS</NuxtLink>
      <NuxtLink to="/login">登录</NuxtLink>
      <NuxtLink to="/admin">后台</NuxtLink>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
```

（此时可尚无 Tailwind；若尚未安装，先用上述 class，关卡 1 末或关卡 2 初再装 Tailwind。）

- [ ] **步骤 1.3：后台布局**

`layouts/admin.vue`：

```vue
<template>
  <div class="min-h-screen flex">
    <aside class="w-56 border-r p-4 space-y-2">
      <p class="font-semibold">Admin</p>
      <NuxtLink to="/admin/posts">文章</NuxtLink>
      <NuxtLink to="/">回前台</NuxtLink>
    </aside>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
```

- [ ] **步骤 1.4：页面骨架（无真实数据）**

`pages/index.vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div>
    <h1>文章列表</h1>
    <p>Gate 1 骨架 — 稍后接数据</p>
    <NuxtLink to="/posts/hello-world">示例详情链接</NuxtLink>
  </div>
</template>
```

`pages/posts/[slug].vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default' })
const route = useRoute()
</script>

<template>
  <div>
    <h1>文章：{{ route.params.slug }}</h1>
    <NuxtLink to="/">返回</NuxtLink>
  </div>
</template>
```

`pages/categories/[slug].vue`：同类骨架，展示 `route.params.slug`。

`pages/login.vue`：标题「登录」+ 占位表单（尚不提交）。

`pages/admin/index.vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
await navigateTo('/admin/posts')
</script>

<template>
  <div />
</template>
```

`pages/admin/posts/index.vue` / `new.vue` / `[id].vue`：均 `layout: 'admin'`，标题区分列表/新建/编辑。

- [ ] **步骤 1.5：手动验收路由**

浏览器依次打开：
- `/`
- `/posts/hello-world`
- `/categories/tech`
- `/login`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/1`

预期：前台页用 default 顶栏；后台页用侧栏；无 404（除故意未建路径）。

- [ ] **步骤 1.6：Commit**

```bash
git add layouts pages app.vue
git commit -m "$(cat <<'EOF'
feat: add front and admin route/layout skeletons

Establish Nuxt file-based routing and dual layouts for the CMS shell.
EOF
)"
```

**关卡 1 验收：** 路由齐全，布局切换正确，导航可用。

---

### 任务 2：关卡 2 — 数据获取、SSR 与 Tailwind

**文件：**
- 创建：`composables/usePosts.ts`（mock）
- 修改：`pages/index.vue`、`pages/posts/[slug].vue`、`pages/categories/[slug].vue`
- 修改：`nuxt.config.ts`（接入 Tailwind）

- [ ] **步骤 2.1：安装 Tailwind 模块**

```bash
npx nuxi@latest module add tailwindcss
```

按模块提示确认 `nuxt.config.ts` 已包含 `@nuxtjs/tailwindcss`。

- [ ] **步骤 2.2：创建 mock 数据 composable**

`composables/usePosts.ts`：

```ts
export type MockPost = {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  status: 'draft' | 'published'
  categorySlug: string
  categoryName: string
  publishedAt: string
}

const posts: MockPost[] = [
  {
    id: 1,
    title: 'Hello Nuxt',
    slug: 'hello-nuxt',
    summary: '第一篇已发布文章',
    content: '这是正文，用于验证 SSR。',
    status: 'published',
    categorySlug: 'tech',
    categoryName: '技术',
    publishedAt: '2026-09-01',
  },
  {
    id: 2,
    title: 'Draft Only',
    slug: 'draft-only',
    summary: '草稿不应出现在前台列表',
    content: '草稿正文',
    status: 'draft',
    categorySlug: 'tech',
    categoryName: '技术',
    publishedAt: '2026-09-02',
  },
]

export function listPublishedPosts() {
  return posts.filter((p) => p.status === 'published')
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug && p.status === 'published')
}

export function listPostsByCategory(categorySlug: string) {
  return listPublishedPosts().filter((p) => p.categorySlug === categorySlug)
}
```

- [ ] **步骤 2.3：首页 SSR 拉列表**

`pages/index.vue`：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: posts } = await useAsyncData('published-posts', async () => {
  return listPublishedPosts()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">文章</h1>
    <ul class="space-y-4">
      <li v-for="post in posts" :key="post.id" class="border-b pb-4">
        <NuxtLink :to="`/posts/${post.slug}`" class="text-lg font-medium">
          {{ post.title }}
        </NuxtLink>
        <p class="text-sm opacity-70">{{ post.summary }}</p>
        <p class="text-xs mt-1">
          {{ post.categoryName }} · {{ post.publishedAt }}
        </p>
      </li>
    </ul>
  </div>
</template>
```

- [ ] **步骤 2.4：详情与分类页**

`pages/posts/[slug].vue`：用 `useAsyncData` + `getPostBySlug`；找不到时 `throw createError({ statusCode: 404, statusMessage: 'Post not found' })`。

`pages/categories/[slug].vue`：用 `listPostsByCategory` 渲染列表。

- [ ] **步骤 2.5：验收 SSR**

```bash
npm run dev
# 浏览器打开首页 → 右键「查看网页源代码」
# 源码中应出现「Hello Nuxt」，且不应出现「Draft Only」
```

- [ ] **步骤 2.6：Commit**

```bash
git commit -am "$(cat <<'EOF'
feat: SSR mock posts on public pages with Tailwind

Prove Nuxt data fetching and server-rendered HTML before introducing APIs.
EOF
)"
```

（若有新文件需 `git add` 后再 commit。）

**关卡 2 验收：** 源代码可见已发布标题；草稿不在前台列表。

---

### 任务 3：关卡 3 — Nitro API（内存存储）

**文件：**
- 创建：`server/utils/postStore.ts`
- 创建：`server/api/posts/index.get.ts`、`server/api/posts/index.post.ts`、`server/api/posts/[slug].get.ts`
- 修改：前台页面改为 `useFetch`/`$fetch` 调 API
- 删除或停用：页面对 `composables/usePosts.ts` 的直接依赖（composable 可删可留作对照）

- [ ] **步骤 3.1：内存 store**

`server/utils/postStore.ts`：把关卡 2 的 mock 数组移到服务端模块级变量；导出 `listPublished`、`getBySlug`、`create`（create 先简单 push）。

- [ ] **步骤 3.2：列表与详情 API**

`server/api/posts/index.get.ts`：

```ts
export default defineEventHandler(() => {
  return listPublished()
})
```

`server/api/posts/[slug].get.ts`：

```ts
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const post = getBySlug(slug!)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  return post
})
```

`server/api/posts/index.post.ts`：读取 body，校验必要字段，`create` 后返回；暂不鉴权（关卡 5 再加）。

- [ ] **步骤 3.3：前台改打 API**

首页：

```ts
const { data: posts } = await useFetch('/api/posts')
```

详情：

```ts
const route = useRoute()
const { data: post } = await useFetch(() => `/api/posts/${route.params.slug}`)
```

- [ ] **步骤 3.4：用 curl 验收 API**

```bash
curl -s http://localhost:3000/api/posts | head
curl -s http://localhost:3000/api/posts/hello-nuxt
curl -s -X POST http://localhost:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"API Post","slug":"api-post","summary":"s","content":"c","status":"published","categorySlug":"tech","categoryName":"技术"}'
```

预期：GET 返回 JSON；POST 后再次 GET 列表可见新文章（进程不重启前）。

- [ ] **步骤 3.5：Commit**

```bash
git add server pages
git commit -m "$(cat <<'EOF'
feat: replace mock composable with Nitro in-memory post API

Move public pages onto real HTTP handlers before adding a database.
EOF
)"
```

**关卡 3 验收：** curl 与页面均走 `/api/posts`；重启后内存数据丢失（预期，关卡 4 解决）。

---

### 任务 4：关卡 4 — SQLite + Drizzle 持久化

**文件：**
- 创建：`server/database/schema.ts`、`server/database/client.ts`、`drizzle.config.ts`
- 创建：`package.json` scripts：`db:generate` / `db:migrate` / `db:seed`
- 创建：`server/database/seed.ts` 或 `npm` 可运行的 seed 脚本
- 修改：所有 post/category API 改为查库
- 删除：内存 `postStore.ts`

- [ ] **步骤 4.1：安装依赖**

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
# 若 better-sqlite3 原生编译失败，可改用 npm install drizzle-orm && 使用 libsql 驱动；本计划默认 better-sqlite3
```

- [ ] **步骤 4.2：定义 schema**

`server/database/schema.ts`（字段对齐规格）：

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  authorId: integer('author_id').references(() => users.id),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
```

- [ ] **步骤 4.3：DB client + drizzle config**

`server/database/client.ts`：单例连接 `.data/cms.db`（确保目录存在）。

`drizzle.config.ts`：dialect `sqlite`，schema 指向 `server/database/schema.ts`，out 指向 `server/database/migrations`。

- [ ] **步骤 4.4：迁移与种子**

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Seed 至少：1 个分类 `tech`、2～3 篇文章（含 1 篇 draft）、1 个管理员用户（密码哈希可先占位，关卡 5 用真哈希重跑 seed）。

- [ ] **步骤 4.5：改写 API**

- `GET /api/posts`：只返回 `status = published`，join 分类名  
- `GET /api/posts/:slug`：已发布详情  
- `GET /api/categories/:slug/posts`（或保留 pages 内组合查询）  
- 管理用接口可先：`GET /api/admin/posts`（含草稿）、`POST /api/posts` 写入 DB——鉴权关卡 5 再收紧

- [ ] **步骤 4.6：验收持久化**

```bash
curl -s http://localhost:3000/api/posts
# 停掉 dev 再启动
npm run dev
curl -s http://localhost:3000/api/posts
```

预期：重启后列表不变。确认 `.data/cms.db` 存在且已被 `.gitignore`。

- [ ] **步骤 4.7：Commit**

```bash
git add server drizzle.config.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: persist posts and categories with SQLite and Drizzle

Replace in-memory store so CMS data survives process restarts.
EOF
)"
```

**关卡 4 验收：** 重启数据仍在；CRUD 读写库成功。

---

### 任务 5：关卡 5 — Session 鉴权与中间件

**文件：**
- 创建：`server/utils/password.ts`、`server/utils/auth.ts`
- 创建：`server/api/auth/login.post.ts`、`logout.post.ts`、`me.get.ts`
- 创建：`middleware/auth.ts`、`composables/useAuth.ts`
- 修改：`pages/login.vue`、种子用户密码、需登录的 admin API
- 修改：admin 相关 `pages/**` 的 `definePageMeta({ middleware: 'auth' })`

- [ ] **步骤 5.1：密码工具**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

`server/utils/password.ts`：`hashPassword` / `verifyPassword`（bcryptjs）。

- [ ] **步骤 5.2：Session 工具**

`server/utils/auth.ts`：
- `createSession(userId)`：随机 token，存 `tokenHash` 到 `sessions`，Set-Cookie（httpOnly、path=/、sameSite=lax）
- `getSessionUser(event)`：读 Cookie，查未过期 session，返回 user
- `destroySession(event)`：删 DB 行并清 Cookie

Cookie 名建议：`cms_session`。

- [ ] **步骤 5.3：Auth API**

- `POST /api/auth/login`：email + password → 校验 → createSession  
- `POST /api/auth/logout`：destroySession  
- `GET /api/auth/me`：有会话返回用户，否则 401

- [ ] **步骤 5.4：更新 seed 管理员**

例如：`admin@example.com` / `password123`（仅本地学习用，README 写明）。

- [ ] **步骤 5.5：路由中间件**

`middleware/auth.ts`：

```ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  const { data } = await useFetch('/api/auth/me', { key: 'auth-me' })
  if (!data.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
```

在 `pages/admin/**` 使用 `definePageMeta({ layout: 'admin', middleware: 'auth' })`。

- [ ] **步骤 5.6：登录页接线**

`pages/login.vue`：提交 → `POST /api/auth/login` → 跳转 `redirect` 或 `/admin`。

`composables/useAuth.ts`：封装 `me`、`logout`。

- [ ] **步骤 5.7：保护写接口**

所有创建/更新/删除文章、分类的 handler 开头：

```ts
const user = await getSessionUser(event)
if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
```

- [ ] **步骤 5.8：验收**

1. 无 Cookie 访问 `/admin/posts` → 跳转登录  
2. 登录成功 → 可进后台  
3. 登出 → 再进后台被拦  
4. 无 Cookie `POST /api/posts` → 401

- [ ] **步骤 5.9：Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add cookie session auth and protect admin routes

Gate public writes and /admin pages behind server-validated sessions.
EOF
)"
```

**关卡 5 验收：** 登录闭环与 401 保护均成立。

---

### 任务 6：关卡 6 — 后台表单、Zod 与完整 CRUD

**文件：**
- 创建：`shared/schemas/post.ts`、`shared/schemas/auth.ts`、`shared/schemas/category.ts`
- 创建：`components/AppButton.vue`、`components/AppInput.vue`（可选 AppTextarea）
- 创建/修改：admin 文章页、分类管理（最小：文章表单内选分类 + `server/api/categories`）
- 修改：相关 API 用 Zod `safeParse`

- [ ] **步骤 6.1：安装 Zod 并写 schema**

```bash
npm install zod
```

`shared/schemas/post.ts` 示例：

```ts
import { z } from 'zod'

export const postWriteSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1).max(500),
  content: z.string().min(1),
  status: z.enum(['draft', 'published']),
  categoryId: z.number().int().positive(),
})

export type PostWriteInput = z.infer<typeof postWriteSchema>
```

登录 schema 同理。

- [ ] **步骤 6.2：配置 Nuxt 识别 shared**

在 `nuxt.config.ts` 确保可 import `#shared/...` 或使用相对路径 `@/shared/...`。若需别名：

```ts
export default defineNuxtConfig({
  // ...
  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },
})
```

（`fileURLToPath` / `URL` 从 `node:url` 引入。）

- [ ] **步骤 6.3：API 接入 Zod**

POST/PUT body：`postWriteSchema.safeParse`；失败返回 400 + `error.flatten()`。

- [ ] **步骤 6.4：后台列表与表单页**

- `/admin/posts`：表格列出全部状态；操作：编辑、删除、快速发布  
- `/admin/posts/new`、`/admin/posts/[id]`：表单绑定 title/slug/summary/content/status/categoryId  
- 提交调用受保护 API  
- 删除：`DELETE /api/admin/posts/:id`（或等价路径）

- [ ] **步骤 6.5：前台可见性规则**

公开 GET 仅 `published`；草稿仅后台可见。发布时写 `publishedAt`。

- [ ] **步骤 6.6：验收**

1. 非法 slug（含空格）→ 400  
2. 新建草稿 → 前台列表无  
3. 改为 published → 前台可见  
4. 删除后前台 404

- [ ] **步骤 6.7：Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: admin post CRUD with shared Zod validation

Complete draft/publish workflow and shared client/server schemas.
EOF
)"
```

**关卡 6 验收：** CRUD + 草稿/发布规则全部满足。

---

### 任务 7：关卡 7 — SEO、404、README 与 MVP 打磨

**文件：**
- 修改：`pages/posts/[slug].vue`（`useSeoMeta`）
- 创建：`error.vue`（或使用 Nuxt 默认错误页自定义）
- 创建/完善：`README.md`
- 小改：布局与基础组件视觉一致性（保持克制，不做大改版）

- [ ] **步骤 7.1：详情 SEO**

```ts
useSeoMeta({
  title: () => post.value?.title ?? '文章',
  description: () => post.value?.summary ?? '',
})
```

首页也可设站点级 title。

- [ ] **步骤 7.2：错误页**

`error.vue`：展示 statusCode / message，提供回首页链接。故意访问 `/posts/not-exists` 应友好 404。

- [ ] **步骤 7.3：README**

至少包含：
- 环境要求（Node 版本）
- `npm install`
- DB migrate / seed 命令
- `npm run dev`
- 默认管理员账号
- 项目关卡说明（链接到 specs/plans）

- [ ] **步骤 7.4：对照规格第 5 节 MVP 清单逐项勾选**

打开 `docs/superpowers/specs/2026-09-08-nuxt-cms-learning-path-design.md`，把已完成项改为 `[x]`。

- [ ] **步骤 7.5：冷启动演练**

```bash
# 模拟新人：
rm -rf .nuxt node_modules
npm install
npm run db:migrate   # 以实际 script 名为准
npm run db:seed
npm run dev
```

走完：游客浏览 → 登录 → 发文 → 前台可见 → 登出。

- [ ] **步骤 7.6：Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: finish MVP polish with SEO, error page, and README

Close the learning-path main track with a demonstrable reusable CMS template.
EOF
)"
```

**关卡 7 验收：** MVP 清单全部勾选；按 README 可冷启动演示闭环。

---

### 任务 8（可选）：进阶 B

仅在主线完成后执行，本计划不展开逐步代码。候选增量：

1. 标签（多对多）  
2. 封面图上传（`server/api` + `public/uploads` 或对象存储）  
3. 简单 RBAC（admin / editor）  
4. 标题/正文搜索 API  
5. 生产部署说明（Node 托管或相关平台）

每项单独开短计划或说「开始进阶：标签」再实现。

---

## 自检（对照规格）

| 规格章节 | 对应任务 |
|----------|----------|
| 关卡 0–7 | 任务 0–7 |
| 技术栈 | 任务 0/2/4/5/6 |
| MVP 清单 | 任务 7.4 勾选 |
| 数据模型 | 任务 4 schema |
| 可选进阶 B | 任务 8 |
| 成功标准 | 任务 7.5 演示 + 学习者自述 |

占位符扫描：无「TODO/待定」实现步骤；Drizzle 为默认 ORM；Prisma 仅作规格中的备选，本计划不双轨。

---

## 执行交接

计划已保存到 `docs/superpowers/plans/2026-09-08-nuxt-cms-learning-path.md`。

**两种执行方式：**

1. **子代理驱动（推荐）** — 每个任务调度一个新的子代理，任务间审查，快速迭代  
2. **内联执行** — 在当前会话用 executing-plans 按关卡推进，设检查点  

**学习陪练（也推荐）：** 你直接说 **「开始关卡 0」**，我们按本计划逐步做，每关验收后再进下一关。

选哪种方式？
