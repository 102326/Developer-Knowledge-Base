# 构建、发布与维护

## 版本与来源

- Quartz 稳定标签：`v5.0.0`
- 上游完整提交：`ab346fa66a895e12d63a308e70ce330ba795822a`
- 来源：https://github.com/jackyzha0/quartz/tree/ab346fa66a895e12d63a308e70ce330ba795822a
- 本地验证运行时：Node.js `24.19.0`、npm `11.9.0`。`.node-version` 固定 Node 版本。
- npm 依赖使用 `package-lock.json`；24 个插件（23 个启用，og-image 仅保留 Quartz 核心必需的导出，生成器停用）的源代码提交使用 `quartz.lock.json` 固定。插件恢复命令仍会执行上游插件自身的 npm 安装/构建逻辑，不等同于所有嵌套依赖的永久离线镜像。
- 上游软件许可证保留在 `LICENSE.txt`；原创内容权利说明见 `RIGHTS.md`。

## 本地构建

在仓库根目录运行：

```sh
npm ci
node scripts/verify-source.mjs
npx quartz plugin restore
node scripts/verify-plugins.mjs
node scripts/apply-subpath-compat.mjs
npm run check
node --import tsx --test
npx quartz build
node scripts/verify-output.mjs
```

预览：`npx quartz build --serve`，打开终端显示的本地地址。生成目录是 `public/`，不应手工修改或提交。若受限环境无法写默认 npm 缓存，可以为本次命令指定可写的 `npm_config_cache` 目录。

本版验证与维护以本节命令和 Pages 工作流为准。随上游保留的 `Dockerfile` 尚未对齐子路径兼容步骤，不作为本版已验证的构建方式。

`plugin restore` 在已有插件目录时会跳过它，因此不要把重复执行视作版本核验。`verify-plugins.mjs` 检查真实 HEAD 和构建入口；版本不符时先保存任何本地插件修改，再从干净检出恢复。不要直接使用 `--latest` 绕过版本固定。

## 发布范围

只有 `content/` 是网站内容输入，首版仅有 8 篇审核选定页面。每页必须显式设置 `publish: true`、`draft: false`；两项过滤器同时启用。未授权内容、内部审阅资料、凭据、私人文件不得复制到仓库，即使没有链接也不能视作保密。

普通链接使用相对 Markdown 路径。图谱、评论和分析追踪未启用；字体使用本地系统字体。中文搜索、目录与移动布局由已固定的 Quartz 插件提供。

## GitHub Pages

仓库：https://github.com/102326/Developer-Knowledge-Base
Pages 配置地址：https://102326.github.io/Developer-Knowledge-Base/

仓库已于 2026-10-16 创建。网站是否部署成功应以当前提交的 Actions 记录与实际 HTTP/浏览器检查为准，不能仅依据配置地址判断。实际仓库名称、所有者改变时，必须同步修改 `quartz.config.yaml` 的 `configuration.baseUrl`，并重新测试项目子路径。

页脚的“GitHub 源码”入口已指向上述实际仓库。更改仓库位置时同步维护 footer 插件的 `options.links`，再构建并在线验证入口。

推送审核通过的全新源代码后，在仓库 Settings → Pages 中选择 GitHub Actions。仓库发布与 Pages 启用须由有权限的操作者完成；当前交付不代表已执行这些在线动作。

`.github/workflows/pages.yaml`：

- Pull request 只执行只读构建，不部署，不向分支回写。
- 推送 main 或在 main 手动运行时构建、上传 Pages 工件。
- 独立 deploy job 仅具备 `pages: write`、`id-token: write`；build job 仅 `contents: read`。
- checkout 不保留凭据，Actions 使用已核对的完整提交 SHA。
- 构建任务同时执行 `npm run check`（TypeScript 与格式检查）和 `node --import tsx --test`（核心测试）。

发布后核对当前提交的 Actions 构建与部署记录，并从公网检查首页、文章、搜索、移动端和 404。只有这些检查完成后才能宣布上线。

## 日常更新

