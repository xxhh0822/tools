import type { Component } from 'vue'
import {
  Box,
  BrowserCode,
  Calculator,
  Calendar,
  Clock,
  Code,
  Document,
  Grid,
  Image,
  Search3,
  TicketStar,
  TextTool,
} from 'reicon-vue'

export const catalogIconMap = {
  Box,
  BrowserCode,
  Calculator,
  Calendar,
  Clock,
  Code,
  Document,
  Grid,
  Image,
  Search3,
  TicketStar,
  TextTool,
} satisfies Record<string, Component>

export type CatalogIconName = keyof typeof catalogIconMap

export const defaultCatalogIcon = Box
export const supportedCatalogIconNames = Object.keys(catalogIconMap) as CatalogIconName[]

export function hasCatalogIcon(name: unknown): name is CatalogIconName {
  return typeof name === 'string' && name in catalogIconMap
}

export function resolveCatalogIcon(name: unknown): Component {
  return hasCatalogIcon(name) ? catalogIconMap[name] : defaultCatalogIcon
}
