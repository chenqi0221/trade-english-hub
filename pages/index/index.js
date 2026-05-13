var wordData = require('../../utils/wordData.js')
var sceneData = require('../../utils/sceneData.js')
var audioManager = require('../../utils/audioManager.js')
var quotes = require('../../utils/quotes.js')

Page({
  data: {
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    },
    dailyWord: {
      word: 'loading...',
      phonetic: '',
      meaning: '加载中...',
      example: '',
      date: ''
    },
    dailySentence: {
      text: 'Loading...',
      chinese: '加载中...',
      scene: '',
      date: ''
    },
    greeting: {
      text: '你好，外贸人 👋',
      sub: '坚持学习，成单更容易'
    },
    dailyQuote: {
      text: '',
      chinese: '',
      author: ''
    },
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

  onLoad: function() {
    this.loadGreeting()
    this.loadDailyContent()
    this.loadStudyProgress()
  },

  onShow: function() {
    this.loadStudyProgress()
  },

  onUnload: function() {
    audioManager.destroy()
  },

  loadGreeting: function() {
    try {
      var homeContent = quotes.getHomeContent()
      this.setData({
        greeting: {
          text: homeContent.greeting,
          sub: homeContent.subTitle
        },
        dailyQuote: homeContent.quote
      })
    } catch (err) {
      console.error('加载问候语失败:', err)
    }
  },

  loadDailyContent: function() {
    try {
      var dailyWord = wordData.getRandomWord()
      var scenes = sceneData.getAllScenes()
      
      if (!scenes || scenes.length === 0) {
        return
      }
      
      var randomScene = scenes[Math.floor(Math.random() * scenes.length)]
      
      if (!randomScene || !randomScene.dialogs || randomScene.dialogs.length === 0) {
        return
      }
      
      var randomDialog = randomScene.dialogs[Math.floor(Math.random() * randomScene.dialogs.length)]
      
      if (!dailyWord) {
        return
      }
      
      this.setData({
        dailyWord: {
          word: dailyWord.word || 'unknown',
          phonetic: dailyWord.phonetic || '',
          meaning: dailyWord.meaning || '',
          example: dailyWord.example || '',
          date: this.formatDate(new Date())
        },
        dailySentence: {
          text: randomDialog.text || '',
          chinese: randomDialog.chinese || '',
          scene: randomScene.name || '',
          date: this.formatDate(new Date())
        }
      })
    } catch (err) {
      console.error('加载每日内容失败:', err)
    }
  },

  loadStudyProgress: function() {
    try {
      var progress = wx.getStorageSync('studyProgress') || {}
      
      var masteredWords = 0
      var streakDays = 1
      var todayStudyTime = 0
      
      if (typeof progress.masteredWords === 'number') {
        masteredWords = progress.masteredWords
        streakDays = progress.streakDays || 1
        todayStudyTime = progress.todayStudyTime || 0
      } else {
        for (var key in progress) {
          if (progress[key] && typeof progress[key].mastered === 'number') {
            masteredWords += progress[key].mastered
          }
        }
      }
      
      this.setData({
        studyProgress: {
          totalWords: masteredWords + 100,
          masteredWords: masteredWords,
          todayStudyTime: todayStudyTime,
          streakDays: streakDays
        }
      })
    } catch (err) {
      console.error('加载学习进度失败:', err)
    }
  },

  formatDate: function(date) {
    try {
      var month = date.getMonth() + 1
      var day = date.getDate()
      var weekDays = ['日', '一', '二', '三', '四', '五', '六']
      var weekDay = weekDays[date.getDay()]
      return month + '月' + day + '日 周' + weekDay
    } catch (err) {
      return ''
    }
  },

  navigateToModule: function(e) {
    var page = e.currentTarget.dataset.page
    if (page) {
      wx.navigateTo({ url: page })
    }
  },

  viewDailyWord: function() {
    var dailyWord = this.data.dailyWord
    if (dailyWord && dailyWord.word && dailyWord.word !== 'loading...') {
      wx.navigateTo({
        url: '/pages/word-detail/word-detail?word=' + dailyWord.word
      })
    }
  },

  playDailyAudio: function() {
    var dailySentence = this.data.dailySentence
    console.log('playDailyAudio called, dailySentence:', dailySentence)
    
    if (!dailySentence || !dailySentence.text || dailySentence.text === 'Loading...') {
      wx.showToast({ title: '暂无内容可播放', icon: 'none' })
      return
    }

    var text = dailySentence.text.trim()
    console.log('Playing audio for text:', text)
    
    var self = this
    
    // 使用有道智云 TTS 播放
    var self = this
    audioManager.playYoudaoAPI(text, {
      onError: function(err) {
        console.error('有道智云TTS播放失败，尝试有道词典:', err)
        // 如果有道智云失败，回退到有道词典 TTS
        audioManager.playYoudao(text, {
          onError: function(err2) {
            console.error('有道词典TTS也失败:', err2)
            wx.showToast({ title: '音频播放失败', icon: 'none' })
          }
        })
      }
    })
  },

  playQuoteAudio: function() {
    var dailyQuote = this.data.dailyQuote
    if (!dailyQuote || !dailyQuote.text) {
      wx.showToast({ title: '暂无内容可播放', icon: 'none' })
      return
    }

    audioManager.playYoudaoAPI(dailyQuote.text, {
      onError: function(err) {
        console.error('有道智云名言播放失败，尝试有道词典:', err)
        // 如果有道智云失败，回退到有道词典 TTS
        audioManager.playYoudao(dailyQuote.text, {
          onError: function(err2) {
            console.error('有道词典名言也失败:', err2)
            wx.showToast({ title: '音频播放失败', icon: 'none' })
          }
        })
      }
    })
  },

  startLearning: function() {
    wx.switchTab({
      url: '/pages/study/study'
    })
  },

  onPullDownRefresh: function() {
    this.loadGreeting()
    this.loadDailyContent()
    this.loadStudyProgress()
    wx.stopPullDownRefresh()
  }
})
