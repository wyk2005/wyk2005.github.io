# 博客个性化设计文档

> 站点:https://wyk2005.github.io · 主题:AstroPaper v6.1.0 · 日期:2026-08-18
> 目标:把默认主题的博客换成 **YooVood 个人品牌**风格 —— 专属配色、圆润标题字体、GitHub 式首页头像区、简洁文章列表、带主题色目录的文章页。

## 一、设计决策汇总

| 项目 | 决策 |
|---|---|
| 方向 | A 视觉换装 + B 品牌人设 + D 布局排版(不含 C 功能) |
| 配色 | 浅色以蓝 `#5b83b8` 为主;深色模式以粉 `#ffd4ea` 为主角 |
| 标题字体 | Arial Rounded(圆润柔和),正文保持系统黑体 |
| 首页头像区 | GitHub 式:头像在左、问候在右,清爽版 |
| 首页文章列表 | 简洁列表:标题 + 日期·标签 + 描述,虚线分隔 |
| 文章页 | 保留目录(侧栏),蓝色高亮当前项、粉色悬停;标题下粉色点缀线 |
| 深浅色 | 两套完整配色,随系统主题切换 |

## 二、视觉规范

### 1. 配色令牌(`src/styles/theme.css`)

**浅色模式** `:root, [data-theme="light"]`

| 令牌 | 值 |
|---|---|
| `--background` | `#fbfcfe` |
| `--foreground` | `#2f3a4e` |
| `--accent` | `#5b83b8` |
| `--accent-foreground` | `#ffffff` |
| `--muted` | `#e8eef7` |
| `--muted-foreground` | `#6f83a3` |
| `--border` | `#dde6f1` |

**深色模式** `[data-theme="dark"]`

| 令牌 | 值 |
|---|---|
| `--background` | `#151b28` |
| `--foreground` | `#e6edf8` |
| `--accent` | `#ffd4ea`(粉) |
| `--accent-foreground` | `#3a2431` |
| `--muted` | `#232d40` |
| `--muted-foreground` | `#93a5c0` |
| `--border` | `#2a3550` |

**品牌三色** `#5b83b8`(主蓝)、`#9db4d8`(浅蓝·辅助)、`#ffd4ea`(粉·点缀/深色主角)。

### 2. 标题字体

新增令牌并在全局应用到标题:

```css
--font-head: "Arial Rounded MT Bold", "PingFang SC", "Hiragino Sans GB",
  "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
```

- 应用范围:`h1`–`h6`(含 Hero 问候语、文章列表标题、文章标题)。
- 正文保持 `--font-app` 系统黑体,保证中文可读性。
- 说明:`Arial Rounded MT Bold` 为 macOS/iOS 原生字体,其他平台自动回退到苹方/雅黑,不影响可读性;不引入网络字体(中国网络环境)。

### 3. 统一点缀线

标题/区块下方一条 **3px 圆角短横线** 作为品牌点缀:

- 浅色模式:`#ffd4ea`(粉)
- 深色模式:`#9db4d8`(浅蓝 —— 深色下标题与强调色已是粉,点缀用浅蓝形成反差)

## 三、页面改动

### 1. 首页 Hero(`src/pages/index.astro` + 新增 `src/components/Hero.astro`)

**现状**:首页顶部 `#hero` 是主题默认内容(「Mingalaba」大标题、RSS 图标、英文简介、社交链接行)。

**改为**:GitHub profile 式区块 ——

```
[56px 圆形头像]  你好,我是 YooVood 👋
[   (字母"Y")  ]  记录技术、学习与生活
                 [GitHub 按钮] [看看文章 按钮]
```

- **头像**:56px 圆形,浅色模式 `#5b83b8` 底白字,深色模式 `#ffd4ea` 底深字(`#3a2431`);居中字母「Y」。头像的品牌字母与目标链接集中放在 `Hero.astro` 顶部常量,日后可直接替换成照片或 Logo。
- **问候**:「你好,我是 YooVood 👋」(用 `--font-head`,约 20px)。
- **副标题**:「记录技术、学习与生活」(取站点描述,约 12px,muted-foreground)。
- **按钮**(胶囊 pill):
  - GitHub → `https://github.com/wyk2005`,accent 底 accent-foreground 字;
  - 看看文章 → 首页外链全部文章页 `posts`,muted 底 muted-foreground 字。
