# 火山方舟 TTS 云函数配置说明

## 配置步骤

### 1. 获取火山方舟 API 密钥

登录火山方舟控制台，在"语音合成大模型"页面底部找到：
- **App ID**
- **Access Token**

### 2. 配置云函数

编辑 `cloudfunctions/tts/index.js`，填入你的密钥：

```javascript
const CONFIG = {
  host: 'openspeech.bytedance.com',
  path: '/api/v3/tts/unidirectional',
  appId: '你的AppID',        // 替换为你的 App ID
  accessToken: '你的AccessToken',  // 替换为你的 Access Token
  resourceId: 'seed-tts-2.0',
  defaultSpeaker: 'en_female_amanda_mars_bigtts',
  defaultFormat: 'mp3',
  defaultSampleRate: 24000
}
```

### 3. 部署云函数

在微信开发者工具中：
1. 右键点击 `cloudfunctions/tts` 文件夹
2. 选择"创建并部署：云端安装依赖"
3. 等待部署完成

### 4. 配置云开发环境（如需要）

如果使用指定环境，编辑 `app.js` 中的 `env` 字段：

```javascript
wx.cloud.init({
  env: '你的环境ID', // 从云开发控制台获取
  traceUser: true
})
```

## 可用音色列表

### 英文音色（推荐）
- `en_female_amanda_mars_bigtts` - Amanda（美式英语女声）
- `en_female_sarah_conversation_bigtts` - Sarah（英文女声）
- `en_male_adam_conversation_bigtts` - Adam（英文男声）

### 中文音色
- `zh_female_vv_uranus_bigtts` - Vivi 2.0
- `zh_male_m191_uranus_bigtts` - 云舟 2.0

## 调用方式

```javascript
var audioManager = require('../../utils/audioManager.js')

// 播放长文本（自动使用火山方舟TTS）
audioManager.playVolcano('Hello, how are you?', {
  speaker: 'en_female_amanda_mars_bigtts',
  onPlay: function() {
    console.log('开始播放')
  },
  onEnded: function() {
    console.log('播放结束')
  },
  onError: function(err) {
    console.error('播放失败:', err)
  }
})

// 播放单词（使用有道TTS）
audioManager.playYoudao('hello', {
  onError: function(err) {
    console.error('播放失败:', err)
  }
})
```

## 注意事项

1. 云函数有免费调用额度，超出后需要付费
2. 首次调用云函数可能较慢（冷启动），后续调用会更快
3. 音频文件会临时存储在用户目录，播放后自动清理
