# 博客个性化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把默认 AstroPaper 主题的博客换成 YooVood 个人品牌风格:专属蓝粉配色、圆润标题字体、GitHub 式首页头像区、简洁文章列表、带主题色侧栏目录的文章页。

**Architecture:** 全部改动落在 4 个层面:(1) `src/styles/theme.css` 换颜色令牌并新增标题字体与目录样式;(2) 新建 `Hero.astro` 与 `Toc.astro` 两个组件,分别挂到首页和文章页;(3) 微调 `Card.astro` 的列表项样式;(4) `astro.config.ts` 移除内置折叠目录插件。深浅色由 CSS 变量自动切换,无需 JS 逻辑。构建产物为纯静态站点。

**Tech Stack:** Astro 7.0.3 · Tailwind CSS v4 · TypeScript · pnpm 11.22.0(构建 `pnpm build`,本地预览 `pnpm preview`)

---

## 背景事实(工程师必读)

- 站点根目录:`/Users/weiyukai1/Documents/myblog`,git 分支 `main`。**提交会触发 GitHub Actions 部署(仅 push 时),单次提交是安全的、不会部署。**
- 只有 `zh` 一个 locale,站内文案可直接写中文,无需走 i18n。
- `app-layout` = `max-w-app mx-auto w-full px-4`,`max-w-app` = `max-w-3xl`(见 `src/styles/global.css`)。文章页需在 `lg:` 下加宽到 `lg:max-w-5xl` 才能容纳侧栏目录。
- 文章页已有内联脚本 `<script is:inline data-astro-rerun>`(滚动进度条、代码复制、灯箱)。新目录的滚动高亮脚本同样用 `is:inline data-astro-rerun`,随视图切换自动重挂。
- 文章小标题自带 `id`(如 `id="新建一篇文章"`),Astro 自动生成,无需额外插件。
- `render(post)` 返回 `{ Content, headings }`,`headings` 类型为 `{ depth: number; slug: string; text: string }[]`(可 `import type { MarkdownHeading } from "astro"`)。

---

## Task 1: 换配色令牌 + 新增标题字体

**Files:**
- Modify: `src/styles/theme.css`(整文件替换)

- [ ] **Step 1: 用 Write 替换整个 `src/styles/theme.css`**

```css
/* Register design tokens for Tailwind v4 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --font-app: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Helvetica Neue",
    Arial, sans-serif;
  --font-head: "Arial Rounded MT Bold", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
}

/* Light theme values */
:root,
[data-theme="light"] {
  --background: #fbfcfe;
  --foreground: #2f3a4e;
  --accent: #5b83b8;
  --accent-foreground: #ffffff;
  --muted: #e8eef7;
  --muted-foreground: #6f83a3;
  --border: #dde6f1;
  --dot: #ffd4ea;
}

/* Dark theme values */
[data-theme="dark"] {
  --background: #151b28;
  --foreground: #e6edf8;
  --accent: #ffd4ea;
  --accent-foreground: #3a2431;
  --muted: #232d40;
  --muted-foreground: #93a5c0;
  --border: #2a3550;
  --dot: #9db4d8;
}

/* 标题统一使用圆润字体(正文保持 --font-app 系统黑体) */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-head);
}
```

说明:`--dot` 是「点缀色」,浅色模式为粉、深色模式为浅蓝,供 Task 4 的标题点缀线与目录悬停色使用。

- [ ] **Step 2: 构建验证**

Run: `pnpm build`
Expected: 构建成功、无报错。

- [ ] **Step 3: 确认令牌已进入产物**

Run: `grep -o '#fbfcfe\|#151b28\|--dot:#ffd4ea\|--dot:#9db4d8' dist/_astro/*.css | sort -u`
Expected: 四个值都出现(顺序无关)。

- [ ] **Step 4: 提交**

```bash
git add src/styles/theme.css
git commit -m "style: apply YooVood palette and rounded heading font"
```

---

## Task 2: 首页 Hero(头像区)

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 创建 `src/components/Hero.astro`**

