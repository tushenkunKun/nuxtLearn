<script setup lang="ts">
    const route = useRoute();
</script>

<template>
    <h1>分类：{{ route.params.slug }}</h1>
</template>
