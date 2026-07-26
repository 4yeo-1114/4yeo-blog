+++
date = '2026-07-26T14:43:01+08:00'
draft = false
title = '记第一次博客搭建'
tags = ['博客', 'Hugo', '建站']
categories = ['建站']
description = '用 Hugo + Cloudflare Pages 搭建个人博客的完整记录'
+++

## 为什么要搭博客？

也没有太多为什么 暑假闲的 可以在上面顺便写点东西

## 我的方案：Hugo + Cloudflare Pages

感谢claude给我的方案 不然我自己来第一次真是啥也不懂

核心思路：**本地写 Markdown → 生成静态 HTML → 推送到免费 CDN 自动部署**。

选 Hugo 的理由：

1. **极速** — 几百篇文章也能在毫秒级完成构建
2. **单文件** — 一个二进制文件搞定，没有依赖噩梦
3. **成熟** — 生态完善，主题丰富
4. **简洁** — 没有复杂的概念，上手快

## 搭建过程

```bash
# 安装 Hugo（winget 一行搞定）
winget install Hugo.Hugo.Extended

# 创建站点
hugo new site 4yeo

# 安装 PaperMod 主题
git clone --depth 1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod

# 写文章
hugo new posts/hello-world.md

# 本地预览
hugo server -D
```

然后推送到 GitHub，Cloudflare Pages 自动部署，全程零成本。

## 这样搭建有什么方便之处

相比之前用过的 WordPress、Hexo 等方案，这次有几个体会：

- **不折腾服务器** 是最正确的决定
- **Markdown 写作** 意味着文章是纯文本，永远能迁移
- **Git 版本控制** 让所有修改都有记录
- **不需要数据库** 意味着不需要备份、不需要维护



---

*2026-07-26*
