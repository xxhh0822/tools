import { describe, expect, it } from 'vitest'
import { filterTools, tools } from './catalog'

describe('filterTools', () => {
  it('contains only the two configured live tools', () => {
    expect(tools.map(({ id, url }) => ({ id, url }))).toEqual([
      { id: 'json-formatter', url: 'https://json.yierbubu.store/' },
      { id: 'time-calculator', url: 'https://time.yierbubu.store/' },
    ])
  })

  it('returns every tool when no filter is active', () => {
    expect(filterTools(tools, 'all', '')).toHaveLength(tools.length)
  })

  it('filters by category', () => {
    expect(filterTools(tools, 'efficiency', '')).toEqual([
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
})
