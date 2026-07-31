# GitHub Pages 上传清单

## 第一次发布

1. 新建 GitHub 仓库：`daily-brief`
2. 上传本文件夹内的全部内容到仓库根目录
3. 打开仓库 `Settings` → `Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`，目录选择 `/root`
6. 保存并等待部署完成
7. 手机打开生成的网址并收藏

## 以后更新

每次更新只需要提交新增或变化的文件：

```text
index.html
YYYY/MM/DD/index.html
data/YYYY-MM-DD.json
markdown/YYYY-MM-DD.md
audio/YYYY-MM-DD.mp3   # 如果当天有音频
```

## 今天的音频预留路径

```text
audio/2026-07-30.mp3
```

把未来生成的 MP3 放到这个路径后，网页顶部播放器会自动使用它。