1. 修改 `content/`，核对来源、示例执行范围、内部链接与发布标记。
2. 普通文字、链接修改运行相关源文件检查，依靠 CI 构建并抽查受影响页面；首次发布、运行时或依赖变更从干净环境安装和构建。布局、导航或搜索变更再做相应桌面与移动交互检查。
3. 审核 diff，确认没有私人信息或不应发布的文件。
4. 合并到 main，等待 Pages 部署成功，再核对公网。

升级 Quartz 或插件应在独立分支进行：先查阅官方迁移说明，再明确选择版本、更新锁文件及来源记录、重新执行内容/插件验证、构建与交互测试。不要把 v4 的 TypeScript 配置教程直接用于此 v5 YAML 项目。

## 不应提交

`node_modules/`、`.quartz/`、`public/`、缓存、日志、`.env`、私有审阅文件及旧仓库历史均不属于发布源包。保留主工程源码、必要配置、许可证、锁文件及选定内容。上游可选 docs 参考网站已省略；不要使用上游 npm run docs 命令。

## 项目子路径兼容补丁

固定版本的 search/explorer 插件把索引与结果链接写成根路径，不能直接用于 GitHub Pages 项目子目录。scripts/apply-subpath-compat.mjs 从锁定提交的原始源码重建这六个 URL，使用当前 baseUrl 的子路径，然后重建这两个插件。补丁会核对提交与替换上下文，遇到版本变化直接失败；每次安装、恢复或更改 baseUrl 后都要执行。此为本项目的显式兼容修改，不是声称上游未修改。note-properties 插件负责 frontmatter 解析，不能为隐藏属性面板而删除；使用 hidePropertiesView 即可。

补丁脚本只接受锁定原文或此前由该脚本生成的同一补丁；检测到手工修改会停止且不覆盖。脚本恢复这两个插件的开发依赖、构建，再移除开发依赖。verify-plugins 只核验 HEAD 与构建入口存在，不能证明所有工作区字节未修改；子路径补丁就是有意的源码修改。

## 当前验证边界

2026-10-16 从交付源码包在新的 macOS 目录完成重建，使用 Node.js `24.19.0` 与随其分发的 npm `11.17.0`。主工程 `npm ci`、24 个插件恢复/版本检查、子路径补丁、TypeScript/格式检查、69 项既有核心测试与最终八页构建通过。两个临时过滤探针未进入任何输出，测试后已删除。

浏览器已验证本地项目子路径下的中英文搜索、结果点击、后退、Esc 关闭与移动搜索/导航。390px 下八页及移动目录展开/收起均无文档级横向溢出；菜单采用站点 `custom.scss` 的固定定位修复其 16px 偏移。该检查属于浏览器视口测试，不等于真实手机或所有浏览器覆盖。首次 CI 与公网验收由发布流程继续完成，后续结果以对应提交的 Actions 和实际站点为准。

首次公网验收发现 404 返回首页的路径缺少末尾 `/`，SPA 返回后会错误解析首页相对链接。`quartz/components/pages/404.tsx` 已将首页链接规范为目录路径，并新增 3 项回归测试覆盖根站点、带/不带末尾斜线的项目站点；修复前已复现该失败。后续升级需保留这一行为，除非上游已提供等价修复。

### 依赖安全待办

2026-10-16 在固定主锁文件上执行 `npm audit --omit=dev`，报告 25 个依赖条目（15 high、5 moderate、5 low，无 critical）；这不是已清零的安全基线。search 插件清理开发依赖后另报告 6 个条目（5 high、1 low）。告警涉及构建、配置解析、图片处理、模式匹配和本地预览等依赖；本版 Pages 只部署静态产物，不托管 Node 服务，但这不消除构建链的风险。

首版内容与样式为已审阅的本仓库输入；不要把未知来源文件或不可信内容直接交给本地构建处理，也不要把预览服务器暴露为正式服务。后续在独立分支升级相关上游及依赖，重跑相应构建与页面检查；不对固定基线直接执行 `npm audit fix --force`。
