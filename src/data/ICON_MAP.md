# 常用 Reicon 图标映射

工具 JSON 的 `icon` 字段填写下表中的映射名称。名称区分大小写；省略或填写未映射名称时，门户会自动使用默认图标 `Box`。

```json
{
  "icon": "Calendar"
}
```

| 图标 | JSON 中填写 | 推荐用途 | Reicon 页面 |
| --- | --- | --- | --- |
| <img src="./icon-previews/Box.svg" width="28" height="28" alt="Box" /> | `Box` | 默认图标、通用工具 | [查看](https://reicon.dev/icons/box) |
| <img src="./icon-previews/BrowserCode.svg" width="28" height="28" alt="BrowserCode" /> | `BrowserCode` | 网页开发、浏览器工具 | [查看](https://reicon.dev/icons/browser-code) |
| <img src="./icon-previews/Calculator.svg" width="28" height="28" alt="Calculator" /> | `Calculator` | 计算器、数值计算 | [查看](https://reicon.dev/icons/calculator) |
| <img src="./icon-previews/Calendar.svg" width="28" height="28" alt="Calendar" /> | `Calendar` | 日期、日程、日期计算 | [查看](https://reicon.dev/icons/calendar) |
| <img src="./icon-previews/Clock.svg" width="28" height="28" alt="Clock" /> | `Clock` | 时间、计时、时区 | [查看](https://reicon.dev/icons/clock) |
| <img src="./icon-previews/Code.svg" width="28" height="28" alt="Code" /> | `Code` | 代码、JSON、数据格式化 | [查看](https://reicon.dev/icons/code) |
| <img src="./icon-previews/Document.svg" width="28" height="28" alt="Document" /> | `Document` | 文档、文件处理 | [查看](https://reicon.dev/icons/document) |
| <img src="./icon-previews/Grid.svg" width="28" height="28" alt="Grid" /> | `Grid` | 集合、面板、批量工具 | [查看](https://reicon.dev/icons/grid) |
| <img src="./icon-previews/Image.svg" width="28" height="28" alt="Image" /> | `Image` | 图片、媒体处理 | [查看](https://reicon.dev/icons/image) |
| <img src="./icon-previews/Search3.svg" width="28" height="28" alt="Search3" /> | `Search3` | 搜索、查询、检索 | [查看](https://reicon.dev/icons/search-3) |
| <img src="./icon-previews/TicketStar.svg" width="28" height="28" alt="TicketStar" /> | `TicketStar` | 选号、票券、抽奖 | [查看](https://reicon.dev/icons/ticket-star) |
| <img src="./icon-previews/TextTool.svg" width="28" height="28" alt="TextTool" /> | `TextTool` | 文本编辑、文字处理 | [查看](https://reicon.dev/icons/text-tool) |

## 增加新映射

1. 在 [Reicon](https://reicon.dev/) 查询准确的组件名称。
2. 在 `src/catalog-icons.ts` 中导入组件，并加入 `catalogIconMap`。
3. 在本手册中补充名称、预览和推荐用途。
4. 运行 `npm run validate:catalog`、`npm test` 和 `npm run build`。

> `Box` 是系统默认图标。只新增工具 JSON 时，如果暂时找不到合适图标，可以省略 `icon` 字段。
