<template>
    <div>
        <header>
            <nav>
                <NuxtLink to="/">首页</NuxtLink>
                <NuxtLink to="/login">登录</NuxtLink>
                <NuxtLink to="/admin">后台</NuxtLink>
            </nav>
        </header>
        <main>
            <slot></slot>
        </main>
    </div>
</template>

<script setup lang="ts">
</script>