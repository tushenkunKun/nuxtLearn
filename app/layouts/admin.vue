<template>
    <div>
        <aside>
            <nav>
                <NuxtLink to="/admin/posts">文章列表</NuxtLink>
                <NuxtLink to="/admin/posts/new">新建文章</NuxtLink>
                <NuxtLink to="/">回前台</NuxtLink>
            </nav>
        </aside>
        <main>
            <slot></slot>
        </main>
    </div>
</template>