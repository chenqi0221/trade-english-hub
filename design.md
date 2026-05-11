# 外贸英语通 (TradeEnglish Hub) - 设计文档

## 1. 项目概述

### 1.1 项目背景
整合 GitHub 三大高星英文学习项目（qwerty-learner、chinese-programmer-wrong-pronunciation、everyone-can-use-english），打造专为中国外贸从业者设计的英语学习微信小程序。

### 1.2 目标用户
- 外贸业务员
- 跨境电商从业者
- 国际贸易学生
- 需要提升商务英语能力的职场人士

### 1.3 核心目标
- 解决外贸场景下的英语沟通痛点
- 提供系统化的商务英语训练
- 利用AI技术提升学习效率
- 打造碎片时间学习体验

## 2. 功能架构

### 2.1 四大核心模块

#### 模块一：单词速记 (WordMaster)
- **来源**：qwerty-learner
- **功能**：
  - 商务英语/BEC高频词库
  - 外贸专业术语库（询盘、报价、合同、物流等）
  - 打字练习模式（参考qwerty-learner的肌肉记忆训练）
  - 单词拼写挑战
  - 学习进度统计
- **特色**：
  - 结合外贸场景分类（客户开发、产品描述、价格谈判、订单处理、售后服务）
  - 错误单词自动收录到错题本
  - 每日打卡挑战

#### 模块二：发音纠正 (PronunciationFix)
- **来源**：chinese-programmer-wrong-pronunciation
- **功能**：
  - 外贸高频词汇发音库
  - 真人音频播放（英音/美音）
  - 常见发音错误警示
  - 录音对比功能
  - 音标学习
- **特色**：
  - 重点收录中国外贸人易读错的单词
  - 品牌名、产品名正确发音
  - 连读、弱读技巧

#### 模块三：AI口语课 (AIPartner)
- **来源**：everyone-can-use-english
- **功能**：
  - AI对话练习
  - 影子跟读训练
  - 语音识别评分
  - 语法纠错
  - 流利度分析
- **特色**：
  - 自适应难度调整
  - 话题引导
  - 实时反馈

#### 模块四：场景演练 (ScenePractice)
- **原创功能**
- **场景列表**：
  1. 客户开发（Cold Email、展会交流）
  2. 产品询价（Product Inquiry）
  3. 价格谈判（Price Negotiation）
  4. 订单确认（Order Confirmation）
  5. 物流沟通（Shipping & Logistics）
  6. 售后服务（After-sales Service）
  7. 投诉处理（Complaint Handling）
  8. 视频会议（Video Conference）
- **功能**：
  - 角色扮演对话
  - AI扮演客户/供应商
  - 常用句型库
  - 对话模板

### 2.2 辅助功能

#### 个人中心
- 学习数据统计
- 错题本
- 收藏单词
- 学习日历
- 成就系统

#### 每日推荐
- 每日一词
- 每日一句（外贸金句）
- 每日一听（短音频）

## 3. 技术架构

### 3.1 前端
- **框架**：微信小程序原生框架
- **UI组件**：WeUI + 自定义组件
- **状态管理**：MobX或自研简单状态管理

### 3.2 后端
- **方案**：微信云开发
- **数据库**：云数据库（MongoDB）
- **存储**：云存储（音频文件）
- **云函数**：Node.js

### 3.3 AI能力
- **语音识别**：微信同声传译插件 或 讯飞API
- **语音合成**：微信内置TTS 或 百度语音
- **对话AI**：OpenAI API / 文心一言 / 通义千问
- **发音评分**：讯飞语音评测

### 3.4 数据设计

#### 词库数据结构
```javascript
{
  word: "quotation",
  phonetic: "/kwəʊˈteɪʃn/",
  meaning: "报价单",
  category: "price_negotiation",
  scene: ["询盘", "报价"],
  example: "Could you send me a quotation?",
  audio_url: "cloud://...",
  difficulty: 2,
  wrong_pronunciation: ["/ˈkwəʊteɪʃn/"]
}
```

#### 用户学习记录
```javascript
{
  user_id: "openid",
  word_id: "...",
  practice_count: 5,
  correct_count: 4,
  last_practice: "2026-05-11",
  mastery_level: 0.8
}
```

## 4. UI/UX设计

### 4.1 整体风格
- 主色调：商务蓝 (#1E5F8E) + 活力橙 (#FF6B35)
- 辅助色：浅灰背景、白色卡片
- 字体：系统默认字体，英文使用等宽字体

### 4.2 页面结构

#### 首页 (Tab 1)
- 顶部：用户学习数据概览
- 中部：每日推荐（一词一句一听）
- 下部：快捷入口（四个模块）

#### 学习页 (Tab 2)
- 单词速记入口
- 发音纠正入口
- 学习进度展示

#### 练习页 (Tab 3)
- AI口语课入口
- 场景演练入口
- 最近练习记录

#### 我的 (Tab 4)
- 个人资料
- 错题本
- 收藏夹
- 设置

### 4.3 关键交互

#### 打字练习界面
- 单词显示区（大字体）
- 输入框（实时校验）
- 键盘提示（可选）
- 正确/错误动画反馈
- 连击计数

#### 发音纠正界面
- 单词卡片（音标+音频按钮）
- 常见错误提示（红色警示）
- 录音按钮
- 对比播放

#### AI对话界面
- 聊天式界面
- 语音输入按钮
- 文字输入框
- AI回复（带语音播放）
- 纠错提示

## 5. 开发计划

### 第一阶段：MVP版本（2周）
1. 项目搭建与基础架构
2. 单词速记模块（基础功能）
3. 发音纠正模块（基础功能）
4. 个人中心与数据存储

### 第二阶段：核心功能（2周）
1. AI口语课模块
2. 场景演练模块
3. 语音识别集成
4. 学习数据统计

### 第三阶段：优化迭代（1周）
1. UI优化
2. 性能优化
3. 词库扩充
4. 测试与修复

## 6. 数据准备

### 6.1 初始词库
- BEC商务英语核心词汇（约2000词）
- 外贸专业术语（约500词）
- 按场景分类整理

### 6.2 音频资源
- 单词发音音频
- 场景对话音频
- 使用TTS生成或引用开源资源

### 6.3 场景对话模板
- 每个场景准备10-20组对话
- 覆盖常见沟通情况

## 7. 运营与扩展

### 7.1 用户激励
- 连续打卡奖励
- 学习积分系统
- 排行榜（可选）
- 成就徽章

### 7.2 未来扩展
- 桌面版（Electron）
- 更多行业词库（跨境电商、国际物流等）
- 真人外教对接
- 企业版（团队学习管理）

## 8. 参考资源

### 8.1 开源项目
- [qwerty-learner](https://github.com/RealKai42/qwerty-learner) - 打字练习与词库
- [chinese-programmer-wrong-pronunciation](https://github.com/shimohq/chinese-programmer-wrong-pronunciation) - 发音纠正
- [everyone-can-use-english](https://github.com/ZuodaoTech/everyone-can-use-english) - AI学习理念

### 8.2 API与工具
- 微信同声传译插件
- 讯飞开放平台
- OpenAI API
- 有道词典API（发音）
