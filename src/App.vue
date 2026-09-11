<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, Calculator, Code, Image, Search3 } from 'reicon-vue'
import { categories, filterTools, tools, type CategoryFilter } from './catalog'

const activeCategory = ref<CategoryFilter>('all')
const searchText = ref('')

const categoryIcons = {
  'text-data': Code,
  'image-media': Image,
  developer: Code,
  efficiency: Calculator,
} as const

const visibleCategories = computed(() =>
  categories.filter(
    (category) =>
      category.id === 'all' || tools.some((tool) => tool.category === category.id),
  ),
)

const visibleTools = computed(() =>
  filterTools(tools, activeCategory.value, searchText.value),
)

function selectCategory(category: CategoryFilter) {
  activeCategory.value = category
}
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="工具集首页">
        <span class="brand-mark" aria-hidden="true">{ }</span>
        <span>工具集</span>
      </a>
      <a
        class="github-link"
        href="https://github.com/xxhh0822"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
        <ArrowUpRight :size="18" aria-hidden="true" />
      </a>
    </header>

    <main>
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">ONLINE TOOLBOX</p>
        <h1 id="page-title">简单、直接、随手可用</h1>
        <p class="hero-description">收集常用的在线小工具，让每一次处理都更高效。</p>

        <label class="search-box">
          <Search3 :size="23" aria-hidden="true" />
          <span class="sr-only">搜索工具</span>
          <input
            v-model="searchText"
            type="search"
            placeholder="搜索工具、功能或标签"
            autocomplete="off"
          />
        </label>

        <nav class="category-scroller" aria-label="工具分类">
          <button
            v-for="category in visibleCategories"
            :key="category.id"
            class="category-chip"
            :class="{ active: activeCategory === category.id }"
            type="button"
            :aria-pressed="activeCategory === category.id"
            @click="selectCategory(category.id)"
          >
            <component
              :is="categoryIcons[category.id as keyof typeof categoryIcons]"
              v-if="category.id !== 'all'"
              :size="18"
              aria-hidden="true"
            />
            {{ category.name }}
          </button>
        </nav>
      </section>

      <section class="catalog-section" aria-live="polite">
        <div v-if="visibleTools.length" class="tool-grid">
          <component
            :is="tool.url ? 'a' : 'article'"
            v-for="tool in visibleTools"
            :key="tool.id"
            class="tool-card"
            :class="{ disabled: !tool.url }"
            :href="tool.url || undefined"
            :target="tool.url ? '_blank' : undefined"
            :rel="tool.url ? 'noopener noreferrer' : undefined"
          >
            <div class="card-heading">
              <span class="tool-icon" :class="`accent-${tool.accent}`">
                <component :is="tool.icon" :size="31" aria-hidden="true" />
              </span>
              <span v-if="!tool.url" class="pending-badge">待配置</span>
            </div>

            <div class="card-copy">
              <h2>{{ tool.name }}</h2>
              <p>{{ tool.description }}</p>
            </div>

            <div class="card-footer">
              <div class="tag-list" aria-label="标签">
                <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <ArrowUpRight v-if="tool.url" :size="22" aria-hidden="true" />
              <span v-else class="disabled-arrow" aria-hidden="true">→</span>
            </div>
          </component>
        </div>

        <div v-else class="empty-state">
          <Search3 :size="34" aria-hidden="true" />
          <h2>没有找到相关工具</h2>
          <p>换个关键词，或者选择其他分类试试。</p>
          <button type="button" @click="searchText = ''; activeCategory = 'all'">清除筛选</button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <span>持续收集简单好用的在线工具</span>
      <span>© {{ new Date().getFullYear() }} 工具集</span>
    </footer>
  </div>
</template>
