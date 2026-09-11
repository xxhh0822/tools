# 工具集

基于 Vue 3、Vite 和 Reicon 构建的个人在线工具门户。

## 本地开发

```bash
npm install
npm run dev
```

## 添加工具

在 `src/data/tools` 中复制一个现有 JSON 文件并修改内容即可，无需维护索引：

```json
{
  "id": "json-formatter",
  "name": "JSON 格式化",
  "description": "格式化、压缩并检查 JSON 数据",
  "url": "https://json.yierbubu.store/",
  "category": "text-data",
  "tags": ["JSON", "格式化"],
  "icon": "Code",
  "accent": "blue",
  "order": 10
}
```

- `id` 必须唯一。
- `url` 必须使用 HTTPS。
- `order` 越小越靠前；相同时按名称和 ID 排序。
- `accent` 支持 `blue`、`green`、`purple`、`orange`，填写其他值时回退为 `blue`。
- `icon` 可以省略；未映射的图标会回退为 `Box`。
- 分类不存在时，工具自动进入系统内置的“其他”分类。

## 维护分类

普通分类统一维护在 `src/data/categories.json`。`all` 和 `other` 是系统保留 ID，不要在配置文件中添加；“其他”只在有工具归入该分类时显示。

## 图标

当前可以直接使用以下 Reicon 名称：

`Box`、`BrowserCode`、`Calculator`、`Calendar`、`Clock`、`Code`、`Document`、`Grid`、`Image`、`Search3`、`TextTool`

需要其他 Reicon 图标时，只在 `src/catalog-icons.ts` 中导入并加入 `catalogIconMap`。可在 [Reicon](https://reicon.dev/) 查询图标名称。

## 验证

```bash
npm run validate:catalog
npm test
npm run check
npm run build
```

可恢复问题会在本地控制台和 GitHub Actions 中显示警告；JSON 语法错误、必填字段缺失或重复 ID 会阻止部署。推送到 `main` 后，GitHub Actions 会构建并发布到 `tools.yierbubu.store`。
