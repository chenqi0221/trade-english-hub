# 外贸英语通 (TradeEnglish Hub)

专为外贸从业者打造的微信小程序英语学习工具，整合 GitHub 三大高星英文学习项目。

## 项目介绍

本项目整合以下三个 GitHub 高星英文学习项目：

| 原项目 | Stars | 整合功能 |
|--------|:-----:|----------|
| [everyone-can-use-english](https://github.com/ZuodaoTech/everyone-can-use-english) | 27.8k | AI口语对话 + 学习进度追踪 |
| [qwerty-learner](https://github.com/RealKai42/qwerty-learner) | 19.9k | 商务英语词库 + 打字练习 |
| [chinese-programmer-wrong-pronunciation](https://github.com/shimohq/chinese-programmer-wrong-pronunciation) | 23.1k | 发音纠正 + 常见错误警示 |

## 核心功能

### 1. 单词速记 (WordMaster)
- 8大外贸场景分类词库（客户开发、产品询价、价格谈判、订单确认、物流沟通、售后服务、投诉处理、视频会议）
- 打字练习 + 选择练习两种模式
- 错题本自动收录
- 学习进度追踪

### 2. 发音纠正 (PronunciationFix)
- 真人音频播放（有道词典API）
- 常见发音错误警示
- 录音对比功能
- 播放速度调节

### 3. AI口语课 (AIPartner)
- 6大商务话题智能对话
- 语法提示
- 语音输入
- 实时反馈

### 4. 场景演练 (ScenePractice)
- 8大真实外贸场景模拟
- 听力/跟读/角色扮演三种模式
- 常用句型库
- 对话模板

## 技术栈

- **前端**：微信小程序原生框架
- **UI**：自定义组件 + CSS变量主题
- **数据存储**：微信本地存储
- **音频**：有道词典开放API
- **AI**：预留OpenAI/文心一言接口

## 项目结构

```
├── app.js                    # 小程序入口
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── design.md                 # 设计文档
├── utils/
│   ├── wordData.js           # 外贸英语词库数据
│   └── sceneData.js          # 场景对话数据
└── pages/
    ├── index/                # 首页
    ├── study/                # 学习页
    ├── practice/             # 练习页
    ├── profile/              # 个人中心
    ├── word-practice/        # 单词速记
    ├── pronunciation/        # 发音纠正
    ├── ai-chat/              # AI口语课
    ├── scene-practice/       # 场景演练
    ├── word-detail/          # 单词详情
    ├── error-book/           # 错题本
    └── favorites/            # 收藏夹
```

## 安装使用

### 开发环境
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆本仓库
3. 在微信开发者工具中导入项目
4. 在 `project.config.json` 中填入您的小程序 `appid`
5. 点击编译即可预览

### 使用方式
- 打开微信小程序搜索"外贸英语通"
- 或扫描小程序码进入

## 词库数据

目前包含以下外贸场景词汇：

| 场景 | 词汇数量 |
|------|:--------:|
| 客户开发 | 4 |
| 产品询价 | 5 |
| 价格谈判 | 5 |
| 订单确认 | 6 |
| 物流沟通 | 7 |
| 售后服务 | 4 |
| 投诉处理 | 3 |
| 视频会议 | 3 |

**总计：37个核心外贸词汇**，持续扩充中...

## 开发计划

- [x] 基础框架搭建
- [x] 四大核心模块开发
- [x] 词库数据整理
- [ ] 接入真实AI API
- [ ] 语音识别评测
- [ ] 用户登录系统
- [ ] 学习数据统计
- [ ] 桌面版开发

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

## 致谢

感谢以下开源项目提供的灵感和数据支持：

- [everyone-can-use-english](https://github.com/ZuodaoTech/everyone-can-use-english) by ZuodaoTech
- [qwerty-learner](https://github.com/RealKai42/qwerty-learner) by RealKai42
- [chinese-programmer-wrong-pronunciation](https://github.com/shimohq/chinese-programmer-wrong-pronunciation) by shimohq

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [GitHub Issue](../../issues)
- 发送邮件至：your-email@example.com

---

**外贸英语通** - 让外贸人的英语学习更高效！
