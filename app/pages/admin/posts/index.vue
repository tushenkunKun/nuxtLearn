<script setup lang="ts">
    definePageMeta({ layout: 'admin' })
</script>

<template>
    <div>
        <h1>列表</h1>
        <NuxtLink to="/admin/posts/1">编辑示例</NuxtLink>
        <NuxtLink to="/admin/posts/new">新建</NuxtLink>
    </div>
</template>