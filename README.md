# dsh-ui-cards · UI验牌

> **界面随便改。** 这个插件的界面、卡牌样式、配色、动画、布局——**任何人可以随意改、随意 fork、
> 随意重发**，不用问作者。唯一要求：保留原作者的 MIT 版权声明（这本来就是 MIT 的要求）。
> 改得好看，欢迎回来提 PR / 甩张截图。

把 DSH 右上角那枚 **「⋯ 更多操作」** 按钮改造成**卡牌式的插件扩展坞**：点它不再弹原来的
反馈/下载日志菜单，而是从顶部滑下一排**半透明卡牌**；原本散落在前端各处、互相叠在一起的
插件入口，会被收容成一张张卡牌，**点卡即开**。

- 中文名：UI验牌（卡牌式扩展 UI）｜ 英文名：UI Cards
- 形态：顶部卡牌条，中间实、两边虚，首尾循环（不是贴边小下拉）
- **卡牌本身不带交互功能**：卡面只有图标 / 标题 / 副标题 / 角标，点一下才打开对应插件

## 安装

```sh
# npm
dsh plugin --profile web add dsh-ui-cards

# 本地目录（改源码调试）
dsh plugin --profile web add "link:<本目录绝对路径>"
```

装完**重启 DSH**：宿主侧的插件台账路由需要重启才生效；客户端的拦截、卡牌、设置弹窗不依赖宿主，
刷新页面即可用。

**环境要求**：开发与验收基线是 DSH `0.2.1-rc.2`。客户端 `inject` 里的
`@deepseek-ai/dsh-client-ui-slots` 由 DSH 自带的 web 前端包（`@deepseek-ai/dsh-web-frontend`）
提供，不是独立 npm 包；**更早版本未实测**（需要 `window.__ModuleLoader__` 客户端握手）。
升级后如发现卡牌坞不出现，先看控制台是否有 `__ModuleLoader__ is not defined`。

## 它做什么

| 能力 | 说明 |
|---|---|
| 入口接管 | 拦截 `button[aria-label="更多操作"]` 的点击，不再触发原生菜单；按钮外观零改动 |
| 卡牌条 | 点 ⋯ 从顶部滑下，半透明玻璃，高度默认 25% 页高；卡牌按黄金比例 |
| **卡牌 = 纯入口** | 卡面不承载插件交互，点卡才打开插件界面 |
| 模糊循环 | 中间清晰、两侧模糊渐隐，首尾循环；绕回发生在完全透明处，没有翻牌感 |
| 操作 | 滚轮 / ← → / A D / 拖拽 / 底部圆点；可开自动滑动；Esc 或点主界面关闭 |
| 设置弹窗 | 右键卡牌条打开：占屏高度、可见卡数、边框花纹、亮度、圆角、主题、单卡外观（皮肤 / 卡面图） |
| 收容管控 | 扫 `<body>` 下插件浮层，可收容成卡牌或放行；带**注册密钥**的插件自动放行 |
| 插件台账 | 宿主扫描本 profile 的 bundle 清单，标出带前端 UI 的插件与密钥状态 |

## 注册密钥（放行机制）

规则：从官方 / 市场 / 直接拉取安装的插件默认收容进本坞；**自己想放到别处的，带个密钥就放行**。
只拦**基线之后**新装的插件（首次运行会把当时的插件全部记为基线，存量不拦）。

密钥两种写法（二选一，非空即算）：

```jsonc
// 1) <插件包目录>/package.json
"dsh": { "uiExtension": { "key": "任意字符串" } }
```

```
2) <插件包目录>/.ui-ext-key      # 文件内容一行，非空即可
```

## 宿主路由

```
GET /ui-extension/plugins   → { ok, profile, dir, count, plugins: [...] }
GET /ui-extension/health    → { ok, profile }
```

> 路由名沿用 `ui-extension`（历史原因，不影响包名）。宿主侧改动需要重启 DSH 才生效；
> 客户端功能刷新页面即可。

## 客户端 API（给别的插件用）

```js
// 注册一张卡（自带皮肤 / 卡面图；可选声明怎么开）
window.__DSH_UI_EXT__.register('my-card', {
  title: '我的插件',
  icon: '◆',
  badge: '插件',
  skin: 'gold',                 // none / gold / diamond / ice / grid
  image: 'https://…/cover.png', // 卡面图（可省）
  hide: ['#my-fab'],            // 收容后自动隐藏的主界面入口
  open: () => window.__MY_PLUGIN__.open(),
})

// 打开器注册表：不想动卡片，只想告诉坞「怎么开」
window.__DSH_UI_EXT__.setOpener('plugin:xxx', () => window.__XXX__.open())
window.__DSH_UI_EXT__.openCard('plugin:xxx')

// 坞本身
window.__DSH_UI_EXT__.open() / .close() / .toggle() / .openSettings()
window.__DSH_UI_EXT__.host(id, node, label) / .unhost(id) / .scan()
```

## 开发 / 验收

```
lib/client.js   # 前端：手写，ModuleLoader handshake，无打包
lib/index.js    # 宿主：插件台账 + 密钥扫描路由
```

两者都是手写产物，**直接放在 `lib/` 里就是发布内容**，没有构建步骤、不需要 `pnpm build`。

真机验收走 CDP（刷新页面即可，不必重启 DSH）：确认 `button[aria-label="更多操作"]` 的点击被拦截、
卡牌条弹出、卡牌数量与设置弹窗正常、Esc 关闭、console 无报错（宿主重启期间的 connection retry 除外）。

> 本地调试用的临时脚本与截图放在 `_probe/`，已被 `.gitignore` 排除 —— 不进仓库，也不进 npm 包。

## 状态

- v0.1.0（首次公开）：卡牌条 + 模糊循环 + 设置弹窗 + 单卡皮肤/卡面图 + 收容管控 + 宿主台账
- 待办：真正的「硬拦」（现在拦 DOM 浮层，不拦别处自行注册的按钮）、过滤框命中高亮
