// ==UserScript==
// @name         必应 - 屏蔽广告块 + 清理追踪参数
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  移除广告 div 并自动去除 URL 中的 from/FORM 等追踪参数
// @author       xiangshangya
// @match        *://*.bing.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/xiangshangya/bing-clean
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 1. 清理 URL 中的追踪参数 ----------
    // 定义要剔除的参数名（不区分大小写）
    const TRACKING_PARAMS = ['from', 'FORM', 'form', 'From']; // 可以按需添加更多

    function cleanUrlParams() {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        let modified = false;

        // 遍历所有要剔除的参数，如果存在则删除
        TRACKING_PARAMS.forEach(param => {
            // 不区分大小写：先获取所有参数名，然后比较小写
            for (let key of params.keys()) {
                if (key.toLowerCase() === param.toLowerCase()) {
                    params.delete(key);
                    modified = true;
                }
            }
        });

        // 如果修改了参数，则重定向到新 URL（不保留历史记录）
        if (modified) {
            const newUrl = url.toString();
            // 防止死循环：只有新 URL 与当前不同时才跳转
            if (newUrl !== window.location.href) {
                console.log('[油猴脚本] 检测到追踪参数，重定向至:', newUrl);
                window.location.replace(newUrl);
                return true; // 表示已发起重定向
            }
        }
        return false;
    }

    // 执行清理，如果触发了重定向，则后续代码不再执行
    if (cleanUrlParams()) {
        return; // 页面即将跳转，停止执行
    }

    // ---------- 2. 移除目标 div（原有功能） ----------
    const TARGET_SELECTOR = 'ol#b_topw.b_results_eml';

    function removeTargetElement() {
        const target = document.querySelector(TARGET_SELECTOR);
        if (target) {
            target.remove();
            console.log('[油猴脚本] 已移除目标元素:', TARGET_SELECTOR);
        }
    }

    // 首次加载执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeTargetElement);
    } else {
        removeTargetElement();
    }

    // 监听动态变化（Bing 异步加载）
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches && node.matches(TARGET_SELECTOR)) {
                        node.remove();
                        console.log('[油猴脚本] 动态移除目标元素');
                        return;
                    }
                    const child = node.querySelector && node.querySelector(TARGET_SELECTOR);
                    if (child) {
                        child.remove();
                        console.log('[油猴脚本] 动态移除目标元素（子节点）');
                        return;
                    }
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();