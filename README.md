# 工具集

基于 Vue 3、Vite 和 Reicon 构建的个人在线工具门户。

## 本地开发

```bash
npm install
npm run dev
```

## 添加工具

工具和分类集中配置在 `src/catalog.ts`。为工具填写公开访问地址后，卡片会自动变为可点击状态，并在新标签页打开。

## 验证

```bash
npm test
npm run build
```

推送到 `main` 后，GitHub Actions 会构建并发布站点。自定义域名配置为 `tools.yierbubu.store`。
