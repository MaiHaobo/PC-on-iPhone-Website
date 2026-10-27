# PC on iPhone — Website

官方网站，基于 **Vite** 多页构建 + [@glass-sdk/liquid-glass](https://github.com/Glass-HQ/liquid-glass) 液态玻璃材质。

## 页面

| 文件 | 路由 | 内容 |
|---|---|---|
| `index.html` | `/` | 首屏、核心亮点、上手流程、结尾 CTA |
| `features.html` | `/features.html` | 功能分组（输入 / 窗口 / 文件与外设） |
| `faq.html` | `/faq.html` | 常见问题手风琴 |
| `about.html` | `/about.html` | 项目背景、技术栈、联系方式 |

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建结果
```

## 液态玻璃的实现方式

材质由 `@glass-sdk/liquid-glass` 的 **DOM 入口**（`@glass-sdk/liquid-glass/dom`）渲染，不依赖 React 组件层，因此四个独立 HTML 页面可以共用一个渲染管线。

- 库只提供 `npm` 分发，**没有 CDN / UMD 版本**，所以必须经过 Vite 打包，不能直接用 `<script src>` 引入。
- 渲染依赖 **WebGPU**：需要 HTTPS（或 localhost）环境与可用的 GPU adapter。
- Safari、旧版浏览器、无 WebGPU 的设备会自动降级为 `src/styles.css` 里的 CSS `backdrop-filter` 毛玻璃材质，内容与导航行为完全不受影响。
- 降级时会显示一条提示条（`[data-glass-note]`），可在不需要时删除对应元素。

相关代码：

- `src/glass.js` — WebGPU 探测、场景创建、surface 注册、降级分支
- `src/styles.css` — 设计变量、玻璃兜底样式、布局与组件
- `src/main.js` — 导航交互、滚动揭示、启动时序（`requestIdleCallback` 后再申请 GPU 资源）

## 文案状态

**当前所有文案均为占位内容**，用于先定版式与交互。替换时注意：

1. 保留 `class` 结构，只改文本节点，避免破坏玻璃材质的尺寸计算。
2. 首页首屏需要 1 个主行动按钮，建议不要超过 2 个。
3. 图片资源放在 `public/`（Vite 会原样拷贝），引用路径用 `./` 前缀以兼容子路径部署。

## 部署（暂未开启）

`vite.config.js` 已设置 `base: "./"`，构建产物可部署在任意子路径，包括：

```
https://maihaobo.github.io/PC-on-iPhone-Website/
```

需要时开启 GitHub Pages 并在仓库设置中选择 `GitHub Actions` 作为来源即可；也可临时手动推送 `dist/` 到 `gh-pages` 分支。

## 许可证

站点代码与文案归项目所有；`@glass-sdk/liquid-glass` 为 MIT。
