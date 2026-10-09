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
    summary: '第一篇已发布文章，用来验证首页列表和 SSR。',
    content: '这是正文，用于验证 SSR。打开网页源代码应能看到标题 Hello Nuxt。',
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
    content: '草稿正文，前台详情也不应能打开。',
    status: 'draft',
    categorySlug: 'tech',
    categoryName: '技术',
    publishedAt: '2026-09-02',
  },
  {
    id: 3,
    title: '分类页示例',
    slug: 'category-demo',
    summary: '第二篇已发布文章，用来验证分类筛选。',
    content: '这篇同属技术分类，分类页应能同时列出 Hello Nuxt 和本篇。',
    status: 'published',
    categorySlug: 'tech',
    categoryName: '技术',
    publishedAt: '2026-09-03',
  },
]

// 首页列表
export function listPublishedPosts() {
  return posts.filter((post) => post.status === 'published')
}

// 根据slug获取文章——详情（只返回已发布）
export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug && post.status === 'published')
}

// 根据分类slug获取文章列表——分类页
export function listPostsByCategory(categorySlug: string) {
  return listPublishedPosts().filter((post) => post.categorySlug === categorySlug)
}
