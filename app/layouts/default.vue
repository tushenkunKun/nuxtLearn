<template>
    <div>
        <header>
            <nav class="flex gap-4">
                <NuxtLink to="/" class="text-blue-500">首页</NuxtLink>
                <NuxtLink to="/login" class="text-blue-500">登录</NuxtLink>
                <NuxtLink to="/admin" class="text-blue-500">后台</NuxtLink>
            </nav>
        </header>
        <main>
            <slot></slot>
        </main>
    </div>
</template>

<script setup lang="ts">
</script>