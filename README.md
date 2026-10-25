# Ye — 导演 / AIGC

一个安静的黑白编辑式作品网站。纯静态 HTML + CSS + JavaScript，无第三方依赖、无需构建、无需联网。

**打开方式：直接双击 `index.html`。** 也可以用任意静态服务器预览：

```bash
cd ye-director
python3 -m http.server 8000
# http://localhost:8000
```

---

## 页面

| 页面 | 文件 |
|---|---|
| DIRECTING · 首页（4 个作品） | `index.html` |
| 作品详情 · 潮汐之后 | `work-chaoxi-zhihou.html` |
| 作品详情 · 白色走廊 | `work-baise-zoulang.html` |
| 作品详情 · 木星之下 | `work-muxing-zhixia.html` |
| 作品详情 · 触觉练习 | `work-chujue-lianxi.html` |
| EDITING + · 剪辑年表 | `editing.html` |
| BLOG · 手记列表 | `blog.html` |
| 手记 · 先听见潮声，再看见海 | `blog-xian-tingjian-chaosheng.html` |
| 手记 · 一条走廊能有多长 | `blog-zoulang-weishenme-bifeichuan-chang.html` |
| ABOUT · 关于 | `about.html` |

## 结构

```
ye-director/
├── index.html
├── work-*.html
├── editing.html
├── blog.html
├── blog-*.html
├── about.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/site.js
    ├── img/       # 本地占位剧照、资产图、封面
    └── video/     # 4 条本地占位视频
```

## 设计规格

- 顶部固定栏桌面约 152px（平板 102–118px、手机 84px），纯白，无阴影；字标由淡灰书法 `京野` 与黑色粗体 `Ye` 叠成，`导演 / AIGC` 收在名字右下角；滚动后仅出现 1px 浅灰分隔线。
- 左右留白：桌面 10vw / 平板 6vw / 手机 20px。
- 首页为 4 个满幅单列作品，容器 `70vh`，图片 `object-fit: cover`，作品之间 8px 白间隔；片名压在左下、距底 120px（比原位置高 80px），28px / 0.2em。只有当作品随滚动进入视口中央、图片完整可见并停留约 0.5s 后，才开始片名的 1s 淡入；滚走会取消计时。
- 作品详情改为居中版式：宋体片名、单句介绍、项目合作与展映联络，随后是 16:9 播放器。播放器宽 84vw、最大 1440px（约 1210 × 680px @ 1440），刻意比正文更宽。视频默认停在封面上，中心播放键启动。
- 详情页下半部为米白项目档案（最大 1000px 居中窄栏），包含制作说明、logline、21:9 剧照、工具、四个章节、资产画布、命名、色板、规格与收尾。
- 字体只使用系统字体：宋体（Songti SC / STSong）、苹方（PingFang SC）、Helvetica Neue。
- 色彩：`#FFFFFF` / `#141413` / `#6F6B64` / `rgba(20,20,19,.16)` / `#D24A2F`。
- 首页整页以 1s 慢速淡入上浮；作品图片约 280ms 显现。每张作品滚到视口中央并停留约 0.5s 后，片名才以 1s 淡入；快速滚过或离开中央会取消。详情页文字与播放器以约 1.2–1.35 秒错峰浮现。所有动效均尊重 `prefers-reduced-motion`。

## 替换内容

- 图片：替换 `assets/img/` 下同名文件即可；首页使用 `tide-cover.jpg`、`corridor-cover.jpg`、`jupiter-cover.jpg`、`touch-cover.jpg`。
- 视频：替换 `assets/video/tide.mp4`、`corridor.mp4`、`jupiter.mp4`、`touch.mp4`。播放器默认静音、循环、暂停在封面；点击中心播放键开始播放，并保留自定义的五个控制项。
- 文案：直接编辑各 HTML；共用头部、页脚与交互集中在 `assets/css/style.css` 和 `assets/js/site.js`。

> 当前作品名、简介、署名、奖项与规格均为虚构示例；图片与视频仅作占位演示，上线前请替换为导演本人作品。
