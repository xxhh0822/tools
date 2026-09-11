import { describe, expect, it } from 'vitest'
import { buildCurrentCatalog } from './catalog'

function escapeWorkflowCommand(value: string): string {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
}

function escapeWorkflowProperty(value: string): string {
  return escapeWorkflowCommand(value).replaceAll(':', '%3A').replaceAll(',', '%2C')
}

describe('catalog configuration', () => {
  it('contains no blocking configuration errors', () => {
    const { diagnostics: catalogDiagnostics } = buildCurrentCatalog({ allowLocalhost: false })
    const warnings = catalogDiagnostics.filter(({ level }) => level === 'warning')
    warnings.forEach(({ file, message }) => {
      console.warn(
        `::warning file=${escapeWorkflowProperty(file)},title=工具配置::${escapeWorkflowCommand(message)}`,
      )
    })

    const errors = catalogDiagnostics.filter(({ level }) => level === 'error')
    expect(errors, errors.map(({ file, message }) => `${file}: ${message}`).join('\n')).toEqual([])
  })
})
