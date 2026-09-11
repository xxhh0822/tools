import { describe, expect, it } from 'vitest'
import { filterTools, tools } from './catalog'

describe('filterTools', () => {
  it('returns every tool when no filter is active', () => {
    expect(filterTools(tools, 'all', '')).toHaveLength(tools.length)
  })

  it('filters by category', () => {
    expect(filterTools(tools, 'image-media', '')).toEqual([
      expect.objectContaining({ id: 'image-compressor' }),
    ])
  })

  it('searches names, descriptions and tags without case sensitivity', () => {
    expect(filterTools(tools, 'all', 'base64')).toEqual([
      expect.objectContaining({ id: 'base64-codec' }),
    ])
    expect(filterTools(tools, 'all', '压缩')).toHaveLength(2)
    expect(filterTools(tools, 'all', 'JSON')).toEqual([
      expect.objectContaining({ id: 'json-formatter' }),
    ])
  })

  it('combines category and search filters', () => {
    expect(filterTools(tools, 'developer', '图片')).toEqual([])
  })
})
