const wordData = require('../../utils/wordData.js')
const sceneData = require('../../utils/sceneData.js')

Page({
  data: {
    userInfo: null,
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    },
    dailyWord: null,
    dailySentence: null,
    moduleList: [
      {
        id: 'word',
        name: '单词速记',
        icon: '📝',
        desc: '商务英语词库+打字练习',
        color: '#1E5F8E',
        page: '/pages/word-practice/word-practice'
      },
      {
        id: 'pronunciation',
        name: '发音纠正',
        icon: '🎵',
        desc: '正确发音+错误警示',
        color: '#FF6B35',
        page: '/pages/pronunciation/pronunciation'
      },
      {
        id: 'ai-chat',
        name: 'AI口语课',
        icon: '🤖',
        desc: '智能对话+影子跟读',
        color: '#52C41A',
        page: '/pages/ai-chat/ai-chat'
      },
      {
        id: 'scene',
        name: '场景演练',
        icon: '🎭',
        desc: '8大外贸场景模拟',
        color: '#722ED1',
        page: '/pages/scene-practice/scene-practice'
      }
    ]
  },

  onLoad() {
    this.loadDailyContent()
    this.loadStudyProgress()
  },

  onShow() {
    this.loadStudyProgress()
  },

  // 加载每日推荐内容
  loadDailyContent() {
    const dailyWord = wordData.getRandomWord()
    const scenes = sceneData.getAllScenes()
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)]
    const randomDialog = randomScene.dialogs[Math.floor(Math.random() * randomScene.dialogs.length)]
    
    this.setData({
      dailyWord: {
        ...dailyWord,
        date: this.formatDate(new Date())
      },
      dailySentence: {
        text: randomDialog.text,
        chinese: randomDialog.chinese,
        scene: randomScene.name,
        date: this.formatDate(new Date())
      }
    })
  },

  // 加载学习进度
  loadStudyProgress() {
    const progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 1
    }
    this.setData({ studyProgress: progress })
  },

  // 格式化日期
  formatDate(date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[date.getDay()]
    return `${month}月${day}日 周${weekDay}`
  },

  // 跳转到模块页面
  navigateToModule(e) {
    const { page } = e.currentTarget.dataset
    wx.navigateTo({ url: page })
  },

  // 查看每日单词详情
  viewDailyWord() {
    if (this.data.dailyWord) {
      wx.navigateTo({
        url: `/pages/word-detail/word-detail?word=${this.data.dailyWord.word}`
      })
    }
  },

  // 播放每日句子音频
  playDailyAudio() {
    if (this.data.dailySentence) {
      const innerAudioContext = wx.createInnerAudioContext()
      // 使用微信语音合成
      wx.request({
        url: 'https://dict.youdao.com/dictvoice',
        data: {
          audio: this.data.dailySentence.text,
          type: 2
        },
        success: () => {
          innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(this.data.dailySentence.text)}&type=2`
          innerAudioContext.play()
        }
      })
    }
  },

  // 开始学习
  startLearning() {
    wx.switchTab({
      url: '/pages/study/study'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadDailyContent()
    this.loadStudyProgress()
    wx.stopPullDownRefresh()
  }
})
