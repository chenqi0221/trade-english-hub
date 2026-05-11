const wordData = require('../../utils/wordData.js')

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

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const categories = wordData.getCategories()
    const todayWords = wordData.getDailyWords(5)
    const progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    }
    const errorWords = wx.getStorageSync('errorWords') || []

    this.setData({
      categories,
      todayWords,
      studyProgress: progress,
      recentErrors: errorWords.slice(0, 5)
    })
  },

  // 跳转到单词练习
  goToWordPractice() {
    wx.navigateTo({
      url: '/pages/word-practice/word-practice'
    })
  },

  // 跳转到发音纠正
  goToPronunciation() {
    wx.navigateTo({
      url: '/pages/pronunciation/pronunciation'
    })
  },

  // 查看单词详情
  viewWordDetail(e) {
    const { word } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/word-detail/word-detail?word=${word}`
    })
  },

  // 跳转到错题本
  goToErrorBook() {
    wx.navigateTo({
      url: '/pages/error-book/error-book'
    })
  }
})
