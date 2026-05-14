App({
  globalData: {
    userInfo: null,
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    },
    vocabData: {}
  },

  onLaunch: function() {
    console.log('=== 外贸英语通 启动 ===')

    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d8gqe1yynedf264b4',
        traceUser: true
      })
      console.log('云开发已初始化')
    } else {
      console.warn('云开发不可用')
    }

    this.loadStudyProgress()
    // 词库加载由 vocabLoader.js 自行处理
  },

  loadStudyProgress: function() {
    var progress = wx.getStorageSync('studyProgress')
    if (progress) {
      this.globalData.studyProgress = progress
    }
  },

  saveStudyProgress: function(progress) {
    this.globalData.studyProgress = progress
    wx.setStorageSync('studyProgress', progress)
  },

  // 词库数据由 vocabLoader 按需加载，不再预加载大文件
  preloadVocabData: function() {
    console.log('=== 词库按需加载模式，跳过预加载 ===')
  },

  /**
   * 获取词库数据 - 供 vocabLoader 使用
   */
  getVocabData: function(examId) {
    var data = this.globalData.vocabData[examId]
    console.log('getVocabData 被调用:', examId, '是否有数据:', !!data, '数量:', data ? data.length : 0)
    return data || null
  },

  /**
   * 云端TTS测试 — 控制台输入 getApp().testCloudTTS() 调用
   */
  testCloudTTS: function(text) {
    var audioManager = require('./utils/audioManager.js')
    audioManager.testCloudTTS(text)
  },

  /**
   * 测试云端词库加载 — 控制台输入 getApp().testCloudVocab() 调用
   */
  testCloudVocab: function() {
    var vocabLoader = require('./utils/vocabLoader.js')
    vocabLoader.testCloud(function(err, result) {
      if (err) {
        console.error('云端词库测试失败:', err)
        wx.showToast({ title: '云端测试失败', icon: 'none' })
      } else {
        console.log('云端词库测试成功:', result)
        wx.showModal({
          title: '云端测试成功',
          content: '词库数量: ' + result.count + '\n来源: ' + result.source,
          showCancel: false
        })
      }
    })
  },

  /**
   * 测试加载指定词库 — 控制台输入 getApp().testLoadVocab("cet4") 调用
   */
  testLoadVocab: function(examId) {
    examId = examId || 'cet4'
    var vocabLoader = require('./utils/vocabLoader.js')
    vocabLoader.load(examId, function(err, data) {
      if (err) {
        console.error('词库加载失败:', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      } else {
        console.log('词库加载成功:', examId, '数量:', data.length)
        wx.showModal({
          title: '词库加载成功',
          content: '考试: ' + examId + '\n数量: ' + data.length + '\n第一个: ' + (data[0] && data[0].word),
          showCancel: false
        })
      }
    })
  }
})