- 移除原 `#hero` 中的「Mingalaba」标题、RSS 图标、英文简介、社交链接行(RSS 依赖 Layout 头部的自动发现,不受影响;GitHub 由按钮承担)。
- 首页底部「所有文章」按钮保留,与 Hero 的「看看文章」功能重叠,属正常引导。

### 2. 首页文章列表(`src/components/Card.astro`)

**改为简洁列表**,样式作用于 `Card.astro` 的 `<li>`:

- 每项:标题(圆润字体 `--font-head`,accent 色,悬停下划线)+ 日期·标签行 + 描述(现状已有,保留)。
- 列表项之间用 `1px dashed` 分隔线:浅色 `#dde6f1`、深色 `#2a3550`;收紧默认的大留白。
- 该组件同时服务 featured(精选)与 recent(最新)两个列表,样式统一即可,不加区分。

### 3. 文章页(`src/pages/posts/[...slug]/index.astro` + 新增 `src/components/Toc.astro`)

- **标题**:文章 `<h1>` 下加 3px 圆角点缀线(颜色见「统一点缀线」)。
- **目录(新增侧栏 TOC)**:
  - 数据来源:`render(post)` 返回的 `headings`(或 `post.getHeadings()`,Astro 已内置)。
  - 桌面端(`lg:` 起)两栏布局:正文区 + 右侧 sticky 目录;移动端单栏、不显示目录。
  - 结构:标题「📑 目录」+ 各章节链接(点击平滑滚动到对应 `id`)。
  - 高亮:当前滚动章节文字为 accent 色(浅色蓝 / 深色粉);其他项 muted-foreground;悬停用点缀色。
  - 交互:内联小脚本,IntersectionObserver 追踪当前标题并更新高亮;文章无小标题时不渲染目录组件。
- **移除内置折叠目录**:从 `astro.config.ts` 移除 `remarkToc` + `remarkCollapse` 两个插件 —— 它们目前会在正文里注入一个折叠的「目录」`<details>`,与新的侧栏目录重复。
- **正文排版**:保持现有 `app-prose` 与代码高亮配置不变;链接色随 accent 令牌自动适配。

### 4. 深色模式

全部颜色由 `theme.css` 深色块令牌接管;Hero 头像、按钮、TOC 高亮、点缀线按上文规则跟随切换。无需额外逻辑。

## 四、范围外(YAGNI)

- 不新增功能(方向 C 已排除)
- 不动评论(Giscus)、搜索(Pagefind)、站点结构
- 不加封面图;不做卡片流 / 编辑式列表
- 不换正文字体;不引入网络字体

## 五、受影响文件

| 文件 | 动作 |
|---|---|
| `src/styles/theme.css` | 替换浅/深两套颜色令牌;新增 `--font-head` 与全局标题字体规则 |
| `src/pages/index.astro` | 用 Hero 组件替换 `#hero` 区块 |
| `src/components/Hero.astro` | 新增:首页头像区 |
| `src/components/Card.astro` | 列表项改简洁列表样式(虚线分隔) |
| `src/pages/posts/[...slug]/index.astro` | 标题点缀线、桌面两栏布局、挂载 TOC |
| `src/components/Toc.astro` | 新增:侧栏目录(含 scrollspy) |
| `astro.config.ts` | 移除 `remarkToc` / `remarkCollapse` 插件 |

## 六、验证方式

1. `pnpm build` 通过;`pnpm preview` 本地目检。
2. 逐项核对:首页 Hero 两按钮跳转正确;文章列表虚线分隔、圆润标题;文章页标题点缀线、侧栏目录随滚动高亮;浅色/深色切换后各颜色令牌生效。
3. 部署到 GitHub Pages 后,`curl` 首页与一篇文章路由均返回 200。
