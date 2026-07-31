# Daily Brief

一个适合部署到 GitHub Pages 的个人信息看板。当前版本包含：

- 固定首页：展示最新一期简报
- 日期归档：按 `YYYY/MM/DD/` 保存历史内容
- 结构化数据：每天保存一份 JSON，方便后续分析
- Markdown 归档：方便人工阅读、迁移和二次编辑
- 音频预留：支持未来每日 MP3 播报
- 浏览器朗读：没有 MP3 时可作为备用

## 目录结构

```text
daily-brief/
├─ index.html                  # 首页，展示最新一期
├─ daily-brief.html             # 兼容入口，会跳转到 index.html
├─ 2026/07/30/index.html        # 2026-07-30 日期归档
├─ data/2026-07-30.json         # 当天结构化数据
├─ markdown/2026-07-30.md       # 当天 Markdown 归档
├─ audio/                       # 每日 MP3 音频目录
│  └─ 2026-07-30.mp3            # 未来生成后放这里
├─ assets/
│  ├─ style.css                 # 全站样式
│  └─ app.js                    # 浏览器朗读逻辑
├─ _shared/fonts/               # 本地字体
└─ .nojekyll                    # GitHub Pages 静态文件开关
```

## 发布到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `daily-brief`。
2. 把本目录中的所有文件上传到仓库根目录。
3. 进入仓库 `Settings`。
4. 打开 `Pages`。
5. `Build and deployment` 选择 `Deploy from a branch`。
6. `Branch` 选择 `main`，目录选择 `/root`。
7. 保存后等待 GitHub Pages 构建完成。

部署完成后，固定网址通常是：

```text
https://你的GitHub用户名.github.io/daily-brief/
```

## 每天更新方式

每天新增：

```text
YYYY/MM/DD/index.html
data/YYYY-MM-DD.json
markdown/YYYY-MM-DD.md
audio/YYYY-MM-DD.mp3   # 可选，等 MP3 生成后再放
```

同时更新：

```text
index.html             # 首页改为最新一期
```

## MP3 播放器

页面已经预留了 MP3 播放器。比如今天的音频文件路径是：

```text
audio/2026-07-30.mp3
```

如果该文件存在，网页顶部的播放器就可以直接播放。如果文件不存在，页面仍可正常显示，并可使用“浏览器朗读”作为备用。

## 隐私提醒

GitHub Pages 默认公开访问。请不要把账号、授权码、个人隐私、内部资料或不希望公开传播的内容放入页面。