```astro
---
import config from "@/config";

// —— 品牌信息集中在此,日后改头像/名字/按钮只动这里 ——
const avatarLetter = "Y";
const brandName = "YooVood";
const tagline = "记录技术、学习与生活";
const githubUrl = config.site.profile ?? "https://github.com/wyk2005";
const postsUrl = "/posts";
---

<section
  id="hero"
  class="border-border border-b pt-8 pb-6 flex items-center gap-4"
>
  <div
    aria-hidden="true"
    class="bg-accent text-accent-foreground flex size-14 shrink-0 select-none items-center justify-center rounded-full text-2xl font-bold"
  >
    {avatarLetter}
  </div>

  <div class="min-w-0">
    <h1 class="my-0 text-xl font-bold sm:text-2xl">你好,我是 {brandName} 👋</h1>
    <p class="mt-1 text-sm text-muted-foreground">{tagline}</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="bg-accent text-accent-foreground rounded-full px-4 py-1.5 text-sm font-medium no-underline"
      >
        GitHub
      </a>
      <a
        href={postsUrl}
        class="bg-muted text-muted-foreground rounded-full px-4 py-1.5 text-sm font-medium no-underline"
      >
        看看文章
      </a>
    </div>
  </div>
</section>
```

注意:`size-14` = 56px,头像圆底在浅色模式下是蓝底白字、深色模式下是粉底深字(由 `bg-accent` / `text-accent-foreground` 随令牌自动切换)。

- [ ] **Step 2: 改 `src/pages/index.astro`**

(a) 顶部 import 区:删掉 `import IconRss from "@/assets/icons/IconRss.svg";` 与 `import Socials from "@/components/Socials.astro";`,新增 `import Hero from "@/components/Hero.astro";`(`IconArrowRight`、`LinkButton` 保留,底部「所有文章」按钮仍在用)。

(b) 解构行 `const { socials, posts: postsConfig } = config;` 改为 `const { posts: postsConfig } = config;`(socials 不再被引用)。

(c) 把整个 `<section id="hero" class="border-border border-b pt-8 pb-6"> ... </section>`(从 `<h1 ...>Mingalaba</h1>` 的 RSS 图标、英文介绍、社交链接全部内容)替换为一行:

```astro
    <Hero />
```

- [ ] **Step 3: 构建 + 内容检查**

Run: `pnpm build`
Expected: 构建成功。

Run: `grep -o '你好,我是 YooVood\|看看文章\|Mingalaba' dist/index.html`
Expected: 出现 `你好,我是 YooVood` 与 `看看文章`,**不**出现 `Mingalaba`。

- [ ] **Step 4: 提交**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add GitHub-style hero to homepage"
```

---

## Task 3: 首页文章列表改为简洁列表

**Files:**
- Modify: `src/components/Card.astro`(整文件替换)

- [ ] **Step 1: 用 Write 替换整个 `src/components/Card.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";
import { getPostUrl } from "@/utils/getPostPaths";
import { toTransitionName } from "@/utils/toTransitionName";
import Datetime from "./Datetime.astro";

type Props = {
  variant?: "h2" | "h3";
} & CollectionEntry<"posts">;

const { variant: Heading = "h2", id, data, filePath } = Astro.props;

const { title, description, ...props } = data;
---

<li class="border-border border-b border-dashed py-5 last:border-b-0">
  <a
    href={getPostUrl(id, filePath, Astro.currentLocale)}
    class:list={[
      "text-accent inline-block text-lg font-medium",
      "decoration-dashed underline-offset-4 hover:underline",
      "focus-visible:no-underline focus-visible:underline-offset-0",
    ]}
  >
    <Heading transition:name={toTransitionName(id)}>
      {title}
    </Heading>
  </a>
  <Datetime {...props} />
  <p class="mt-1 text-sm text-muted-foreground">{description}</p>
</li>
```

改动点:`<li>` 从 `my-6` 改为 `py-5` 加底部虚线边框(`border-dashed`、`last:border-b-0`);描述段落加 `mt-1 text-sm text-muted-foreground`。标题本身是 `h2`/`h3`,已由 Task 1 的全局规则套用圆润字体。

- [ ] **Step 2: 构建验证**

Run: `pnpm build`
Expected: 构建成功。

- [ ] **Step 3: 提交**

```bash
git add src/components/Card.astro
git commit -m "style: restyle homepage post list with dashed separators"
```

---

## Task 4: 文章页标题点缀线 + 侧栏目录

**Files:**
- Modify: `src/styles/theme.css`(追加目录样式,`--dot` 已在 Task 1 定义)
- Modify: `astro.config.ts`(移除 `remarkToc` / `remarkCollapse`)
- Create: `src/components/Toc.astro`
- Modify: `src/pages/posts/[...slug]/index.astro`

- [ ] **Step 1: 在 `src/styles/theme.css` 末尾追加目录样式**

在文件末尾(全局规则 `h1...h6` 之后)追加:

```css
/* 文章页侧栏目录 */
.toc-link {
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 150ms;
}
.toc-link:hover {
  color: var(--dot);
}
.toc-link.is-active {
  color: var(--accent);
  font-weight: 600;
}
```

- [ ] **Step 2: 从 `astro.config.ts` 移除内置折叠目录**

(a) 删掉两行 import:
```ts
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
```

(b) 把 `remarkPlugins` 数组改为空:
```ts
      remarkPlugins: [],
