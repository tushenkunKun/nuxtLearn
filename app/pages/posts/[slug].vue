<script setup lang="ts">
    const route = useRoute();
</script>
<template>
    <h1>文章：{{ route.params.slug }}</h1>
    <NuxtLink to="/">返回</NuxtLink>
</template>