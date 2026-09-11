import type { Component } from 'vue'
import { Calendar, Code, Image } from 'reicon-vue'

export const categoryIds = ['text-data', 'image-media', 'developer', 'efficiency'] as const

export type CategoryId = (typeof categoryIds)[number]
export type CategoryFilter = 'all' | CategoryId

export interface ToolItem {
  id: string
  name: string
  description: string
  url: string
  category: CategoryId
  tags: string[]
  icon: Component
  accent: 'blue' | 'green' | 'purple' | 'orange'
}

export interface Category {
  id: CategoryFilter
  name: string
}

export const categories: Category[] = [
  { id: 'all', name: '全部' },
  { id: 'text-data', name: '文本与数据' },
  { id: 'image-media', name: '图片与媒体' },
  { id: 'developer', name: '开发辅助' },
  { id: 'efficiency', name: '效率与计算' },
]

export const tools: ToolItem[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、压缩并检查 JSON 数据',
    url: '',
    category: 'text-data',
    tags: ['JSON', '格式化'],
    icon: Code,
    accent: 'blue',
  },
  {
    id: 'image-compressor',
    name: '图片压缩',
    description: '快速减小图片体积，保留清晰度',
    url: '',
    category: 'image-media',
    tags: ['图片', '压缩'],
    icon: Image,
    accent: 'green',
  },
  {
    id: 'base64-codec',
    name: 'Base64 编解码',
    description: '文本与 Base64 快速互相转换',
    url: '',
    category: 'developer',
    tags: ['编码', '开发'],
    icon: Code,
    accent: 'purple',
  },
  {
    id: 'time-calculator',
    name: '时间计算器',
    description: '日期差值与时间单位换算',
    url: '',
    category: 'efficiency',
    tags: ['时间', '计算'],
    icon: Calendar,
    accent: 'orange',
  },
]

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
