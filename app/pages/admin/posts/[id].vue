<script setup lang="ts">
    const route = useRoute();
    definePageMeta({ layout: 'admin' })
</script>

<template>
    <div>
        <h1>编辑：{{ route.params.id }}</h1>
    </div>
</template>