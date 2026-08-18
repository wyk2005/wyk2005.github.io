---
pubDatetime: 2026-08-18T17:10:00+08:00
modDatetime: 2026-08-18T17:10:00+08:00
title: 如何写新文章(本站使用说明)
featured: false
draft: false
tags:
  - 教程
description: 学会用 Markdown 在 AstroPaper 博客上发布新文章。
---

这个博客用 **Markdown** 写文章,文件存放在 `src/content/posts/` 目录。

## 新建一篇文章

在 `src/content/posts/` 下新建一个 `.md` 文件,开头是 frontmatter:

```md
---
pubDatetime: 2026-08-18T17:10:00+08:00
title: 文章标题
description: 文章描述
tags:
  - 标签A
  - 标签B
draft: false
---
```

## 常用字段

- `title` / `description` — 必填
- `pubDatetime` — 必填,发布时间(ISO 格式)
- `modDatetime` — 可选,修改时间
- `tags` — 可选,默认 `others`
- `draft: true` — 草稿,不会发布
- `featured: true` — 首页「精选」区展示

## 本地预览

```bash
pnpm dev
```

然后打开 http://localhost:4321 即可实时预览。

写好后提交推送,GitHub Actions 会自动构建并部署到 GitHub Pages。
