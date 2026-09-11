import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { defaultCatalogIcon, supportedCatalogIconNames } from './catalog-icons'
import { buildCatalog, filterTools, tools } from './catalog'

const testCategories = [
  { id: 'known', name: '已知分类', icon: 'Code', order: 10 },
]

function validTool(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-tool',
    name: '测试工具',
    description: '用于测试配置加载',
    url: 'https://example.com/',
    category: 'known',
    tags: ['测试'],
    icon: 'Code',
    accent: 'orange',
    order: 10,
    ...overrides,
  }
}

describe('filterTools', () => {
  it('contains the required live tools without restricting configured additions', () => {
    expect(tools.map(({ id, url }) => ({ id, url }))).toEqual(
      expect.arrayContaining([
        { id: 'json-formatter', url: 'https://json.yierbubu.store/' },
        { id: 'time-calculator', url: 'https://time.yierbubu.store/' },
        { id: 'lucky-picker', url: 'https://lucky.yierbubu.store/' },
      ]),
    )
  })

  it('returns every tool when no filter is active', () => {
    expect(filterTools(tools, 'all', '')).toHaveLength(tools.length)
  })

  it('filters by category', () => {
    expect(filterTools(tools, 'date-time', '')).toEqual([
      expect.objectContaining({ id: 'time-calculator' }),
    ])
  })

  it('searches names, descriptions and tags without case sensitivity', () => {
    expect(filterTools(tools, 'all', '时间')).toEqual([
      expect.objectContaining({ id: 'time-calculator' }),
    ])
    expect(filterTools(tools, 'all', 'JSON')).toEqual([
      expect.objectContaining({ id: 'json-formatter' }),
    ])
  })

  it('combines category and search filters', () => {
    expect(filterTools(tools, 'text-data', '时间')).toEqual([])
  })

  it('falls back to other, Box and blue for recoverable values', () => {
    const result = buildCatalog(testCategories, {
      './data/tools/fallback.json': validTool({
        category: 'missing-category',
        icon: 'MissingIcon',
        accent: 'pink',
      }),
    })

    expect(result.tools[0]).toMatchObject({
      id: 'test-tool',
      category: 'other',
      icon: defaultCatalogIcon,
      accent: 'blue',
    })
    expect(result.categories.map(({ id }) => id)).toEqual(['all', 'known', 'other'])
    expect(result.diagnostics.filter(({ level }) => level === 'warning')).toHaveLength(3)
  })

  it('uses the default icon when icon is omitted', () => {
    const { icon: _omittedIcon, ...tool } = validTool()
    const result = buildCatalog(testCategories, { './data/tools/default-icon.json': tool })

    expect(result.tools[0]?.icon).toBe(defaultCatalogIcon)
    expect(result.diagnostics).toEqual([])
  })

  it('ignores reserved configured categories and reports warnings', () => {
    const result = buildCatalog(
      [
        ...testCategories,
        { id: 'all', name: '错误的全部', order: 20 },
        { id: 'other', name: '错误的其他', order: 30 },
      ],
      { './data/tools/tool.json': validTool() },
    )

    expect(result.categories.map(({ id }) => id)).toEqual(['all', 'known'])
    expect(result.diagnostics.filter(({ level }) => level === 'warning')).toHaveLength(2)
  })

  it('reports missing required fields and duplicate tool IDs as errors', () => {
    const result = buildCatalog(testCategories, {
      './data/tools/first.json': validTool(),
      './data/tools/missing.json': validTool({ description: '' }),
      './data/tools/second.json': validTool({ name: '重复工具' }),
    })

    expect(result.tools).toHaveLength(1)
    expect(result.diagnostics.filter(({ level }) => level === 'error')).toHaveLength(2)
  })

  it('sorts tools by order, then name and id', () => {
    const result = buildCatalog(testCategories, {
      './data/tools/c.json': validTool({ id: 'c', name: '乙', order: 20 }),
      './data/tools/b.json': validTool({ id: 'b', name: '甲', order: 20 }),
      './data/tools/a.json': validTool({ id: 'a', name: '最后不会优先', order: 30 }),
    })

    expect(result.tools.map(({ id }) => id)).toEqual(['b', 'c', 'a'])
  })

  it('rejects unsafe URLs but permits localhost only when explicitly enabled', () => {
    const unsafe = buildCatalog(testCategories, {
      './data/tools/unsafe.json': validTool({ url: 'javascript:alert(1)' }),
    })
    const productionLocalhost = buildCatalog(testCategories, {
      './data/tools/local.json': validTool({ url: 'http://localhost:5173/' }),
    })
    const developmentLocalhost = buildCatalog(
      testCategories,
      { './data/tools/local.json': validTool({ url: 'http://localhost:5173/' }) },
      { allowLocalhost: true },
    )

    expect(unsafe.tools).toEqual([])
    expect(productionLocalhost.tools).toEqual([])
    expect(developmentLocalhost.tools).toHaveLength(1)
  })

  it('documents every supported icon and provides a local preview', () => {
    const dataDirectory = resolve(process.cwd(), 'src/data')
    const guide = readFileSync(resolve(dataDirectory, 'ICON_MAP.md'), 'utf8')

    supportedCatalogIconNames.forEach((name) => {
      expect(guide).toContain(`\`${name}\``)
      expect(existsSync(resolve(dataDirectory, 'icon-previews', `${name}.svg`))).toBe(true)
    })
  })
})
