import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://wyk2005.github.io/",
    title: "YooVood的博客",
    description: "记录技术、学习与生活。",
    author: "wyk",
    profile: "https://github.com/wyk2005",
    ogImage: "default-og.jpg",
    lang: "zh",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/wyk2005/wyk2005.github.io/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/wyk2005" },
    { name: "mail", url: "mailto:2643620404@qq.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
  comments: {
    provider: "giscus",
    repo: "wyk2005/wyk2005.github.io",
    repoId: "R_kgDOT8OXRA",
    category: "Announcements",
    categoryId: "DIC_kwDOT8OXRM4DDopv",
    mapping: "pathname",
    lang: "zh-CN",
    theme: "preferred_color_scheme",
  },
});
