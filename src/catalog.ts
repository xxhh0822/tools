import type { Component } from 'vue'
import rawCategories from './data/categories.json'
import {
  defaultCatalogIcon,
  hasCatalogIcon,
  resolveCatalogIcon,
} from './catalog-icons'

export type Accent = 'blue' | 'green' | 'purple' | 'orange'
export type CategoryId = string
export type CategoryFilter = 'all' | CategoryId

export interface ToolItem {
  id: string
  name: string
  description: string
  url: string
  category: CategoryId
  tags: string[]
  icon: Component
  accent: Accent
  order: number
}

export interface Category {
  id: CategoryFilter
  name: string
  icon: Component
  order: number
}

export interface CatalogDiagnostic {
  level: 'warning' | 'error'
  file: string
  message: string
}

export interface CatalogResult {
  categories: Category[]
  tools: ToolItem[]
  diagnostics: CatalogDiagnostic[]
}

interface CatalogOptions {
  allowLocalhost?: boolean
}

const SYSTEM_CATEGORY_IDS = new Set(['all', 'other'])
const ACCENTS = new Set<Accent>(['blue', 'green', 'purple', 'orange'])
const DEFAULT_ACCENT: Accent = 'blue'

const rawToolModules = import.meta.glob('./data/tools/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function sourcePath(path: string): string {
  return path.startsWith('./') ? `src/${path.slice(2)}` : path
}

function compareByOrderAndName<T extends { order: number; name: string; id: string }>(
  left: T,
  right: T,
): number {
  return (
    left.order - right.order ||
    left.name.localeCompare(right.name, 'zh-CN') ||
    left.id.localeCompare(right.id)
  )
}

function isAllowedUrl(value: string, allowLocalhost: boolean): boolean {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:') return true

    return (
      allowLocalhost &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    )
  } catch {
    return false
  }
}

function addDiagnostic(
  diagnostics: CatalogDiagnostic[],
  level: CatalogDiagnostic['level'],
  file: string,
  message: string,
) {
  diagnostics.push({ level, file, message })
}

function loadConfiguredCategories(
  input: unknown,
  diagnostics: CatalogDiagnostic[],
): Category[] {
  const file = 'src/data/categories.json'
  if (!Array.isArray(input)) {
    addDiagnostic(diagnostics, 'error', file, '分类配置必须是数组。')
    return []
  }

  const categories: Category[] = []
  const seenIds = new Set<string>()

  input.forEach((item, index) => {
    const itemLabel = `第 ${index + 1} 项：`
    if (
      !isRecord(item) ||
      !isNonEmptyString(item.id) ||
      !isNonEmptyString(item.name) ||
      typeof item.order !== 'number' ||
      !Number.isFinite(item.order)
    ) {
      addDiagnostic(diagnostics, 'error', file, `${itemLabel}分类缺少有效的 id、name 或 order。`)
      return
    }

    const id = item.id.trim()
    if (SYSTEM_CATEGORY_IDS.has(id)) {
      addDiagnostic(
        diagnostics,
        'warning',
        file,
        `${itemLabel}分类 ID “${id}” 是系统保留值，已忽略该配置。`,
      )
      return
    }

    if (seenIds.has(id)) {
      addDiagnostic(diagnostics, 'error', file, `${itemLabel}分类 ID “${id}” 重复。`)
      return
    }
    seenIds.add(id)

    if (item.icon !== undefined && !hasCatalogIcon(item.icon)) {
      addDiagnostic(
        diagnostics,
        'warning',
        file,
        `${itemLabel}分类图标 “${String(item.icon)}” 未映射，已使用默认图标 Box。`,
      )
    }

    categories.push({
      id,
      name: item.name.trim(),
      icon: resolveCatalogIcon(item.icon),
      order: item.order,
    })
  })

  return categories.sort(compareByOrderAndName)
}

