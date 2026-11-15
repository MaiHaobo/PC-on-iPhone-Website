# PC on iPhone — Website

[ PC on iPhone ](https://github.com/MaiHaobo/PC-on-iPhone/)的官网，基于 **Vite** 多页构建 。

[点此浏览](https://maihaobo.github.io/PC-on-iPhone-Website/)

## 页面

| 文件 | 内容 |
|---|---|
| `index.html`  | 首屏、核心亮点、上手流程、结尾 CTA |
| `features.html` | 功能分组（输入 / 窗口 / 文件与外设） |
| `download.html` | 下载安装 |
| `install.html` | 详细安装教程 |
| `guide.html` | 详细使用教程 |
| `faq.html`  | 常见问题 |
| `fandback.html` | 问题反馈 |
| `gallery.html` | 系统画廊 |
| `about.html` | 项目背景、技术栈、联系方式 |

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建结果
```



相关代码：

- `src/styles.css` — 设计变量、布局与组件
- `src/main.js` — 导航交互、滚动揭示、启动时序（`requestIdleCallback` 后再申请 GPU 资源）



## 部署

`vite.config.js` 已设置 `base: "./"`，构建产物可部署在任意子路径，包括：

```
https://maihaobo.github.io/PC-on-iPhone-Website/
```

需要时开启 GitHub Pages 并在仓库设置中选择 `GitHub Actions` 作为来源即可；也可临时手动推送 `dist/` 到 `gh-pages` 分支。

## 许可证

我们非常欢迎任何形式的贡献！如果你发现了 Bug，或者有更好的代码优化方案，欢迎提交 Issue 或 [点此反馈](https://maihaobo.github.io/PC-on-iPhone-Website/fandback.html/)。
