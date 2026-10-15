# 必应 - 屏蔽广告块 + 清理追踪参数

油猴脚本：移除必应搜索结果里的广告块，并自动清理 URL 中的 `from` / `FORM` 等追踪参数。

## 功能

- 移除必应搜索结果中的广告块（`ol#b_topw.b_results_eml`），并监听 DOM 变化，异步加载出来的也会被移除
- 自动删除地址栏 URL 中的追踪参数（`from`、`FORM` 等，不区分大小写），然后原地重定向
- 想加更多参数，改脚本顶部的 `TRACKING_PARAMS` 数组即可

## 使用说明

1. 使用 Chrome、Chrome 内核浏览器或 Edge
2. 下载油猴应用（Tampermonkey）
3. 打开油猴插件，新建脚本，将 `bing-clean.user.js` 中的所有内容复制到编辑器中并保存
4. 打开必应搜索页（`https://www.bing.com/search?q=...`）
5. 脚本自动运行：广告块被移除，带追踪参数的链接自动清理

> **注意**：需要开启开发者模式，并允许用户脚本。

## 尝试点击安装？
> 需要先安装 Tampermonkey 插件

[点击这里安装脚本](https://raw.githubusercontent.com/xiangshangya/bing-clean/main/bing-clean.user.js)

---

## 更新日志

### v2.0
- 新增 URL 追踪参数清理（`from` / `FORM` 等，不区分大小写），避免死循环重定向
- 广告块移除改为 `DOMContentLoaded` + `MutationObserver`，兼容必应异步加载

> `bing-clean.user.js` 和 `bing-clean.js` 没有任何不同，`bing-clean.user.js` 仅仅是为了实现点击自动安装而复制改了文件名。
