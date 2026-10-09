<script setup lang="ts">
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
    <NuxtLink to="/categories/tech" class="inline-block mt-6">技术分类</NuxtLink>
  </div>
</template>
