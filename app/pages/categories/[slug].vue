<script setup lang="ts">
const route = useRoute()

const { data: posts } = await useAsyncData(
  () => `category-${route.params.slug}`,
  async () => listPostsByCategory(String(route.params.slug)),
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">分类：{{ route.params.slug }}</h1>
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
    <NuxtLink to="/" class="inline-block mt-6">返回</NuxtLink>
  </div>
</template>
