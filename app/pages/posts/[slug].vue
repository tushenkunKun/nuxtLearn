<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
  () => `post-${route.params.slug}`,
  async () => getPostBySlug(String(route.params.slug)),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}
</script>

<template>
  <article>
    <h1 class="text-2xl font-semibold">{{ post?.title }}</h1>
    <p class="text-sm opacity-70 mt-2">
      {{ post?.categoryName }} · {{ post?.publishedAt }}
    </p>
    <p class="mt-6">{{ post?.content }}</p>
    <NuxtLink to="/" class="inline-block mt-6">返回</NuxtLink>
  </article>
</template>