```
(原先的值是 `remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],`。`rehypePlugins: [rehypeCallouts]` 保持不变。)

- [ ] **Step 3: 创建 `src/components/Toc.astro`**

```astro
---
import type { MarkdownHeading } from "astro";

type Props = {
  headings: MarkdownHeading[];
};

const { headings } = Astro.props;

const tocItems = headings.filter(h => h.depth === 2 || h.depth === 3);
---

{
  tocItems.length > 0 && (
    <aside class="text-sm">
      <p class="text-muted-foreground mb-3 font-semibold">📑 目录</p>
      <nav>
        <ul class="space-y-1.5">
          {tocItems.map(item => (
            <li class:list={[{ "ps-3": item.depth === 3 }]}>
              <a href={`#${item.slug}`} data-toc-link class="toc-link">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

<script is:inline data-astro-rerun>
  (function () {
    const links = Array.from(document.querySelectorAll("[data-toc-link]"));
    if (links.length === 0) return;

    const headings = links
      .map(l => document.getElementById(l.getAttribute("href")!.slice(1)))
      .filter(Boolean) as HTMLElement[];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 点击目录项:平滑滚动 + 更新 URL hash
    for (const link of links) {
      link.addEventListener("click", e => {
        const id = link.getAttribute("href")!.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        history.replaceState(null, "", `#${id}`);
      });
    }

    function updateActive() {
      let currentId = "";
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 88) {
          currentId = h.id;
        }
      }
      // 页面滚过全部标题后,高亮最后一项
      if (!currentId && headings.length) {
        const last = headings[headings.length - 1];
        if (last.getBoundingClientRect().top < window.innerHeight) {
          currentId = last.id;
        }
      }
      for (const link of links) {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${currentId}`
        );
      }
    }

    window.addEventListener("scroll", () => requestAnimationFrame(updateActive), {
      passive: true,
    });
    updateActive();
  })();
</script>
```

说明:组件本身是静态列表;滚动高亮由末尾内联脚本通过 `is-active` 类切换,样式在 Step 1 已定义。文章无 `##`/`###` 标题时 `tocItems` 为空,整个 aside 不渲染。

- [ ] **Step 4: 改造文章页 `src/pages/posts/[...slug]/index.astro`**

(a) import 区新增一行(放在 `import Giscus from "@/components/Giscus.astro";` 附近):
```ts
import Toc from "@/components/Toc.astro";
```

(b) `const { Content } = await render(post);` 改为:
```ts
const { Content, headings } = await render(post);
```

(c) 把 `<main id="main-content" ...>` 到 `</main>` 的整个块(标题、日期、article、标签、分享、上下篇、Giscus 等)改为两栏网格:左栏原有内容,右栏 sticky 目录。替换后为:

```astro
  <main
    id="main-content"
    class:list={[
      "app-layout lg:max-w-5xl",
      { "mt-8": !config.features.showBackButton },
    ]}
    data-pagefind-body
  >
    <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
      <div class="min-w-0">
        <h1
          style={{ viewTransitionName: toTransitionName(post.id) }}
          class="text-accent inline-block text-2xl font-bold sm:text-3xl"
        >
          {title}
        </h1>

        <div
          aria-hidden="true"
          class="mt-3 h-[3px] w-8 rounded-full"
          style="background: var(--dot)"
        ></div>

        <div class="my-2 flex items-center gap-2">
          <Datetime {pubDatetime} {modDatetime} {timezone} size="lg" />
          <span
            aria-hidden="true"
            class:list={[
              "text-muted-foreground max-sm:hidden",
              { hidden: !config.features.editPost?.enabled || hideEditPost },
            ]}
          >
            |
          </span>
          <EditPost {hideEditPost} {post} class="max-sm:hidden" />
        </div>

        <article
          id="article"
          class:list={[
            "mt-8 w-full",
            "app-prose max-w-app",
            "prose-pre:bg-(--shiki-light-bg) dark:prose-pre:bg-(--shiki-dark-bg)",
          ]}
        >
          <Content />
        </article>

        <hr class="my-8 border-dashed" />

        <EditPost class="sm:hidden" {hideEditPost} {post} />

        <BackToTopButton />

        <ul class="mt-4 mb-8 flex flex-wrap gap-4 sm:my-8">
          {tags.map(tag => <Tag tag={slugifyStr(tag)} tagName={tag} size="sm" />)}
        </ul>

        <ShareLinks />

        <hr class="my-8 border-dashed" />

        <AdjacentPostNav {prevPost} {nextPost} />

        <Giscus />
      </div>

      <div class="hidden lg:block" data-pagefind-ignore>
        <div class="sticky top-6">
          <Toc headings={headings} />
        </div>
      </div>
    </div>
  </main>
```

注意:右栏加了 `data-pagefind-ignore`,避免目录文本被搜索索引(与正文标题重复)。

- [ ] **Step 5: 构建 + 内容检查**

Run: `pnpm build`
Expected: 构建成功。

Run: `grep -o '目录\|data-toc-link\|background:var(--dot)' dist/posts/how-to-write-posts/index.html | sort -u`
Expected: 出现 `目录`、`data-toc-link`、`background:var(--dot)`(说明目录已挂载、标题点缀线已渲染)。

Run: `grep -o '<details' dist/posts/how-to-write-posts/index.html`
Expected: 无输出(旧的内置折叠目录已移除)。

- [ ] **Step 6: 提交**

```bash
git add src/styles/theme.css astro.config.ts src/components/Toc.astro "src/pages/posts/[...slug]/index.astro"
git commit -m "feat: add themed sidebar TOC and title accent line to post pages"
```

---

## Task 5: 全量验证与部署

**Files:**
- 无代码改动;运行验证并推送

- [ ] **Step 1: 全量构建**

Run: `pnpm build`
Expected: 构建成功、无警告报错。

- [ ] **Step 2: 本地预览逐路由检查**

Run(后台): `pnpm preview --port 4321`

```bash
curl -s localhost:4321/ | grep -c '你好,我是 YooVood'         # 期待 ≥1
curl -s localhost:4321/posts/ | grep -c '欢迎来到我的博客'     # 期待 ≥1(文章列表正常)
curl -s localhost:4321/posts/how-to-write-posts/ | grep -c 'data-toc-link'   # 期待 ≥1
curl -s localhost:4321/posts/hello-world/ | grep -c 'data-toc-link'          # 期待 0(该文无小标题)
curl -s localhost:4321/about/ | grep -c '关于'                              # 期待 ≥1
```
Expected: 全部符合括号内期待。然后关闭 preview 进程。

手动目检(浏览器开 `http://localhost:4321`):
- 首页:头像左、问候右,两个胶囊按钮跳转正确;列表项虚线分隔、标题圆润;右上角切换深色模式后整站换色。
- 文章页(`/posts/how-to-write-posts/`):标题下粉线;桌面宽度下右侧出现目录,滚动时当前项变蓝高亮、悬停变粉;移动端宽度无目录。
- Giscus 评论区仍在文章底部正常注入。

- [ ] **Step 3: 提交 + 推送触发部署**

```bash
git push origin main
```
Expected: GitHub Actions 运行 `deploy.yml`,部署到 GitHub Pages。

- [ ] **Step 4: 线上验证**

等待 Actions 跑完后:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://wyk2005.github.io/            # 期待 200
curl -s -o /dev/null -w '%{http_code}\n' https://wyk2005.github.io/posts/how-to-write-posts/  # 期待 200
curl -s https://wyk2005.github.io/ | grep -c '你好,我是 YooVood'                # 期待 ≥1
```

- [ ] **Step 5: 收尾更新 README(可选,一句话)**

如果仓库有 README 提到主题外观,可顺手补一行:「本博客基于 AstroPaper 定制,YooVood 蓝粉配色 + GitHub 式首页。」非必须。
