<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ArrowUpRight, Search3 } from 'reicon-vue'
import { categories, filterTools, tools, type CategoryFilter } from './catalog'

const activeCategory = ref<CategoryFilter>('all')
const searchText = ref('')
const searchExpanded = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

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

async function expandSearch() {
  searchExpanded.value = true
  await nextTick()
  searchInput.value?.focus()
}

function collapseSearchIfEmpty() {
  if (!searchText.value.trim()) {
    searchExpanded.value = false
  }
}

function closeSearch() {
  searchText.value = ''
  searchExpanded.value = false
}

function clearFilters() {
  searchText.value = ''
  activeCategory.value = 'all'
  searchExpanded.value = false
}
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="工具集首页">
        <span class="brand-mark" aria-hidden="true">{ }</span>
        <span>工具集</span>
      </a>
      <div class="header-actions">
        <div class="header-search" :class="{ expanded: searchExpanded }">
          <button
            v-if="!searchExpanded"
            class="header-search-trigger"
            type="button"
            aria-label="展开搜索"
            :aria-expanded="searchExpanded"
            @click="expandSearch"
          >
            <Search3 :size="21" aria-hidden="true" />
          </button>
          <label v-else class="header-search-field">
            <Search3 :size="19" aria-hidden="true" />
            <span class="sr-only">搜索工具</span>
            <input
              ref="searchInput"
              v-model="searchText"
              type="search"
              placeholder="搜索工具"
              autocomplete="off"
              @blur="collapseSearchIfEmpty"
              @keydown.esc="closeSearch"
            />
          </label>
        </div>

        <a
          class="github-link"
          href="https://github.com/xxhh0822"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub 主页"
          title="GitHub 主页"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
        </a>
      </div>
    </header>

    <main>
      <section class="hero" aria-labelledby="page-title">
        <h1 id="page-title">简单、直接、随手可用</h1>
        <p class="hero-description">收集常用的在线小工具，让每一次处理都更高效。</p>

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
              :is="category.icon"
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
          <button type="button" @click="clearFilters">清除筛选</button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <span>持续收集简单好用的在线工具</span>
      <span>© {{ new Date().getFullYear() }} 工具集</span>
    </footer>
  </div>
</template>
