# Changelog

## 0.13.1
- 变动: 更新 gloria-utils 版本到 1.4.0.
- 变动: 增强沙箱安全性, 屏蔽了部分未公开的函数.
- 变动: 通知的时间显示位置变更到任务名称的前面.

## 0.13.0
- 变动: 将 Gloria 的沙箱独立成模块 worker-sandbox 后, 现在使用基于 worker-sandbox 特制的运行时 gloria-sandbox 执行任务代码. 该运行时会在执行任务代码 1 分钟后自动销毁, 以此确保不会有多余的沙箱在后台累积最后造成扩展崩溃, 请确保任务会在 1 分钟内调用 commit 函数(0.12.0 版本新增的放大图片功能不受此运行时间的限制).

## 0.12.0
- 新特性: 当 imageUrl 的图片尺寸低于 360x240 时, 现在会尝试使用 waifu2x 的在线 API 放大图片.

## 0.10.0
- 新特性: 如果 Gloria Notification 的 imageUrl 是比例较为夸张的图片, 为了保证通知的显示效果, 现在会自动裁剪到合适大小.
- 新特性: 对于没有指定 iconUrl 的 Gloria Notificcation, 现在会自动从 url 的网址中分析出合适的网站图标作为 iconUrl.
- 变动: 保留历史记录的上限从100条提高到200条.

## 0.9.9
- 新特性: 现在在 Chrome 没有可见窗口时也能点击通知正常打开网页.
- 新特性: 为每个任务显示最后一次推送时间.
- 新特性: 关闭任务超过24小时后, 会自动清空该任务的 stage(出于节省空间和防止下次打开时会出现一大堆新通知的考虑).
- 变动: 选项界面点击通知后不会使前台直接跳转新的标签页, 而是在后台打开新标签页, 方便回顾历史通知.
- 变动: 提交单个 Gloria Notification 时不再像之前一样作为只有一个的数组处理(常规任务), 而是被当作新的类型"观察任务"处理, 仅比较上一个 Gloria Notification 是否和新提交存在不同以决定是否弹出通知.
- 变动: 为了节省存储空间, Gloria Notification 的 title 和 message 会被 Gloria 自动缩短到100字符.
- 变动: 升级内置的 gloria-utils 版本到 1.2.0, 更新了依赖模块.

## 0.9.7
- 变动: 使用 localStorage 替代 chrome.storage.local, 通过使用降低性能的同步 API 来保证 redux 不再发生状态覆盖的混乱情况.

## 0.9.3
- 新特性: Gloria Notification 新增 id 属性, 该属性和原先的 title 和 message 一样都将被用于文章去重
- 新特性: 如果距离上一次启用 Gloria 的时间已经超过 1 天, 那么原先的所有 stages 将被清空, 以免一次性弹出过多的过时通知

## 0.9.0
- 新特性: 通知 Reducer
- 变动: 点击通知后, 现在会优先将浏览器标签页切换到符合通知URL的页面, 而不是打开新的标签页
