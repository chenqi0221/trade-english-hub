var wordData = require('../../utils/wordData.js')

Page({
  data: {
    categories: [],
    todayWords: [],
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    },
    recentErrors: []
  },

  onLoad: function() {
    this.loadData()
  },

  onShow: function() {
    this.loadData()
  },

  loadData: function() {
    var categories = wordData.getCategories()
    var todayWords = wordData.getDailyWords(5)
    var progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    }
    var errorWords = wx.getStorageSync('errorWords') || []

    this.setData({
      categories: categories,
      todayWords: todayWords,
      studyProgress: progress,
      recentErrors: errorWords.slice(0, 5)
    })
  },

  // 跳转到单词练习
  goToWordPractice: function() {
    wx.navigateTo({
      url: '/package-study/pages/word-practice/word-practice'
    })
  },

  // 跳转到发音纠正
  goToPronunciation: function() {
    wx.navigateTo({
      url: '/package-practice/pages/pronunciation/pronunciation'
    })
  },

  // 查看单词详情
  viewWordDetail: function(e) {
    var word = e.currentTarget.dataset.word
    wx.navigateTo({
      url: '/package-study/pages/word-detail/word-detail?word=' + word
    })
  },

  // 跳转到错题本
  goToErrorBook: function() {
    wx.navigateTo({
      url: '/package-study/pages/error-book/error-book'
    })
  }
})