function loadTools(
  sources: Record<string, unknown>,
  configuredCategories: Category[],
  diagnostics: CatalogDiagnostic[],
  allowLocalhost: boolean,
): ToolItem[] {
  const categoryIds = new Set(configuredCategories.map((category) => category.id))
  categoryIds.add('other')

  const tools: ToolItem[] = []
  const seenIds = new Set<string>()

  Object.entries(sources)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([rawPath, item]) => {
      const file = sourcePath(rawPath)
      if (
        !isRecord(item) ||
        !isNonEmptyString(item.id) ||
        !isNonEmptyString(item.name) ||
        !isNonEmptyString(item.description) ||
        !isNonEmptyString(item.url) ||
        !isNonEmptyString(item.category) ||
        !Array.isArray(item.tags) ||
        !item.tags.every(isNonEmptyString) ||
        typeof item.order !== 'number' ||
        !Number.isFinite(item.order)
      ) {
        addDiagnostic(
          diagnostics,
          'error',
          file,
          '工具缺少有效的 id、name、description、url、category、tags 或 order。',
        )
        return
      }

      const id = item.id.trim()
      if (seenIds.has(id)) {
        addDiagnostic(diagnostics, 'error', file, `工具 ID “${id}” 重复。`)
        return
      }
      seenIds.add(id)

      if (!isAllowedUrl(item.url, allowLocalhost)) {
        addDiagnostic(
          diagnostics,
          'error',
          file,
          '工具 URL 必须使用 https；本地开发仅允许 http://localhost。',
        )
        return
      }

      const requestedCategory = item.category.trim()
      const category = categoryIds.has(requestedCategory) && requestedCategory !== 'all'
        ? requestedCategory
        : 'other'
      if (category !== requestedCategory) {
        addDiagnostic(
          diagnostics,
          'warning',
          file,
          `分类 “${requestedCategory}” 不存在，已归入“其他”。`,
        )
      }

      if (item.icon !== undefined && !hasCatalogIcon(item.icon)) {
        addDiagnostic(
          diagnostics,
          'warning',
          file,
          `图标 “${String(item.icon)}” 未映射，已使用默认图标 Box。`,
        )
      }

      const accent = typeof item.accent === 'string' && ACCENTS.has(item.accent as Accent)
        ? (item.accent as Accent)
        : DEFAULT_ACCENT
      if (accent !== item.accent) {
        addDiagnostic(
          diagnostics,
          'warning',
          file,
          `强调色 “${String(item.accent)}” 无效，已使用 blue。`,
        )
      }

      tools.push({
        id,
        name: item.name.trim(),
        description: item.description.trim(),
        url: item.url,
        category,
        tags: item.tags.map((tag) => tag.trim()),
        icon: resolveCatalogIcon(item.icon),
        accent,
        order: item.order,
      })
    })

  return tools.sort(compareByOrderAndName)
}

export function buildCatalog(
  categoryConfig: unknown,
  toolSources: Record<string, unknown>,
  options: CatalogOptions = {},
): CatalogResult {
  const diagnostics: CatalogDiagnostic[] = []
  const configuredCategories = loadConfiguredCategories(categoryConfig, diagnostics)
  const tools = loadTools(
    toolSources,
    configuredCategories,
    diagnostics,
    options.allowLocalhost ?? false,
  )

  const categories: Category[] = [
    { id: 'all', name: '全部', icon: defaultCatalogIcon, order: Number.MIN_SAFE_INTEGER },
    ...configuredCategories,
  ]
  if (tools.some((tool) => tool.category === 'other')) {
    categories.push({
      id: 'other',
      name: '其他',
      icon: defaultCatalogIcon,
      order: Number.MAX_SAFE_INTEGER,
    })
  }

  return { categories, tools, diagnostics }
}

export function buildCurrentCatalog(options: CatalogOptions = {}): CatalogResult {
  return buildCatalog(rawCategories, rawToolModules, options)
}

const catalog = buildCurrentCatalog({
  allowLocalhost: import.meta.env.DEV,
})

export const categories = catalog.categories
export const tools = catalog.tools
export const catalogDiagnostics = catalog.diagnostics

if (import.meta.env.DEV) {
  catalogDiagnostics.forEach((diagnostic) => {
    const message = `[工具配置][${diagnostic.file}] ${diagnostic.message}`
    if (diagnostic.level === 'error') console.error(message)
    else console.warn(message)
  })
}

export function filterTools(
  items: ToolItem[],
  category: CategoryFilter,
  searchText: string,
): ToolItem[] {
  const query = searchText.trim().toLocaleLowerCase()

  return items.filter((tool) => {
    const matchesCategory = category === 'all' || tool.category === category
    const searchableText = [tool.name, tool.description, ...tool.tags]
      .join(' ')
      .toLocaleLowerCase()

    return matchesCategory && (!query || searchableText.includes(query))
  })
}
